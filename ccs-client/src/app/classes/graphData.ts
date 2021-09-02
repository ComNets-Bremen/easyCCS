import { Identifiers } from "@angular/compiler";

export class Node {
  public id: string | number = 0;
  public name = "";
  public label = "";
  public parents: Node[] = [];
  public bundle!: Node;
  public bundles: Node[] = [];
  public links: Link[] = [];
  public bundles_index: Map<string | number, Node[]> = new Map();
  public height = 0;
  public x = 0;
  public y = 0;
  public level = 0;
  public i = 0;
}

export class BaseNode {
  public id = 0;
  public name = "";
  public level = 0;
  public parents: number[] = [];
}

export class Link {
  public source!: Node;
  public target!: Node;
  public type = "";
  public bundle!: Node;
  public xt = 0;
  public yt = 0;
  public xb = 0;
  public xs = 0;
  public ys = 0;
  public c1 = 0;
  public c2 = 0;
}

// export class Level {
//   public bundles: Bundle[] = [];
//   public id = 0;
//   public name = "";
//   public parent: number[] = [];
// }

export class SkillGraphData {
  public nodes: Node[] = [];
  public links: Link[] = [];
}

// export class Bundle {
//   public id = 0;
//   public links: Link[] = [];
//   public parents: Node[] = [];
//   public i = 0;
//   public x = 0;
// }
