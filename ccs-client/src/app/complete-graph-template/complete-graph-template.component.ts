import { AfterViewInit, Component, OnInit } from "@angular/core";
import * as d3 from "d3";
import { Simulation, ForceLink, SimulationNodeDatum } from "d3";
import {
  NodeDatum,
  LinkDatum,
  SkillGraphData,
  MyNode,
  MyLink,
} from "../classes/graphData";
import { HttpService } from "../services/http.service";

@Component({
  selector: "app-complete-graph-template",
  templateUrl: "./complete-graph-template.component.svg",
  styleUrls: ["./complete-graph-template.component.scss"],
})
export class CompleteGraphTemplateComponent implements OnInit, AfterViewInit {
  public graphWidth = 1000;
  public graphHeight = 800;
  private svg!: d3.Selection<SVGElement, any, any, any>;
  private node!: d3.Selection<SVGGElement, any, SVGElement, any>;
  private link!: d3.Selection<SVGLineElement, any, SVGElement, any>;
  private simulation!: Simulation<NodeDatum, LinkDatum>;
  private edgepaths!: d3.Selection<SVGPathElement, any, SVGElement, any>;
  private edgelabels!: d3.Selection<SVGTextElement, any, SVGElement, any>;
  private colors = d3.scaleOrdinal(d3.schemeCategory10);

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.checkWindowSize();
  }

  private checkWindowSize() {
    const ele = document.getElementById("svg");
    const height = window.screen.height;
    setTimeout(() => {
      this.graphHeight = ele?.parentElement?.parentElement?.clientHeight
        ? ele?.parentElement?.parentElement?.clientHeight
        : 800;
      this.graphWidth = ele?.parentElement?.parentElement?.clientWidth
        ? ele?.parentElement?.parentElement?.clientWidth
        : 800;
      this.initGraph();
    }, 1);
  }

  private initGraph(): void {
    this.httpService
      .getCompleteGraphData()
      .subscribe((completeGraphData: SkillGraphData) => {
        this.createSvg();
        this.update(completeGraphData.links, completeGraphData.nodes);
      });
  }

  private createSvg(): void {
    this.svg = d3.select("#svg");

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
          .id(
            (d: any) =>
              // keep any to prevent compiler errors
              d.id
          )
          .distance(100)
          .strength(1)
      )
      .force("charge", d3.forceManyBody())
      .force(
        "center",
        d3.forceCenter(this.graphWidth / 2, this.graphHeight / 2)
      );
  }

  private update(links: MyLink[], nodes: MyNode[]): void {
    this.link = this.svg
      .selectAll(".link")
      .data(links)
      .enter()
      .append("line")
      .attr("class", "link")
      .attr("marker-end", "url(#arrowhead)");

    this.link.append("title").text((d: MyLink) => d.type);

    this.edgepaths = this.svg
      .selectAll(".edgepath")
      .data(links)
      .enter()
      .append("path")
      .attr("class", "edgepath")
      .attr("fill-opacity", 0)
      .attr("stroke-opacity", 0)
      .attr("id", (d: MyLink, i: number) => "edgepath" + i)
      .style("pointer-events", "none");

    this.edgelabels = this.svg
      .selectAll(".edgelabel")
      .data(links)
      .enter()
      .append("text")
      .style("pointer-events", "none")
      .attr("class", "edgelabel")
      .attr("id", (d: MyLink, i: number) => "edgelabel" + i)
      .attr("font-size", 10)
      .attr("fill", "#aaa");

    this.edgelabels
      .append("textPath")
      .attr("href", (d: MyLink, i: number) => `#edgepath${i}`)
      .style("text-anchor", "middle")
      .style("pointer-events", "none")
      .attr("startOffset", "50%")
      .text((d: MyLink) => d.type);

    this.node = this.svg
      .selectAll(".node")
      .data<MyNode>(nodes)
      .enter()
      .append<SVGGElement>("g")
      .attr("class", "node")
      .call(
        d3
          .drag<SVGGElement, MyNode>()
          .on("start", (event, ele) => this.dragstarted(event, ele))
          .on("drag", (event, ele) => this.dragged(event, ele))
        // .on("end", (event, ele) => this.dragend(event, ele))
      );

    this.node
      .append("circle")
      .attr("r", 5)
      .style("fill", (d: MyNode, i: number) => this.colors(i.toString()));

    this.node.append("title").text((d: MyNode) => d.id);

    this.node
      .append("text")
      .attr("dy", -3)
      .text((d: MyNode) => {
        if (d.label !== "") {
          return d.name + ":" + d.label;
        } else {
          return d.name;
        }
      });

    this.simulation.nodes(nodes).on("tick", () => this.ticked());

    this.simulation
      ?.force<ForceLink<NodeDatum, LinkDatum>>("link")
      ?.links(links);
  }

  private ticked(): void {
    this.link
      .attr("x1", (d: MyLink) => (d.source as MyNode).x)
      .attr("y1", (d: MyLink) => (d.source as MyNode).y)
      .attr("x2", (d: MyLink) => (d.target as MyNode).x)
      .attr("y2", (d: MyLink) => (d.target as MyNode).y);

    this.node.attr(
      "transform",
      (d: MyNode) => "translate(" + d.x + ", " + d.y + ")"
    );

    this.edgepaths.attr(
      "d",
      (d: MyLink) =>
        "M " +
        (d.source as MyNode).x +
        " " +
        (d.source as MyNode).y +
        " L " +
        (d.target as MyNode).x +
        " " +
        (d.target as MyNode).y
    );

    this.edgelabels.attr(
      "transform",
      (d: MyLink, i: number, ele: SVGTextElement[] | any) => {
        if ((d.source as MyNode).x < (d.source as MyNode).x) {
          const bbox = ele[i].getBBox();

          const rx = bbox.x + bbox.width / 2;
          const ry = bbox.y + bbox.height / 2;
          return "rotate(180 " + rx + " " + ry + ")";
        } else {
          return "rotate(0)";
        }
      }
    );
  }

  private dragstarted(event: DragEvent, d: MyNode): void {
    this.simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  private dragged(event: DragEvent, d: MyNode): void {
    d.fx = event.x;
    d.fy = event.y;
  }

  // private dragend(event: DragEvent, d: MyNode): void {
  //   this.simulation.alphaTarget(0.3);
  //   d.fx = undefined;
  //   d.fy = undefined;
  // }
}
