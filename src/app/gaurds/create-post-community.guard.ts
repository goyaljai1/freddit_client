import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../shared/services/utils/auth.service';
import { firstValueFrom } from 'rxjs';

export const createPostCommunityGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const status = await firstValueFrom(authService.getLoginStatus());
  if (status) {
    return true;
  } else {
    router.navigate(['']);
    return false;
  }
};
