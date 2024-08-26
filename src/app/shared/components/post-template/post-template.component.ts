import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { PostService } from '../../services/post.service';
import { UserService } from '../../services/user.service';
import { HelperService } from '../../services/utils/helper.service';

@Component({
  selector: 'app-post-template',
  templateUrl: './post-template.component.html',
  styleUrl:
    '../../../core/post/view-post/view-communiy-post/view-communiy-post.component.scss',
})
export class PostTemplateComponent implements OnInit {
  @Input() post: any;
  @Input() isModerator: boolean = false;
  @Output() postDeleted = new EventEmitter<void>();

  isFullscreen = false;
  fullScreenImgSrc!: string;

  constructor(
    private router: Router,
    public postService: PostService,
    public userService: UserService,
    public helperService: HelperService
  ) {}
  ngOnInit(): void {}

  openPost(event: MouseEvent, post: any): void {
    if (event.currentTarget === event.target) {
      this.router.navigate([`/post/${post._id}`], { state: { post } });
    }
  }

  openFullscreen(imgSrc: string): void {
    this.fullScreenImgSrc = imgSrc;
    this.isFullscreen = true;
  }

  closeFullscreen(): void {
    this.isFullscreen = false;
  }
}
