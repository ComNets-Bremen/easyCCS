import { Injectable } from "@angular/core";
import { WikidataObject } from "../classes/wikiDataObj";

@Injectable({
  providedIn: "root",
})
export class WikiDataObjService {
  constructor() {}

  public filterWikiDataObjs(
    value: string,
    allWikiObj: WikidataObject[]
  ): WikidataObject[] {
    if (!value) {
      return allWikiObj;
    }
    const filterValue = value.toLowerCase();
    // we use for loop instead of "Array.filter()" option to keep code more readable
    const resWikis: WikidataObject[] = [];
    for (const wikiObj of allWikiObj) {
      if (wikiObj.wikidata_name.toLowerCase().includes(filterValue)) {
        resWikis.push(wikiObj);
        continue;
      }
      for (const relField of wikiObj.wikidata_related_fields) {
        if (relField.toLocaleLowerCase().includes(filterValue)) {
          resWikis.push(wikiObj);
          continue;
        }
        for (const rawField of wikiObj.wikidata_related_fields_raw) {
          if (rawField.toLocaleLowerCase().includes(filterValue)) {
            resWikis.push(wikiObj);
            continue;
          }
        }
      }
    }
    return resWikis;
  }
}
