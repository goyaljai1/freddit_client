import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { createPostCommunityGuard } from './create-post-community.guard';

describe('createPostCommunityGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => createPostCommunityGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
