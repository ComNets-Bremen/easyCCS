export class Node {
  public id = 0;
  public name = "";
  public label = "";
  public parents: Node[] = [];
  public bundle!: Bundle;
  public bundles: Bundle[] = [];
  public bundles_index: { [id: number]: Bundle } = {};
  public height = 0;
  public x = 0;
  public y = 0;
  public level = 0;
}

export class Link {
  public source!: Node;
  public target!: Node;
  public type = "";
  public bundle!: Bundle;
  public xt = 0;
  public yt = 0;
  public xb = 0;
  public xs = 0;
  public ys = 0;
  public c1 = 0;
  public c2 = 0;
}

export class Level {
  public bundles: Bundle[] = [];
  public id = 0;
  public name = "";
  public parent: number[] = [];
}

export class SkillGraphData {
  public nodes: Node[] = [];
  public links: Link[] = [];
}

export class Bundle {
  public id = 0;
  public links: Link[] = [];
  public parents: Node[] = [];
  public i = 0;
  public x = 0;
}
