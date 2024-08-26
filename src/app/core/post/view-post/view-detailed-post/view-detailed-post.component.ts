import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Community } from '../../../../models/community';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from '../../../../shared/services/utils/auth.service';
import { UserService } from '../../../../shared/services/user.service';
import { PostService } from '../../../../shared/services/post.service';
import { Location } from '@angular/common';
import { CommentService } from '../../../../shared/services/comment.service';
import { HelperService } from '../../../../shared/services/utils/helper.service';
import { ObjectId } from 'mongodb';
import { Post } from '../../../../models/post';
import { User } from '../../../../models/user';
import { CommunityService } from '../../../../shared/services/community.service';

@Component({
  selector: 'app-view-detailed-post',
  templateUrl: './view-detailed-post.component.html',
  styleUrl: './view-detailed-post.component.scss',
})
export class ViewDetailedPostComponent implements OnInit {
  postId!: ObjectId;
  post!: Post;
  community!: Community;
  creator!: User;
  isModerator = false;
  moderator!: User;
  comments: any[] = [];
  newComment: boolean = true;
  userId!: ObjectId;

  constructor(
    private activatedRoute: ActivatedRoute,
    public userService: UserService,
    public postService: PostService,
    private location: Location,
    private commentService: CommentService,
    public helperService: HelperService,
    public communityService: CommunityService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadPost();
  }

  loadPost() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.postId = params['id'];

      this.authService.getUserId().subscribe((userId) => {
        this.userId = userId!;
      });
      this.helperService.getDocumentById<Post>('Post', this.postId).subscribe(
        (post: Post) => {
          if (
            post.status === 'approved' ||
            post.creator_id === this.userId ||
            true
          ) {
            this.post = post;

            this.helperService
              .getDocumentById<Community>('Community', post.community_id)
              .subscribe((community: Community) => {
                this.community = community;
                this.loadModerator();
              });
            if (post.creator_id)
              this.helperService
                .getDocumentById<User>('User', post.creator_id)
                .subscribe((creator: User) => {
                  this.creator = creator;
                });
            this.commentService.comments$.subscribe((comments) => {
              this.comments = comments;
            });
            this.loadComments();
          }
        },
        (error) => {
          // console.error('Error fetching community:', error);
        }
      );
    });
  }

  loadModerator() {
    this.helperService
      .getDocumentById<User>('User', this.community.moderator_id)
      .subscribe((moderator: User) => {
        this.moderator = moderator;
      });
  }

  commentCreated() {
    this.newComment = false;
    this.loadComments();
  }
  goBack(): void {
    this.location.back();
  }
  loadComments() {
    this.commentService.loadComments(this.post._id!);
  }
  scrollDown(): void {
    window.scrollTo({
      top: 300, // Adjust this value to scroll by the desired amount (in pixels)
      left: 0,
      behavior: 'smooth', // Smooth scrolling
    });
  }
}
