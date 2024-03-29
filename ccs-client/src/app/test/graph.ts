import {
  BaseGraphConfiguration,
  GraphConfiguration,
} from "../classes/configuration";
import { BaseNode, MyLink, MyNode, SkillGraphData } from "../classes/graphData";
import { SkillTestData } from "./testdata";

export class GraphDataDemo {
  static demo: SkillGraphData = new SkillGraphData();

  // static demo = {
  //   nodes: [
  //     {
  //       id: 5,
  //       name: "teachs word",
  //       label: "",
  //     },
  //     {
  //       id: 4,
  //       name: "Final",
  //       label: "",
  //     },
  //     {
  //       id: 3,
  //       name: "Need Word, give excel",
  //       label: "",
  //     },
  //     {
  //       id: 2,
  //       name: "Needs Word, gives final",
  //       label: "",
  //     },
  //   ],
  //   links: [
  //     {
  //       source: 5,
  //       target: 4,
  //       type: "Word Learning",
  //     },
  //     {
  //       source: 3,
  //       target: 4,
  //       type: "Excel learning",
  //     },
  //     {
  //       source: 5,
  //       target: 3,
  //       type: "Word Learning",
  //     },
  //     {
  //       source: 5,
  //       target: 2,
  //       type: "Word Learning",
  //     },
  //   ],
  // };
  static demoData = {
    nodes: [
      {
        id: 22,
        name: "Addition mit \u00dcbertrag",
        label: "",
      },
      {
        id: 21,
        name: "Subtraktion ohne \u00dcbertrag",
        label: "",
      },
      {
        id: 20,
        name: "Addition ohne \u00dcbertrag",
        label: "",
      },
      {
        id: 19,
        name: "Zahlen bis 100",
        label: "",
      },
      {
        id: 18,
        name: "Zahlen bis 10",
        label: "",
      },
      {
        id: 17,
        name: "While Loops in Python",
        label: "",
      },
      {
        id: 15,
        name: "Control structures",
        label: "",
      },
      {
        id: 14,
        name: "Loops",
        label: "",
      },
      {
        id: 12,
        name: "Conditions in programming languages",
        label: "",
      },
      {
        id: 11,
        name: "Hello World (Python)",
        label: "",
      },
      {
        id: 10,
        name: "What is an IDE?",
        label: "",
      },
      {
        id: 9,
        name: "What is a text editor",
        label: "",
      },
      {
        id: 4,
        name: "Install Anaconda",
        label: "",
      },
      {
        id: 3,
        name: "For loop in Python",
        label: "",
      },
      {
        id: 2,
        name: "What is a loop? (Theory)",
        label: "",
      },
      {
        id: 1,
        name: "For Loop in C",
        label: "",
      },
    ],
    links: [
      {
        source: 21,
        target: 22,
        type: "Subtraktion ohne \u00dcbertrag",
      },
      {
        source: 20,
        target: 22,
        type: "Addition ohne \u00dcbertrag",
      },
      {
        source: 19,
        target: 22,
        type: "Zahlen < 100",
      },
      {
        source: 20,
        target: 21,
        type: "Addition ohne \u00dcbertrag",
      },
      {
        source: 18,
        target: 21,
        type: "Zahlen < 10",
      },
      {
        source: 18,
        target: 20,
        type: "Zahlen < 10",
      },
      {
        source: 18,
        target: 19,
        type: "Zahlen < 10",
      },
      {
        source: 3,
        target: 17,
        type: "For Loop (Python)",
      },
      {
        source: 12,
        target: 15,
        type: "Conditions",
      },
      {
        source: 11,
        target: 15,
        type: "Hello World (Python)",
      },
      {
        source: 15,
        target: 14,
        type: "Control Structures",
      },
      {
        source: 11,
        target: 12,
        type: "Hello World (Python)",
      },
      {
        source: 10,
        target: 11,
        type: "Basic IDE Skills",
      },
      {
        source: 9,
        target: 10,
        type: "Text Editor",
      },
      {
        source: 4,
        target: 10,
        type: "Install Anaconda",
      },
      {
        source: 11,
        target: 3,
        type: "Hello World (Python)",
      },
      {
        source: 2,
        target: 3,
        type: "For Loop (Theory)",
      },
      {
        source: 15,
        target: 2,
        type: "Control Structures",
      },
      {
        source: 2,
        target: 1,
        type: "For Loop (Theory)",
      },
    ],
  };

  static create(): void {
    this.demo.nodes = [];
    this.demo.links = [];
    this.demo.nodes = this.demoData.nodes as MyNode[];
    this.demo.links = this.demoData.links as MyLink[];
  }
}

export class SkillGraphDataDemo {
  static levels: Array<Array<BaseNode>> = [];

  static levelsDemo = [
    [
      {
        id: 18,
        name: "Zahlen bis 10",
        parents: [],
      },
    ],
    [
      {
        id: 20,
        name: "Addition ohne Übertrag",
        parents: [18],
      },
    ],
    [
      {
        id: 21,
        name: "Subtraktion ohne Übertrag",
        parents: [20, 18],
      },
    ],
    [
      {
        id: 22,
        name: "Addition mit Übertrag",
        parents: [21, 20],
      },
    ],
  ];

  public static create(): void {
    this.levels = SkillGraphDataDemo.levelsDemo as Array<Array<BaseNode>>;
  }

  //   [
  //     {
  //       id: 19,
  //       name: "Zahlen bis 100",
  //       parents: [],
  //     },
  //     {
  //       id: 20,
  //       name: "Addition ohne Übertrag",
  //       parents: [],
  //     },
  //   ],
  //   [
  //     {
  //       id: 21,
  //       name: "Subtraktion ohne Übertrag",
  //       parents: [20],
  //     },
  //   ],
  //   [
  //     {
  //       id: 22,
  //       name: "Addition mit Übertrag",
  //       parents: [21, 20, 19],
  //     },
  //   ],
  // ];
}

export class GraphStoredConfiguration {
  public static titles: BaseGraphConfiguration[] = [];
  public static configs: GraphConfiguration[] = [];

  public static create(): void {
    for (let index = 0; index < 10; index++) {
      const config = new BaseGraphConfiguration();
      config.id = index;
      config.title = `TitleToLoad${index}`;
      this.titles.push(config);

      const resultConfig = new GraphConfiguration();
      resultConfig.title = config.title;
      if (index < 3) {
        const skill = SkillTestData.getbyId(index)?.id;
        if (skill) {
          resultConfig.required_skills.push(skill);
        }
      }
      if (index >= 3 && index < 7) {
        const skill = SkillTestData.getbyId(index)?.id;
        if (skill) {
          resultConfig.known_skills.push(skill);
        }
      }
      this.configs.push(resultConfig);
    }
  }

  public static demo(
    loadConfig: BaseGraphConfiguration
  ): GraphConfiguration | null {
    for (const title of this.configs) {
      if (loadConfig.title === title.title) {
        return title;
      }
    }
    return null;
  }
}
