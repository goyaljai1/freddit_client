import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CommentService } from '../../../shared/services/comment.service';
import { Comment } from '../../../models/comment';
import { ObjectId } from 'mongodb';
import { AuthService } from '../../../shared/services/utils/auth.service';
import { PostService } from '../../../shared/services/post.service';
import { ToastMessageService } from '../../../shared/services/utils/toast-message.service';

@Component({
  selector: 'app-create-comment',
  templateUrl: './create-comment.component.html',
  styleUrl: './create-comment.component.scss',
})
export class CreateCommentComponent implements AfterViewInit, OnInit {
  @ViewChild('commentBoxer') commentBoxer!: ElementRef<HTMLTextAreaElement>;
  @Input() postId!: ObjectId;
  @Input() postStatus!: string;
  @Output() commentCreated = new EventEmitter<void>();

  constructor(
    public commentService: CommentService,
    private authService: AuthService,
    private postService: PostService,
    private toastMessageService: ToastMessageService
  ) {}
  userId!: ObjectId;
  isExpanded = false;
  commentText = '';
  charCount: number = 0;

  ngOnInit(): void {
    this.authService.getUserId().subscribe((userId) => {
      this.userId = userId!;
    });
  }
  ngAfterViewInit() {
    this.adjustHeight();
  }

  updateCharCount() {
    this.charCount = this.commentText.length;
  }
  expandCommentBox() {
    if (this.userId) {
      if (this.postStatus != 'approved') {
        this.toastMessageService.showError(
          'Cannot comment on post which is not yet approved'
        );
      } else {
        this.isExpanded = true;
        this.adjustHeight();
      }
    } else {
      this.authService.openModal();
    }
  }
  cancelComment() {
    this.isExpanded = false;
    this.commentText = '';
  }
  adjustHeight() {
    if (this.commentBoxer) {
      const textarea = this.commentBoxer.nativeElement;
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }
  createComment() {
    const tempComment: Comment = {
      post_id: this.postId,
      comment_text_body: this.commentText,
      user_id: this.userId,
      vote_count: 0,
      child_comment_id: [],
      level: 0,
    };
    const commentContent = this.commentText.trim();
    const isNotEmpty = /\S/.test(commentContent);
    if (isNotEmpty) {
      console.log(commentContent);
      this.commentService.addComment(tempComment).subscribe((response) => {
        this.postService.updatePost(
          this.postId,
          'parent_comment_ids',
          response._id,
          true,
          'push'
        );
        this.postService.updatePost(
          this.postId,
          'comment_count',
          1,
          false,
          null,
          true
        );
        this.commentCreated.emit();
      });
      this.commentService.loadComments(this.postId);
      this.isExpanded = false;
      this.commentText = '';
      this.charCount = 0;
    }
  }
}
