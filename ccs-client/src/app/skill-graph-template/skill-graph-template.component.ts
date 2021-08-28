import { Component, OnInit } from "@angular/core";
import * as d3 from "../helper/d3jsImport";
import { SkillGraphData } from "../test/graph";

@Component({
  selector: "app-skill-graph-template",
  templateUrl: "./skill-graph-template.component.html",
  styleUrls: ["./skill-graph-template.component.scss"],
})
export class SkillGraphTemplateComponent implements OnInit {
  private color = d3.scaleOrdinal(d3.schemeDark2);
  private svgNS = "http://www.w3.org/2000/svg";
  private levels: any;
  private nodes: any;
  private nodes_index: any;
  private layout: any;
  private bundles: any;
  constructor() {}

  ngOnInit(): void {
    this.levels = SkillGraphData.levels;
    // precompute level depth
    this.levels.forEach((l: any, j: any) =>
      l.forEach((n: any) => (n.level = j))
    );

    this.nodes = this.levels.reduce((a: any, x: any) => a.concat(x), []);
    this.nodes_index = {};
    this.nodes.forEach((d: any) => (this.nodes_index[d.id] = d));

    // objectification
    this.nodes.forEach((d: any) => {
      d.parents = (d.parents === undefined ? [] : d.parents).map(
        (p: any) => this.nodes_index[p]
      );
    });

    // precompute bundles
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

    const links: any[] = [];
    this.nodes.forEach((d: any) => {
      d.parents.forEach((p: any) =>
        links.push({ source: d, bundle: d.bundle, target: p })
      );
    });

    this.bundles = this.levels.reduce(
      (a: any, x: any) => a.concat(x.bundles),
      []
    );

    // reverse pointer from parent to bundles
    this.bundles.forEach((b: any) =>
      b.parents.forEach((p: any) => {
        if (p.bundles_index === undefined) {
          p.bundles_index = {};
        }
        if (!(b.id in p.bundles_index)) {
          p.bundles_index[b.id] = [];
        }
        p.bundles_index[b.id].push(b);
      })
    );

    this.nodes.forEach((n: any) => {
      if (n.bundles_index !== undefined) {
        n.bundles = Object.keys(n.bundles_index).map((k) => n.bundles_index[k]);
      } else {
        n.bundles_index = {};
        n.bundles = [];
      }
      n.bundles.forEach((b: any, j: any) => (b.i = j));
    });

    links.forEach((l) => {
      if (l.bundle.links === undefined) {
        l.bundle.links = [];
      }
      l.bundle.links.push(l);
    });

    // layout
    const padding = 8;
    const node_height = 22;
    const node_width = 100;
    const bundle_width = 14;
    const level_y_padding = 16;
    const metro_d = 4;
    const c = 16;
    const min_family_height = 16;

    this.nodes.forEach(
      (n: any) => (n.height = (Math.max(1, n.bundles.length) - 1) * metro_d)
    );

    let x_offset = padding;
    let y_offset = padding;
    this.levels.forEach((l: any) => {
      x_offset += l.bundles.length * bundle_width;
      y_offset += level_y_padding;
      l.forEach((n: any, j: any) => {
        n.x = n.level * node_width + x_offset;
        n.y = node_height + y_offset + n.height / 2;

        y_offset += node_height + n.height;
      });
    });

    let i = 0;
    this.levels.forEach((l: any) => {
      l.bundles.forEach((b: any) => {
        b.x =
          b.parents[0].x +
          node_width +
          (l.bundles.length - 1 - b.i) * bundle_width;
        b.y = i * node_height;
      });
      i += l.length;
    });

    links.forEach((l) => {
      l.xt = l.target.x;
      l.yt =
        l.target.y +
        l.target.bundles_index[l.bundle.id].i * metro_d -
        (l.target.bundles.length * metro_d) / 2 +
        metro_d / 2;
      l.xb = l.bundle.x;
      l.xs = l.source.x;
      l.ys = l.source.y;
    });

    // compress vertical space
    let y_negative_offset = 0;
    this.levels.forEach((l: any) => {
      const min1 =
        d3.min(l.bundles, (b: any) => {
          return d3.min(b.links, (link: any) => {
            return link.ys - c - (link.yt + c);
          });
        }) || "0";
      const offset = parseInt(min1?.toString(), 10);
      y_negative_offset += -min_family_height + offset;
      l.forEach((n: any) => (n.y -= y_negative_offset));
    });

    // very ugly, I know
    links.forEach((l) => {
      l.yt =
        l.target.y +
        l.target.bundles_index[l.bundle.id].i * metro_d -
        (l.target.bundles.length * metro_d) / 2 +
        metro_d / 2;
      l.ys = l.source.y;
      l.c1 = l.source.level - l.target.level > 1 ? node_width / 2 + c : c;
      l.c2 = c;
    });

    const max = d3.max(this.nodes, (n: any) => n.y);
    let maxHeight = 0;
    if (max) {
      maxHeight = parseInt(max, 10);
    }
    this.layout = {
      height: maxHeight + node_height / 2 + 2 * padding,
      node_height,
      node_width,
      bundle_width,
      level_y_padding,
      metro_d,
    };

    // return {levels, nodes, nodes_index, links, bundles, layout}
  }

  private createGraph(): void {
    const svg = document.createElementNS(this.svgNS, "svg");
    svg.setAttributeNS(null, "width", "100%");
    svg.setAttributeNS(null, "height", this.layout.height);

    const style = document.createElementNS(this.svgNS, "style");
    style.appendChild(
      document.createTextNode(`
        text {
          font-family: sans-serif;
          font-size: 10px;
        }
        .node {
          stroke-linecap: round;
        }
        .link {
          fill: none;
        }

        `)
    );
    svg.appendChild(style);

    this.bundles.map((b: any) => {
      const d = b.links
        .map(
          (l: any) => `
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
      path_2.setAttributeNS(null, "stroke", this.color(b.id));
      path_2.setAttributeNS(null, "stroke-width", "2");
      path_2.setAttributeNS(null, "d", d);

      svg.appendChild(path_1);
      svg.appendChild(path_2);
    });

    this.nodes.map((n: any) => {
      const line_1 = document.createElementNS(this.svgNS, "line");
      line_1.setAttributeNS(null, "class", "node");
      line_1.setAttributeNS(null, "stroke", "black");
      line_1.setAttributeNS(null, "stroke-width", "8");
      line_1.setAttributeNS(null, "x1", n.x);
      line_1.setAttributeNS(null, "y1", (n.y - n.height / 2).toString());
      line_1.setAttributeNS(null, "x2", n.x);
      line_1.setAttributeNS(null, "y2", n.y + n.height / 2);

      const line_2 = document.createElementNS(this.svgNS, "line");
      line_2.setAttributeNS(null, "class", "node");
      line_2.setAttributeNS(null, "stroke", "white");
      line_2.setAttributeNS(null, "stroke-width", "4");
      line_2.setAttributeNS(null, "x1", n.x);
      line_2.setAttributeNS(null, "y1", (n.y - n.height / 2).toString());
      line_2.setAttributeNS(null, "x2", n.x);
      line_2.setAttributeNS(null, "y2", n.y + n.height / 2);

      const text_1 = document.createElementNS(this.svgNS, "text");
      text_1.setAttributeNS(null, "x", n.x + 4);
      text_1.setAttributeNS(null, "y", (n.y - n.height / 2 - 4).toString());
      text_1.setAttributeNS(null, "stroke", "white");
      text_1.setAttributeNS(null, "stroke-width", "2");
      text_1.appendChild(document.createTextNode(n.name));

      const text_2 = document.createElementNS(this.svgNS, "text");
      text_2.setAttributeNS(null, "x", n.x + 4);
      text_2.setAttributeNS(null, "y", (n.y - n.height / 2 - 4).toString());
      text_2.appendChild(document.createTextNode(n.name));

      svg.appendChild(line_1);
      svg.appendChild(line_2);
      svg.appendChild(text_1);
      svg.appendChild(text_2);
    });

    document.getElementById("graph")?.appendChild(svg);
  }
}
