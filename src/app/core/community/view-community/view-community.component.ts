import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { HelperService } from '../../../shared/services/utils/helper.service';
import { Community } from '../../../models/community';
import { User } from '../../../models/user';
import { ObjectId } from 'mongodb';
import { AuthService } from '../../../shared/services/utils/auth.service';
import { UserService } from '../../../shared/services/user.service';
import { CommunityService } from '../../../shared/services/community.service';
declare var bootstrap: any;
@Component({
  selector: 'app-view-community',
  templateUrl: './view-community.component.html',
  styleUrl: './view-community.component.scss',
})
export class ViewCommunityComponent implements OnInit {
  community!: Community;
  moderator!: User;
  loggedInUserId!: ObjectId;
  isModerator: boolean = false;
  isMember: boolean = false;
  sortMethod: string = 'New';
  @Output() sortPost: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private helperService: HelperService,
    private authService: AuthService,
    private router: Router,
    public userService: UserService,
    private communityService: CommunityService
  ) {}
  ngOnInit(): void {
    this.authService.getUserId().subscribe((loggedInUserId) => {
      this.loggedInUserId = loggedInUserId!;
    });
    this.activatedRoute.params.subscribe((params: Params) => {
      const communityId = params['id'];
      if (communityId) {
        this.helperService
          .getDocumentById<Community>('Community', communityId)
          .subscribe(
            (data: Community) => {
              this.community = data;
              this.updateRecentCommunities();
              this.checkIfMember();
              if (
                this.loggedInUserId &&
                this.community.moderator_id === this.loggedInUserId
              ) {
                this.isModerator = true;
              } else {
                this.isModerator = false;
              }

              this.helperService
                .getDocumentById<User>('User', this.community.moderator_id)
                .subscribe(
                  (data: User) => {
                    this.moderator = data;
                  },
                  (error) => {
                    console.error('Error fetching community:', error);
                  }
                );
            },
            (error) => {
              console.error('Error fetching community:', error);
            }
          );
      }
    });
  }
  updateRecentCommunities(): void {
    let recentCommunitiesString = sessionStorage.getItem('recent_communities');
    let recentCommunities: { id: string; name: string; iconImgSrc: string }[] =
      recentCommunitiesString ? JSON.parse(recentCommunitiesString) : [];

    recentCommunities = recentCommunities.filter(
      (community) => community.id !== this.community._id!.toString()
    );

    const newCommunity = {
      id: this.community._id!.toString(),
      name: this.community.community_name,
      iconImgSrc: this.community.icon_img_src,
    };

    recentCommunities.unshift(newCommunity);

    if (recentCommunities.length > 5) {
      recentCommunities.pop();
    }

    sessionStorage.setItem(
      'recent_communities',
      JSON.stringify(recentCommunities)
    );
  }

  checkIfMember() {
    if (this.loggedInUserId)
      this.helperService
        .getFieldFromCollection<User, 'joined_communities', ObjectId>(
          'users',
          'joined_communities',
          '_id',
          this.loggedInUserId
        )
        .subscribe({
          next: (ids) => {
            // console.log(ids);
            if (ids.flat().includes(this.community._id!)) {
              this.isMember = true;
            } else {
              this.isMember = false;
            }
          },
          error: (err) => {
            console.error('Error fetching data:', err);
          },
        });
    else {
      this.isMember = false;
    }
  }

  joinCommunity() {
    if (this.loggedInUserId) {
      if (this.isMember) {
        this.userService.updateUser(
          this.loggedInUserId,
          'joined_communities',
          this.community._id!,
          true,
          'pop'
        );
        this.communityService.updateCommunity(
          this.community._id!,
          'members_ids',
          this.loggedInUserId,
          true,
          'pop'
        );
        this.isMember = false;
      } else {
        this.userService.updateUser(
          this.loggedInUserId,
          'joined_communities',
          this.community._id!,
          true,
          'push'
        );
        this.communityService.updateCommunity(
          this.community._id!,
          'members_ids',
          this.loggedInUserId,
          true,
          'push'
        );
        this.isMember = true;
      }
    } else {
      this.authService.openModal();
    }
  }

  goToCreatePost() {
    if (this.loggedInUserId) this.router.navigate(['/createPost']);
    else this.authService.openModal();
  }

  sendEvent(data: string) {
    this.sortMethod = data;
    this.sortPost.emit(data);
  }
}
