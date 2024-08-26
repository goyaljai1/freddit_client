import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { User } from '../../models/user';
import { ActivatedRoute, Params } from '@angular/router';
import { HelperService } from '../../shared/services/utils/helper.service';
import { AuthService } from '../../shared/services/utils/auth.service';
import { ObjectId } from 'mongodb';
import { CommentService } from '../../shared/services/comment.service';
import { Comment } from '../../models/comment';
import { response } from 'express';
import { Community } from '../../models/community';
import { CommunityService } from '../../shared/services/community.service';
import { Post } from '../../models/post';
import { VoteService } from '../../shared/services/utils/vote.service';

@Component({
  selector: 'app-self-user-profile',
  templateUrl: './self-user-profile.component.html',
  styleUrl: './self-user-profile.component.scss',
})
export class SelfUserProfileComponent implements OnInit {
  userProfile!: User;
  isSelfProfile: boolean = false;
  loggedInUserId!: ObjectId;
  comments!: Comment[];
  sortMethod: string = 'New';
  userCommunities: Community[] = [];
  postKarma!: number;
  commentKarma!: number;

  @Output() sortPost: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private helperService: HelperService,
    private authService: AuthService,
    private commentService: CommentService,
    public communityService: CommunityService,
    private voteService: VoteService
  ) {}

  ngOnInit(): void {
    this.authService.getUserId().subscribe((loggedInUserId) => {
      this.loggedInUserId = loggedInUserId!;
    });

    this.getUserData();

    this.voteService.postKarma$.subscribe((count) => {
      this.postKarma = count;
    });
  }

  getUserData() {
    this.activatedRoute.params.subscribe((params: Params) => {
      const userId = params['id'];
      if (userId) {
        this.helperService
          .getDocumentById<User>('User', userId)
          .subscribe((data: User) => {
            this.userProfile = data;
            this.userCommunities = [];
            for (const communityId of this.userProfile.community_ids) {
              this.helperService
                .getDocumentById<Community>('Community', communityId)
                .subscribe((data: Community) => {
                  this.userCommunities.push(data);
                });
            }

            this.commentService
              .getCommentsByIds(this.userProfile._id!)
              .subscribe((data: Comment[]) => {
                this.comments = data;
                this.commentKarma = this.comments.reduce(
                  (sum, comment) => sum + comment.vote_count,
                  0
                );
              });
            if (this.loggedInUserId === this.userProfile._id) {
              this.isSelfProfile = true;
            } else {
              this.isSelfProfile = false;
            }
          });
      }
    });
  }

  sendEvent(data: string) {
    this.sortMethod = data;
    this.sortPost.emit(data);
  }
}
