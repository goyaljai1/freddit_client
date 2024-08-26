import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ObjectId } from 'mongodb';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
import { Router } from '@angular/router';
import { PostService } from '../../services/post.service';
import { UserService } from '../../services/user.service';
import { HelperService } from '../../services/utils/helper.service';
import { AuthService } from '../../services/utils/auth.service';

@Component({
  selector: 'app-post-user-info',
  templateUrl: './post-user-info.component.html',
  styleUrl:
    '../../../core/post/view-post/view-communiy-post/view-communiy-post.component.scss',
})
export class PostUserInfoComponent implements OnInit {
  @Input() post: any;
  @Input() isModerator!: boolean;
  @Output() postDeleted = new EventEmitter<void>();

  isFullscreen = false;
  fullScreenImgSrc!: string;
  userId!: ObjectId;
  isPostSaved: boolean | undefined;
  confirmationModal!: ConfirmationModalComponent;
  imgSrc!: string;

  constructor(
    private router: Router,
    public postService: PostService,
    public userService: UserService,
    public helperService: HelperService,
    private authService: AuthService
  ) {
    this.authService.getUserId().subscribe((userId) => {
      this.userId = userId!;
    });
  }
  ngOnInit(): void {
    if (this.router.url.split('/')[1] === 'community' && this.post) {
      this.imgSrc = this.post.tempUser.profile_picture_src;
    }
  }
}
