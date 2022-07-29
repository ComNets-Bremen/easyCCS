export class BaseGraphConfiguration {
  public id!: number;
  public title!: string;
}

export class GraphConfiguration {
  public required_skills: number[] = [];
  public known_skills: number[] = [];
  public title = "";
}
