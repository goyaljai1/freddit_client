import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../shared/services/utils/auth.service';
import { HelperService } from '../shared/services/utils/helper.service';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
export const communityGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot
): Observable<boolean> => {
  const authService = inject(AuthService);
  const helperService = inject(HelperService);
  const router = inject(Router);

  const communityId = route.paramMap.get('id');

  return authService.getUserId().pipe(
    switchMap((userId) => {
      if (!userId) {
        router.navigate([`/community/${communityId}`]);
        return of(false);
      }
      return helperService.getDocumentById('User', userId).pipe(
        map((user: any) => {
          const isAuthorized = user?.community_ids.includes(communityId);
          if (!isAuthorized) {
            router.navigate([`/community/${communityId}`]);
          }
          return isAuthorized;
        }),
        catchError(() => {
          router.navigate([`/community/${communityId}`]);
          return of(false);
        })
      );
    }),
    catchError(() => {
      router.navigate([`/community/${communityId}`]);
      return of(false);
    })
  );
};
