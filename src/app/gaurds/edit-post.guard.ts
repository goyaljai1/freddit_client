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

export const editPostGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot
): Observable<boolean> => {
  const authService = inject(AuthService);
  const helperService = inject(HelperService);
  const router = inject(Router);

  const postId = route.paramMap.get('id');

  return authService.getUserId().pipe(
    switchMap((userId) => {
      if (!userId) {
        router.navigate([`/post/${postId}`]);
        return of(false);
      }
      return helperService.getDocumentById('User', userId).pipe(
        map((user: any) => {
          const isAuthorized = user?.created_post_ids.includes(postId);
          if (!isAuthorized) {
            router.navigate([`/post/${postId}`]);
          }
          return isAuthorized;
        }),
        catchError(() => {
          router.navigate([`/post/${postId}`]);
          return of(false);
        })
      );
    }),
    catchError(() => {
      router.navigate([`/post/${postId}`]);
      return of(false);
    })
  );
};
