import { Component, Input, OnInit } from '@angular/core';
import { ObjectId } from 'mongodb';
import { VoteService } from '../../services/utils/vote.service';
import { AuthService } from '../../services/utils/auth.service';
import { PostService } from '../../services/post.service';
import { CommentService } from '../../services/comment.service';
import { ToastMessageService } from '../../services/utils/toast-message.service';

@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrl: './vote.component.scss',
})
export class VoteComponent implements OnInit {
  @Input() entity!: any;

  userId!: ObjectId;

  constructor(
    private voteService: VoteService,
    private authService: AuthService,
    private postService: PostService,
    private commentService: CommentService,
    private toastMessageService: ToastMessageService
  ) {}

  ngOnInit(): void {
    this.authService.getUserId().subscribe((id) => {
      this.userId = id!;
      this.getVoteStatus();
    });
    if (this.userId === null) {
      this.entity.voteStatus = 0;
    }
  }

  getVoteStatus(): void {
    if (this.userId) {
      this.voteService
        .getVoteStatus(this.entity.entity_id, this.userId)
        .subscribe(
          (response) => {
            this.entity.voteStatus = response.status;
            this.entity.voteId = response.voteId;
          },
          (error) => {
            console.error(
              `Error fetching vote status for ID: ${this.entity._id}`,
              error
            );
          }
        );
    }
  }

  updateVoteCount(delta: number): void {
    this.entity.vote_count += delta;
    if (this.entity.entity_type === 'post') {
      this.postService.updatePost(
        this.entity.entity_id,
        'vote_count',
        delta,
        false,
        null,
        true
      );
    } else {
      this.commentService.updateComment(
        this.entity.entity_id,
        'vote_count',
        delta,
        false,
        null,
        true
      );
    }
  }

  resetStatus(): void {
    if (this.userId) {
      this.voteService.updateVoteStatus(this.entity.voteId, 0);
      const delta = this.entity.voteStatus === 1 ? -1 : 1;
      this.updateVoteCount(delta);
      this.entity.voteStatus = 0;
    } else {
      this.authService.openModal();
    }
  }

  upvoteEntity(): void {
    if (this.userId) {
      if (this.entity.voteId) {
        this.voteService.updateVoteStatus(this.entity.voteId, 1);
        const delta =
          this.entity.voteStatus === 0
            ? 1
            : this.entity.voteStatus === -1
            ? 2
            : 0;
        this.updateVoteCount(delta);
        this.entity.voteStatus = 1;
        this.getVoteStatus();
      } else {
        this.voteService
          .addVote(this.entity.entity_id, this.userId, 1)
          .subscribe({
            next: () => {
              const delta =
                this.entity.voteStatus === 0
                  ? 1
                  : this.entity.voteStatus === -1
                  ? 2
                  : 0;
              this.updateVoteCount(delta);
              this.entity.voteStatus = 1;
              this.getVoteStatus();
            },
            error: (err) => {
              this.toastMessageService.showError(
                'Cannot vote on a post which is not yet approved'
              );
            },
          });
      }
    } else {
      this.authService.openModal();
    }
  }

  downvoteEntity(): void {
    if (this.userId) {
      if (this.entity.voteId) {
        this.voteService.updateVoteStatus(this.entity.voteId, -1);
        const delta =
          this.entity.voteStatus === 0
            ? -1
            : this.entity.voteStatus === 1
            ? -2
            : 0;
        this.updateVoteCount(delta);
        this.entity.voteStatus = -1;
      } else {
        this.voteService
          .addVote(this.entity.entity_id, this.userId, -1)
          .subscribe({
            next: () => {
              const delta =
                this.entity.voteStatus === 0
                  ? -1
                  : this.entity.voteStatus === 1
                  ? -2
                  : 0;
              this.updateVoteCount(delta);
              this.entity.voteStatus = -1;
              this.getVoteStatus();
            },
            error: (err) => {
              this.toastMessageService.showError(
                'Cannot vote on a post which is not yet approved'
              );
              console.error('Error adding vote:', err);
            },
          });
      }
    } else {
      this.authService.openModal();
    }
  }
}
