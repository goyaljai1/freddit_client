import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { editPostGuard } from './edit-post.guard';

describe('editPostGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => editPostGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
