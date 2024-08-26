import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ObjectId } from 'mongodb';
import { PostService } from '../../../shared/services/post.service';
import { HelperService } from '../../../shared/services/utils/helper.service';
import { UserService } from '../../../shared/services/user.service';
import { AuthService } from '../../../shared/services/utils/auth.service';
import { CommentService } from '../../../shared/services/comment.service';
import { Community } from '../../../models/community';
import { User } from '../../../models/user';
import { CommunityService } from '../../../shared/services/community.service';
import { ConfirmationModalComponent } from '../../../shared/components/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-view-user-comment',
  templateUrl: './view-user-comment.component.html',
  styleUrl: '../view-comment/view-comment.component.scss',
})
export class ViewUserCommentComponent implements OnInit {
  @Input() comment: any;
  @ViewChild('confirmationModal')
  confirmationModal!: ConfirmationModalComponent;

  userId!: ObjectId;
  commentEditor: boolean = false;
  community!: Community;
  pastUser!: User;

  constructor(
    public postService: PostService,
    public helperService: HelperService,
    public userService: UserService,
    private authService: AuthService,
    private commentService: CommentService,
    public communityService: CommunityService
  ) {}
  ngOnInit(): void {
    this.authService.getUserId().subscribe((userId) => {
      this.userId = userId!;
    });
    this.helperService
      .getDocumentById<Community>(
        'Community',
        this.comment.post_id.community_id
      )
      .subscribe((community: Community) => {
        this.community = community;
      });
    if (this.comment.parent_comment_id) {
      this.helperService
        .getDocumentById<User>('User', this.comment.parent_comment_id.user_id)
        .subscribe((user: User) => {
          this.pastUser = user;
        });
    }
  }

  deleteComment(commentId: ObjectId) {
    const deltedComment = this.commentService.updateComment(
      commentId,
      'is_deleted',
      true
    );
    this.comment.is_deleted = 'true';
  }
  editComment() {
    this.commentEditor = true;
  }
  handleCloseEditor() {
    this.commentEditor = false;
    this.helperService
      .getDocumentById('Comment', this.comment._id)
      .subscribe((response: any) => {
        this.comment.comment_text_body = response.comment_text_body;
      });
  }

  onConfirmed(): void {
    this.deleteComment(this.comment._id);
  }

  openConfirmationModal(): void {
    this.confirmationModal.showModal();
  }
}
