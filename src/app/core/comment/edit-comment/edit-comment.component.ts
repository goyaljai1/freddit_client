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

@Component({
  selector: 'app-edit-comment',
  templateUrl: './edit-comment.component.html',
  styleUrl: '../create-comment/create-comment.component.scss',
})
export class EditCommentComponent implements AfterViewInit, OnInit {
  @ViewChild('commentBoxer') commentBoxer!: ElementRef<HTMLTextAreaElement>;
  @Input() comment!: any;
  @Output() closeEditor = new EventEmitter<void>();

  isExpanded = true;
  commentText = '';
  charCount: number = 0;

  constructor(private commentService: CommentService) {}

  ngOnInit(): void {
    if (this.comment && this.comment.comment_text_body) {
      this.commentText = this.comment.comment_text_body;
    }
  }
  updateCharCount() {
    this.charCount = this.commentText.length;
  }
  ngAfterViewInit(): void {
    if (this.commentBoxer) {
      this.commentBoxer.nativeElement.focus();
      this.adjustHeight();
    }
  }

  expandCommentBox(): void {
    this.isExpanded = true;
    this.adjustHeight();
  }

  cancelComment(): void {
    this.isExpanded = false;
    this.commentText = this.comment.comment_text_body;
    this.closeEditor.emit();
  }

  adjustHeight(): void {
    if (this.commentBoxer) {
      const textarea = this.commentBoxer.nativeElement;
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }

  createComment(): void {
    const commentContent = this.commentText.trim();
    if (commentContent) {
      this.commentService.updateComment(
        this.comment._id,
        'comment_text_body',
        this.commentText
      );
      this.isExpanded = false;
      this.closeEditor.emit();
    }
  }
}
