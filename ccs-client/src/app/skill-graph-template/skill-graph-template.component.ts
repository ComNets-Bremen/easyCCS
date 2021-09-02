import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { BaseNode, Link, Node } from "../classes/graphData";
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
  private levels: Array<Array<BaseNode>> = [];
  private nodes: Node[] = [];
  private nodes_index: Map<number | string, Node> = new Map();
  // helper to prevent mixed array/oject array like in original code
  private level_bundles: Map<number, Node[]> = new Map();
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
    // precompute level depth
    this.preComputeLevelDepth();

    // precompute bundles
    this.precomputeBundles();

    // reverse pointer from parent to bundles
    this.setBundlePointer();

    // layout
    setTimeout(() => {
      this.createBaseLayout();
      this.createGraph();
    }, 10);

    // return {levels, nodes, nodes_index, links, bundles, layout}
  }

  private preComputeLevelDepth(): void {
    this.levels.forEach((l: BaseNode[], j: number) =>
      l.forEach((n: BaseNode) => (n.level = j))
    );

    // this.nodes = this.levels.((a: Node[], x: Node[]) => a.concat(x), []);
    const baseNodes = this.levels.flat();
    for (const node of baseNodes) {
      const newNode = new Node();
      newNode.parents = [];
      newNode.name = node.name;
      newNode.level = node.level;
      newNode.id = node.id;
      this.nodes_index.set(node.id, newNode);
      this.nodes.push(newNode);
    }

    // objectification
    this.nodes.forEach((n: Node) => {
      for (const baseNode of baseNodes) {
        if (baseNode.id === n.id) {
          for (const parentId of baseNode.parents) {
            const parent = this.nodes_index.get(parentId);
            if (parent) {
              n.parents.push(parent);
            }
          }
        }
      }
    });
  }

  private precomputeBundles(): void {
    this.level_bundles = new Map();
    this.levels.forEach((l: BaseNode[], j: number) => {
      const index = new Map<string, Node>();
      l.forEach((n: BaseNode, i: number) => {
        if (n.parents.length === 0) {
          return;
        }
        const node = this.nodes_index.get(n.id);
        if (!node) {
          return;
        }
        const id = node.parents
          .map((d: Node) => d.id)
          .sort()
          .join("--");
        const bNode: Node | undefined = index.get(id);
        if (bNode) {
          bNode.parents = bNode.parents.concat(node.parents);
        } else {
          const newNode = new Node();
          newNode.id = id;
          newNode.id = node.name;
          newNode.parents = node.parents.slice();
          newNode.level = j;
          index.set(id, newNode);
        }
        const bNodeNew = index.get(id);
        if (bNodeNew) {
          node.bundle = bNodeNew;
        }
      });
      const nodeList: Node[] = [];
      index.forEach((nodes) => {
        nodeList.push(nodes);
      });
      if (nodeList && nodeList.length > 0) {
        this.level_bundles.set(j, nodeList);
        this.level_bundles.get(j)?.forEach((b: Node, t: number) => (b.i = t));
      }
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
  }

  private setBundlePointer(): void {
    const bundles: Node[] = [];
    for (const [key, value] of this.level_bundles) {
      Array.prototype.push.apply(bundles, value);
    }
    bundles.forEach((bundle) =>
      bundle.parents.forEach((node: Node) => {
        if (!node.bundles_index) {
          node.bundles_index = new Map();
        }
        if (!(bundle.id in node.bundles_index)) {
          node.bundles_index.set(bundle.id, []);
        }
        node.bundles_index.get(bundle.id)?.push(bundle);
      })
    );

    this.nodes.forEach((node: Node) => {
      if (node.bundles_index !== undefined) {
        for (const k in node.bundles_index) {
          if (k) {
            const ele = node.bundles_index.get(k);
            if (ele) {
              Array.prototype.push.apply(node.bundles, ele);
            }
          }
        }
      } else {
        node.bundles_index = new Map();
        node.bundles = [];
      }
      node.bundles.forEach((b: Node, j: number) => (b.i = j));
    });

    this.links.forEach((link: Link) => {
      if (link.bundle.links === undefined) {
        link.bundle.links = [];
      }
      link.bundle.links.push(link);
    });
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
    this.levels.forEach((l: BaseNode[], t: number) => {
      let bundles = this.level_bundles.get(t);
      if (!bundles) {
        bundles = [];
      }
      x_offset += bundles.length * bundle_width;
      y_offset += level_y_padding;
      l.forEach((n: any, j: any) => {
        n.x = n.level * node_width + x_offset;
        n.y = node_height + y_offset + n.height / 2;

        y_offset += node_height + n.height;
      });
    });

    let i = 0;
    this.levels.forEach((level: BaseNode[], index: number) => {
      let bundles = this.level_bundles.get(index);
      let bundlesLength = 0;
      if (!bundles) {
        bundles = [];
      } else {
        bundlesLength = bundles.length;
      }
      bundles.forEach((bundle: Node) => {
        bundle.x =
          bundle.parents[0].x +
          node_width +
          (bundlesLength - 1 - bundle.i) * bundle_width;
        bundle.y = i * node_height;
      });
      i += level.length;
    });

    this.links.forEach((link: Link) => {
      link.xt = link.target.x;
      let iCounter = 0;
      let index = 0;
      link.target.bundles_index.forEach((nodes, key) => {
        if (key === link.bundle.id) {
          index = iCounter;
        }
        iCounter++;
      });
      link.yt =
        link.target.y +
        index * metro_d -
        (link.target.bundles.length * metro_d) / 2 +
        metro_d / 2;
      link.xb = link.bundle.x;
      link.xs = link.source.x;
      link.ys = link.source.y;
    });

    // compress vertical space
    let y_negative_offset = 0;
    this.levels.forEach((nodes: BaseNode[], index: number) => {
      const bundles = this.level_bundles.get(index);
      if (bundles) {
        const min1 =
          d3.min(bundles, (bundle: Node) => {
            return d3.min(bundle.links, (link: Link) => {
              return link.ys - c - (link.yt + c);
            });
          }) || "0";
        const offset = parseInt(min1?.toString(), 10);
        y_negative_offset += -min_family_height + offset;
        nodes.forEach((n: BaseNode) => {
          const node = this.nodes_index.get(n.id);
          if (node) {
            node.y -= y_negative_offset;
          }
        });
      }
    });

    // very ugly, I know
    this.links.forEach((link: Link) => {
      let iCounter = 0;
      let index = 0;
      link.target.bundles_index.forEach((nodes, key) => {
        if (key === link.bundle.id) {
          index = iCounter;
        }
        iCounter++;
      });
      link.yt =
        link.target.y +
        index * metro_d -
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

  private createGraph(): void {
    const bundles: Node[] = [];
    this.level_bundles.forEach((nodes) => {
      Array.prototype.push.apply(bundles, nodes);
    });
    bundles.map((node: Node) => {
      const d = node.links
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
      path_2.setAttributeNS(null, "stroke", this.color(node.id.toString()));
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
