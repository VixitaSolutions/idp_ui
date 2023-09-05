import { TestBed } from '@angular/core/testing';

import { RoutingNavService } from './routing-nav.service';

describe('RoutingNavService', () => {
  let service: RoutingNavService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoutingNavService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
