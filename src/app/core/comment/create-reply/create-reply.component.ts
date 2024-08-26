import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ObjectId } from 'mongodb';
import { CommentService } from '../../../shared/services/comment.service';
import { PostService } from '../../../shared/services/post.service';
import { Comment } from '../../../models/comment';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../shared/services/utils/auth.service';
import { VoteService } from '../../../shared/services/utils/vote.service';

@Component({
  selector: 'app-create-reply',
  templateUrl: './create-reply.component.html',
  styleUrl: '../create-comment/create-comment.component.scss',
})
export class CreateReplyComponent implements OnInit {
  @ViewChild('commentBoxer') commentBoxer!: ElementRef<HTMLTextAreaElement>;
  @Input() comment!: any;
  @Output() cancel = new EventEmitter<void>();

  isExpanded: boolean = true;
  currentUrl!: string;
  userId!: ObjectId;
  commentText = '';
  charCount: number = 0;

  constructor(
    private commentService: CommentService,
    private postService: PostService,
    private router: Router,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    this.currentUrl = this.router.url;
    this.authService.getUserId().subscribe((userId) => {
      this.userId = userId!;
    });
  }
  ngAfterViewInit() {
    this.adjustHeight(); // Adjust height on initialization
  }

  updateCharCount() {
    this.charCount = this.commentText.length;
  }
  expandCommentBox() {
    if (this.userId) {
      this.isExpanded = true;
      this.adjustHeight();
    } else {
      this.authService.openModal();
    }
  }
  cancelComment() {
    this.isExpanded = false;
    this.cancel.emit();
    this.commentText = '';
  }
  adjustHeight() {
    if (this.commentBoxer) {
      const textarea = this.commentBoxer.nativeElement;
      textarea.style.height = '80px';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }
  createComment() {
    const tempComment: Comment = {
      post_id: this.comment.post_id,
      comment_text_body: this.commentText,
      parent_comment_id: this.comment._id,
      user_id: this.userId,
      vote_count: 0,
      child_comment_id: [],
      level: this.comment.level + 1,
    };
    const commentContent = this.commentText.trim();
    const isNotEmpty = /\S/.test(commentContent);
    if (isNotEmpty) {
      this.commentService.addComment(tempComment).subscribe((response) => {
        this.commentService.updateComment(
          this.comment._id,
          'child_comment_id',
          response._id,
          true,
          'push'
        );
        this.postService.updatePost(
          this.comment.post_id,
          'comment_count',
          1,
          false,
          null,
          true
        );

        this.commentService.loadComments(this.comment.post_id);
      });
      this.isExpanded = false;
      this.cancel.emit();
      this.commentText = '';
      this.charCount = 0;
    }
  }
}
