import { Component, ElementRef, OnInit } from '@angular/core';
import { ObjectId } from 'mongodb';
import { Post } from '../../../models/post';
import { Community } from '../../../models/community';
import { User } from '../../../models/user';
import { Location } from '@angular/common';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';
import { PostService } from '../../../shared/services/post.service';
import { CommentService } from '../../../shared/services/comment.service';
import { HelperService } from '../../../shared/services/utils/helper.service';
import { Comment } from '../../../models/comment';

@Component({
  selector: 'app-view-shared-comment',
  templateUrl: './view-shared-comment.component.html',
  styleUrl:
    '../../post/view-post/view-detailed-post/view-detailed-post.component.scss',
})
export class ViewSharedCommentComponent implements OnInit {
  commentId!: ObjectId;
  comment!: any;
  post!: Post;
  community!: Community;
  creator!: User;
  isModerator = false;
  moderator = null;
  comments: any[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    public userService: UserService,
    public postService: PostService,
    private location: Location,
    private commentService: CommentService,
    public helperService: HelperService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.commentId = params['id'];
      this.helperService
        .getDocumentById<Comment>('Comment', this.commentId)
        .subscribe(
          (comment: Comment) => {
            this.comment = comment;
            this.helperService
              .getDocumentById<Post>('Post', comment.post_id)
              .subscribe((post: Post) => {
                this.post = post;
                this.helperService
                  .getDocumentById<Community>('Community', post.community_id)
                  .subscribe((community: Community) => {
                    this.community = community;
                  });
              });

            this.helperService
              .getDocumentById<User>('User', comment.user_id)
              .subscribe((creator: User) => {
                this.creator = creator;
                this.commentService.comments$.subscribe((comments) => {
                  this.comments = comments;
                });
                this.loadComments();
              });
          },
          (error) => {}
        );
    });
  }
  goBack(): void {
    this.location.back();
  }
  loadComments() {
    this.commentService.loadComments(this.comment._id!);
  }
  scrollDown(): void {
    window.scrollTo({
      top: 300,
      left: 0,
      behavior: 'smooth',
    });
  }
}
