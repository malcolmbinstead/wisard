import { TestBed } from '@angular/core/testing';

import { WisardService } from './wisard.service';

describe('WisardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WisardService = TestBed.get(WisardService);
    expect(service).toBeTruthy();
  });
});
