import { Content } from "../classes/content";
import { DocFile } from "../classes/docFile";

export class ContentTestData {
  public static contents: Content[];

  public static create(): void {
    const contents: Content[] = [];
    for (let i = 0; i < 20; i++) {
      const element = new Content();
      element.id = i + 1;
      element.content_name = `Content${i}`;
      element.content_workload = i * 10;
      if (i % 2 !== 0) {
        element.url_content = [];
        element.url_content.push(`url_${i}`);
      }
      if (i % 3 !== 0) {
        element.binary_content = [];
        const docFile = new DocFile();
        docFile.id = i + 1;
        docFile.name = `docfile${i}`;
        element.binary_content.push(docFile);
      }
      contents.push(element);
    }

    this.contents = contents;
  }

  public static getbyId(id: number): Content | null {
    for (const content of this.contents) {
      if (content.id === id) {
        return content;
      }
    }
    return null;
  }
}
