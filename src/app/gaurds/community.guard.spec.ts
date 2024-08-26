import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { communityGuard } from './community.guard';

describe('communityGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => communityGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
