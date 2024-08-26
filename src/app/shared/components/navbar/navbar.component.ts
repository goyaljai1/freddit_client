import { Component } from '@angular/core';
import { AuthService } from '../../services/utils/auth.service';
import { LocalStorageService } from '../../services/utils/local-storage.service';
import { ObjectId } from 'mongodb';
import { Router } from '@angular/router';
import { HelperService } from '../../services/utils/helper.service';
import { User } from '../../../models/user';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  isLoggedIn!: boolean;
  userId!: ObjectId;
  profilePictureSrc!: string;
  constructor(
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private helperService: HelperService
  ) {
    this.authService.getLoginStatus().subscribe((status) => {
      this.isLoggedIn = status;
    });
  }

  ngOnInit(): void {
    this.authService.getUserId().subscribe((userId) => {
      this.userId = userId!;
      if (this.userId) {
        this.helperService
          .getFieldFromCollection<User, 'profile_picture_src', string>(
            'users',
            'profile_picture_src',
            '_id',
            this.userId
          )
          .subscribe((img_src) => {
            this.profilePictureSrc = img_src[0];
          });
      }
    });
  }

  logOut() {
    this.localStorageService.clear();
    this.authService.setLoginStatus(false);
    this.router.navigate(['']);
  }

  displayUser(userId: ObjectId) {
    this.router.navigate([`user/${userId}`]);
  }
}
