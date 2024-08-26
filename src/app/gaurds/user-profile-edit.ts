import { Injectable, OnInit } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../shared/services/utils/auth.service';
@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate, OnInit {
  private loggedInUserId: string | null = null;

  constructor(private authService: AuthService, private router: Router) {
    this.authService.getUserId().subscribe((userId) => {
      // console.log(userId);
      this.loggedInUserId = userId!.toString();
    });
  }

  ngOnInit(): void {}

  canActivate(next: ActivatedRouteSnapshot): boolean {
    const userIdFromRoute = next.paramMap.get('id');
    if (this.loggedInUserId === null) {
      console.warn('User ID is not yet available');
      this.router.navigate(['/home']);
      return false;
    }

    if (userIdFromRoute === this.loggedInUserId) {
      return true;
    }

    this.router.navigate(['/home']);
    return false;
  }
}
