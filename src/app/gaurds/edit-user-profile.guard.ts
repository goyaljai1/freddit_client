import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../shared/services/utils/auth.service';
import { firstValueFrom, of, switchMap } from 'rxjs';

export const editUserProfileGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const userIdFromRoute = route.paramMap.get('id');

  try {
    const loggedInUserId = await firstValueFrom(authService.getUserId());

    if (loggedInUserId) {
      // console.log(userIdFromRoute, loggedInUserId);
      if (userIdFromRoute === loggedInUserId.toString()) {
        return true;
      } else {
        router.navigate([`/user/${userIdFromRoute}`]);
        return false;
      }
    } else {
      // Handle case where loggedInUserId is null
      router.navigate([`/user/${userIdFromRoute}`]);
      return false;
    }
  } catch (error) {
    console.error('Error fetching logged-in user ID:', error);
    router.navigate([`/user/${userIdFromRoute}`]);
    return false;
  }
};
