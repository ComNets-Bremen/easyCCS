import { Injectable } from "@angular/core";
import { Content } from "../classes/content";

@Injectable({
  providedIn: "root",
})
export class ContentService {
  public fromRoute = "";

  constructor() {}

  public filterContent(value: string, allContents: Content[]): Content[] {
    if (!value) {
      return allContents;
    }
    const filterValue = value.toLowerCase();
    // we use for loop instead of "Array.filter()" option to keep code more readable
    const contents: Content[] = [];
    for (const content of allContents) {
      if (content.content_name.toLowerCase().includes(filterValue)) {
        contents.push(content);
        continue;
      }
      for (const wikiobj of content.content_keywords) {
        if (wikiobj.wikidata_name.toLocaleLowerCase().includes(filterValue)) {
          contents.push(content);
          continue;
        }
        for (const keyword of wikiobj.wikidata_related_fields) {
          if (keyword.toLocaleLowerCase().includes(filterValue)) {
            contents.push(content);
            continue;
          }
        }
      }
    }
    return contents;
  }
}
