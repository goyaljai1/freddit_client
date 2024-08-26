import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { editUserProfileGuard } from './edit-user-profile.guard';

describe('editUserProfileGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => editUserProfileGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
