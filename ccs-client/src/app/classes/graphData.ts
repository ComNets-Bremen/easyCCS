import { SimulationLinkDatum, SimulationNodeDatum } from "d3-force";

export class MyNode {
  public id: string | number = 0;
  public name = "";
  public label = "";
  public parents: MyNode[] = [];
  public bundle!: MyNode;
  public bundles: MyNode[] = [];
  public links: MyLink[] = [];
  public bundles_index: Map<string | number, MyNode[]> = new Map();
  public height = 0;
  public x = 0;
  public y = 0;
  public fx: number | undefined = undefined;
  public fy: number | undefined = undefined;
  public level = 0;
  public i = 0;
}

export class BaseNode {
  public id = 0;
  public name = "";
  public level = 0;
  public parents: number[] = [];
}

export class MyLink {
  public source!: MyNode;
  public target!: MyNode;
  public type = "";
  public bundle!: MyNode;
  public xt = 0;
  public yt = 0;
  public xb = 0;
  public xs = 0;
  public ys = 0;
  public c1 = 0;
  public c2 = 0;
}

export class SkillGraphData {
  public nodes: MyNode[] = [];
  public links: MyLink[] = [];
}

export class NodeDatum implements SimulationNodeDatum {}

export class LinkDatum implements SimulationLinkDatum<NodeDatum> {
  public source!: string | number | NodeDatum;
  public target!: string | number | NodeDatum;
  public index?: number | undefined;
}
