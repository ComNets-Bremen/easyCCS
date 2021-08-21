import { Injectable } from "@angular/core";
import { Skill } from "./classes/skill";

@Injectable({
  providedIn: "root",
})
export class SkillService {
  constructor() {}

  public filterSkills(value: string, allSkills: Skill[]): Skill[] {
    if (!value) {
      return allSkills;
    }
    const filterValue = value.toLowerCase();
    // we use for loop instead of "Array.filter()" option to keep code more readable
    const skills: Skill[] = [];
    for (const skill of allSkills) {
      if (skill.skill_name.toLowerCase().includes(filterValue)) {
        skills.push(skill);
        continue;
      }
      for (const wikiobj of skill.skill_keywords) {
        if (wikiobj.wikidata_name.toLocaleLowerCase().includes(filterValue)) {
          skills.push(skill);
          continue;
        }
        for (const keyword of wikiobj.wikidata_related_fields) {
          if (keyword.toLocaleLowerCase().includes(filterValue)) {
            skills.push(skill);
            continue;
          }
        }
      }
    }
    return skills;
  }
}
