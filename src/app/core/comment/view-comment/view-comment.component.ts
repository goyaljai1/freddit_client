import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ObjectId } from 'mongodb';
import { CommentService } from '../../../shared/services/comment.service';
import { Comment } from '../../../models/comment';
import { PostService } from '../../../shared/services/post.service';
import { HelperService } from '../../../shared/services/utils/helper.service';
import { UserService } from '../../../shared/services/user.service';
import { AuthService } from '../../../shared/services/utils/auth.service';
import { response } from 'express';
import { ConfirmationModalComponent } from '../../../shared/components/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-view-comment',
  templateUrl: './view-comment.component.html',
  styleUrl: './view-comment.component.scss',
})
export class ViewCommentComponent implements OnInit {
  @Input() comment: any;
  @ViewChild('confirmationModal')
  confirmationModal!: ConfirmationModalComponent;

  openReply: boolean = false;
  isExpanded: boolean = false;
  userId!: ObjectId;
  commentEditor: boolean = false;

  constructor(
    public postService: PostService,
    public helperService: HelperService,
    public userService: UserService,
    private authService: AuthService,
    private commentService: CommentService
  ) {}
  ngOnInit(): void {
    if (this.comment.is_deleted) {
    }
    this.authService.getUserId().subscribe((userId) => {
      this.userId = userId!;
    });
  }

  openReplyEditor() {
    if (this.userId) this.openReply = true;
    else {
      this.authService.openModal();
    }
  }

  closeReplyEditor() {
    this.openReply = false;
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

  openConfirmationModal(): void {
    this.confirmationModal.showModal();
  }

  onConfirmed(): void {
    this.deleteComment(this.comment._id);
  }
}
