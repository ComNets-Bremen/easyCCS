import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { Bundle, Level, Link, Node } from "../classes/graphData";
import { Skill } from "../classes/skill";
import * as d3 from "../helper/d3jsImport";
import { HttpService } from "../services/http.service";

@Component({
  selector: "app-skill-graph-template",
  templateUrl: "./skill-graph-template.component.svg",
  styleUrls: ["./skill-graph-template.component.scss"],
})
export class SkillGraphTemplateComponent implements OnInit, AfterViewInit {
  @ViewChild("svg", { read: ElementRef }) svg!: ElementRef;
  @Input() reqSkills: Skill[] = [];
  @Input() newSkills: Skill[] = [];
  @Input() title = "";

  public layout: any;
  private color = d3.scaleOrdinal(d3.schemeDark2);
  private svgNS = "http://www.w3.org/2000/svg";
  private levels: [][] = [];
  private nodes: Node[] = [];
  private nodes_index: { [id: number]: Node } = {};

  private bundles: Bundle[] = [];
  private links: Link[] = [];

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.layout = {};
    this.layout.height = 0;
  }

  ngAfterViewInit(): void {
    this.httpService
      .getLevels(
        this.reqSkills.map((ele) => ele.id),
        this.newSkills.map((ele) => ele.id)
      )
      .subscribe((levels: [][]) => {
        this.levels = levels;
        this.initGraph();
      });
  }

  private initGraph(): void {
    // layout
    this.createBaseLayout();
    this.createGraph();

    // precompute level depth
    this.preComputeLevelDepth();

    // precompute bundles
    this.precomputeBundles();

    // reverse pointer from parent to bundles
    this.setBundlePointer();

    // return {levels, nodes, nodes_index, links, bundles, layout}
  }

  private createBaseLayout(): void {
    const padding = 8;
    const node_height = 22;
    const node_width = 100;
    const bundle_width = 14;
    const level_y_padding = 16;
    const metro_d = 4;
    const c = 16;
    const min_family_height = 16;

    this.nodes.forEach(
      (n: Node) => (n.height = (Math.max(1, n.bundles.length) - 1) * metro_d)
    );

    let x_offset = padding;
    let y_offset = padding;
    this.levels.forEach((l: Level[]) => {
      x_offset += l.bundles.length * bundle_width;
      y_offset += level_y_padding;
      l.forEach((n: any, j: any) => {
        n.x = n.level * node_width + x_offset;
        n.y = node_height + y_offset + n.height / 2;

        y_offset += node_height + n.height;
      });
    });

    let i = 0;
    this.levels.forEach((level: Level[]) => {
      level.bundles.forEach((bundle: Bundle) => {
        bundle.x =
          bundle.parents[0].x +
          node_width +
          (level.bundles.length - 1 - bundle.i) * bundle_width;
        bundle.y = i * node_height;
      });
      i += level.length;
    });

    this.links.forEach((link: Link) => {
      link.xt = link.target.x;
      link.yt =
        link.target.y +
        link.target.bundles_index[link.bundle.id].i * metro_d -
        (link.target.bundles.length * metro_d) / 2 +
        metro_d / 2;
      link.xb = link.bundle.x;
      link.xs = link.source.x;
      link.ys = link.source.y;
    });

    // compress vertical space
    let y_negative_offset = 0;
    this.levels.forEach((level: Level[]) => {
      const min1 =
        d3.min(level.bundles, (bundle: Bundle) => {
          return d3.min(bundle.links, (link: any) => {
            return link.ys - c - (link.yt + c);
          });
        }) || "0";
      const offset = parseInt(min1?.toString(), 10);
      y_negative_offset += -min_family_height + offset;
      // level.forEach((n: any) => (n.y -= y_negative_offset));
    });

    // very ugly, I know
    this.links.forEach((link: Link) => {
      link.yt =
        link.target.y +
        link.target.bundles_index[link.bundle.id].i * metro_d -
        (link.target.bundles.length * metro_d) / 2 +
        metro_d / 2;
      link.ys = link.source.y;
      link.c1 =
        link.source.level - link.target.level > 1 ? node_width / 2 + c : c;
      link.c2 = c;
    });

    let max = d3.max(this.nodes, (node: Node) => node.y);
    // check possible null
    max = max ? max : 0;
    this.layout = {
      height: max + node_height / 2 + 2 * padding,
      node_height,
      node_width,
      bundle_width,
      level_y_padding,
      metro_d,
    };
  }

  private setBundlePointer(): void {
    this.bundles.forEach((bundle: Bundle) =>
      bundle.parents.forEach((node: Node) => {
        if (node.bundles_index === undefined) {
          node.bundles_index = {};
        }
        if (!(bundle.id in node.bundles_index)) {
          node.bundles_index[bundle.id] = [];
        }
        node.bundles_index[bundle.id].push(bundle);
      })
    );

    this.nodes.forEach((node: Node) => {
      if (node.bundles_index !== undefined) {
        for (const k in node.bundles_index) {
          if (node.bundles_index[k]) {
            node.bundles.push.apply(node.bundles_index[k]);
          }
        }
      } else {
        node.bundles_index = {};
        node.bundles = [];
      }
      node.bundles.forEach((b: any, j: any) => (b.i = j));
    });

    this.links.forEach((link: Link) => {
      if (link.bundle.links === undefined) {
        link.bundle.links = [];
      }
      link.bundle.links.push(link);
    });
  }

  private precomputeBundles(): void {
    this.levels.forEach((l: any, j: any) => {
      const index: any = {};
      l.forEach((n: any) => {
        if (n.parents.length === 0) {
          return;
        }

        const id = n.parents
          .map((d: any) => d.id)
          .sort()
          .join("--");
        if (id in index) {
          index[id].parents = index[id].parents.concat(n.parents);
        } else {
          index[id] = { id, parents: n.parents.slice(), level: j };
        }
        n.bundle = index[id];
      });
      l.bundles = Object.keys(index).map((k) => index[k]);
      l.bundles.forEach((b: any, t: any) => (b.i = t));
    });

    this.nodes.forEach((node: Node) => {
      node.parents.forEach((pNode: Node) => {
        const link = new Link();
        link.source = node;
        link.bundle = node.bundle;
        link.target = pNode;
        this.links.push(link);
      });
    });

    this.bundles = this.levels.reduce(
      (a: Node, x: Node) => a.concat(x.bundles),
      []
    );
  }

  private preComputeLevelDepth(): void {
    this.levels.forEach((l: [], j: number) =>
      l.forEach((n: Node) => (n.level = j))
    );

    this.nodes = this.levels.reduce((a: Node[], x: Node[]) => a.concat(x), []);
    this.nodes_index = {};
    this.nodes.forEach((d: Node) => (this.nodes_index[d.id] = d));

    // objectification
    this.nodes.forEach((d: Node) => {
      d.parents = (d.parents === undefined ? [] : d.parents).map(
        (p: Node) => this.nodes_index[p]
      );
    });
  }

  private createGraph(): void {
    this.bundles.map((bundle: Bundle) => {
      const d = bundle.links
        .map(
          (l: Link) => `
            M${l.xt} ${l.yt}
            L${l.xb - l.c1} ${l.yt}
            A${l.c1} ${l.c1} 90 0 1 ${l.xb} ${l.yt + l.c1}
            L${l.xb} ${l.ys - l.c2}
            A${l.c2} ${l.c2} 90 0 0 ${l.xb + l.c2} ${l.ys}
            L${l.xs} ${l.ys}`
        )
        .join("");

      const path_1 = document.createElementNS(this.svgNS, "path");
      path_1.setAttributeNS(null, "class", "link");
      path_1.setAttributeNS(null, "stroke", "white");
      path_1.setAttributeNS(null, "stroke-width", "5");
      path_1.setAttributeNS(null, "d", d);

      const path_2 = document.createElementNS(this.svgNS, "path");
      path_2.setAttributeNS(null, "class", "link");
      path_2.setAttributeNS(null, "stroke", this.color(bundle.id.toString()));
      path_2.setAttributeNS(null, "stroke-width", "2");
      path_2.setAttributeNS(null, "d", d);

      this.svg.nativeElement.appendChild(path_1);
      this.svg.nativeElement.appendChild(path_2);
    });

    this.nodes.map((n: Node) => {
      const line_1 = document.createElementNS(this.svgNS, "line");
      line_1.setAttributeNS(null, "class", "node");
      line_1.setAttributeNS(null, "stroke", "black");
      line_1.setAttributeNS(null, "stroke-width", "8");
      line_1.setAttributeNS(null, "x1", n.x.toString());
      line_1.setAttributeNS(null, "y1", (n.y - n.height / 2).toString());
      line_1.setAttributeNS(null, "x2", n.x.toString());
      line_1.setAttributeNS(null, "y2", (n.y + n.height / 2).toString());

      const line_2 = document.createElementNS(this.svgNS, "line");
      line_2.setAttributeNS(null, "class", "node");
      line_2.setAttributeNS(null, "stroke", "white");
      line_2.setAttributeNS(null, "stroke-width", "4");
      line_2.setAttributeNS(null, "x1", n.x.toString());
      line_2.setAttributeNS(null, "y1", (n.y - n.height / 2).toString());
      line_2.setAttributeNS(null, "x2", n.x.toString());
      line_2.setAttributeNS(null, "y2", (n.y + n.height / 2).toString());

      const text_1 = document.createElementNS(this.svgNS, "text");
      text_1.setAttributeNS(null, "x", (n.x + 4).toString());
      text_1.setAttributeNS(null, "y", (n.y - n.height / 2 - 4).toString());
      text_1.setAttributeNS(null, "stroke", "white");
      text_1.setAttributeNS(null, "stroke-width", "2");
      text_1.appendChild(document.createTextNode(n.name));

      const text_2 = document.createElementNS(this.svgNS, "text");
      text_2.setAttributeNS(null, "x", (n.x + 4).toString());
      text_2.setAttributeNS(null, "y", (n.y - n.height / 2 - 4).toString());
      text_2.appendChild(document.createTextNode(n.name));

      this.svg.nativeElement.appendChild(line_1);
      this.svg.nativeElement.appendChild(line_2);
      this.svg.nativeElement.appendChild(text_1);
      this.svg.nativeElement.appendChild(text_2);
    });

    // document.getElementById("graph")?.appendChild(this.svg);
  }
}
