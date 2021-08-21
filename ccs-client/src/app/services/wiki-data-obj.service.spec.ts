import { TestBed } from '@angular/core/testing';

import { WikiDataObjService } from './wiki-data-obj.service';

describe('WikiDataObjService', () => {
  let service: WikiDataObjService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WikiDataObjService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
