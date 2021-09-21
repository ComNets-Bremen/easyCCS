import { Component, OnInit } from "@angular/core";
import { SkillGraphData } from "../classes/graphData";
import * as d3 from "../helper/d3jsImport";
import { HttpService } from "../services/http.service";
import { GraphDataDemo } from "../test/graph";

@Component({
  selector: "app-complete-graph",
  templateUrl: "./complete-graph.component.html",
  styleUrls: ["./complete-graph.component.scss"],
})
export class CompleteGraphComponent implements OnInit {
  private svg: any;
  private width = 0;
  private height = 0;
  private node: any;
  private link: any;
  private simulation: any;
  private edgepaths: any;
  private edgelabels: any;
  private colors = d3.scaleOrdinal(d3.schemeCategory10);

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.svg = d3.select("svg");
    this.width = +this.svg.attr("width");
    this.height = +this.svg.attr("height");
    // this.node,
    // this.link;

    this.svg
      .append("defs")
      .append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "-0 -5 10 10")
      .attr("refX", 13)
      .attr("refY", 0)
      .attr("orient", "auto")
      .attr("markerWidth", 13)
      .attr("markerHeight", 13)
      .attr("xoverflow", "visible")
      .append("svg:path")
      .attr("d", "M 0,-5 L 10 ,0 L 0,5")
      .attr("fill", "#999")
      .style("stroke", "none");

    this.simulation = d3
      .forceSimulation()
      .force(
        "link",
        d3
          .forceLink()
          .id((d: any) => {
            return d.id;
          })
          .distance(100)
          .strength(1)
      )
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(this.width / 2, this.height / 2));

    this.httpService
      .getCompleteGraphData()
      .subscribe((completeGraphData: SkillGraphData) => {
        this.update(completeGraphData.links, completeGraphData.nodes);
      });
  }

  private update(links: any, nodes: any): void {
    this.link = this.svg
      .selectAll(".link")
      .data(links)
      .enter()
      .append("line")
      .attr("class", "link")
      .attr("marker-end", "url(#arrowhead)");

    this.link.append("title").text((d: any) => {
      return d.type;
    });

    this.edgepaths = this.svg
      .selectAll(".edgepath")
      .data(links)
      .enter()
      .append("path")
      .attr("class", "edgepath")
      .attr("fill-opacity", 0)
      .attr("stroke-opacity", 0)
      .attr("id", (d: any, i: any) => {
        return "edgepath" + i;
      })
      .style("pointer-events", "none");

    this.edgelabels = this.svg
      .selectAll(".edgelabel")
      .data(links)
      .enter()
      .append("text")
      .style("pointer-events", "none")
      .attr("class", "edgelabel")
      .attr("id", (d: any, i: any) => {
        return "edgelabel" + i;
      })
      .attr("font-size", 10)
      .attr("fill", "#aaa");

    this.edgelabels
      .append("textPath")
      .attr("xlink:href", (d: any, i: any) => {
        return "#edgepath" + i;
      })
      .style("text-anchor", "middle")
      .style("pointer-events", "none")
      .attr("startOffset", "50%")
      .text((d: any) => {
        return d.type;
      });

    this.node = this.svg
      .selectAll(".node")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .call(
        d3
          .drag()
          .on("start", (event: any, d: any) => this.dragstarted(event, d))
          .on("drag", (event: any, d: any) => this.dragged(event, d))
        // .on("end", dragended)
      );

    this.node
      .append("circle")
      .attr("r", 5)
      .style("fill", (d: any, i: any) => {
        return this.colors(i);
      });

    this.node.append("title").text((d: any) => {
      return d.id;
    });

    this.node
      .append("text")
      .attr("dy", -3)
      .text((d: any) => {
        if (d.label !== "") {
          return d.name + ":" + d.label;
        } else {
          return d.name;
        }
      });

    this.simulation.nodes(nodes).on("tick", () => this.ticked());

    this.simulation.force("link").links(links);
  }

  private ticked(): void {
    this.link
      .attr("x1", (d: any) => {
        return d.source.x;
      })
      .attr("y1", (d: any) => {
        return d.source.y;
      })
      .attr("x2", (d: any) => {
        return d.target.x;
      })
      .attr("y2", (d: any) => {
        return d.target.y;
      });

    this.node.attr("transform", (d: any) => {
      return "translate(" + d.x + ", " + d.y + ")";
    });

    this.edgepaths.attr("d", (d: any) => {
      return (
        "M " +
        d.source.x +
        " " +
        d.source.y +
        " L " +
        d.target.x +
        " " +
        d.target.y
      );
    });

    this.edgelabels.attr("transform", (d: any, i: any, ele: any) => {
      if (d.target.x < d.source.x) {
        const bbox = ele[i].getBBox();

        const rx = bbox.x + bbox.width / 2;
        const ry = bbox.y + bbox.height / 2;
        return "rotate(180 " + rx + " " + ry + ")";
      } else {
        return "rotate(0)";
      }
    });
  }

  private dragstarted(event: any, d: any): void {
    if (!event.active) {
      this.simulation.alphaTarget(0.3).restart();
    }
    d.fx = d.x;
    d.fy = d.y;
  }

  private dragged(event: any, d: any): void {
    d.fx = event.x;
    d.fy = event.y;
  }
}
