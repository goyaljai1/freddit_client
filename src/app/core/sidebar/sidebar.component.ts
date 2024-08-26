import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/utils/auth.service';
import { HelperService } from '../../shared/services/utils/helper.service';
import { concatMap, from, of, switchMap, tap, toArray } from 'rxjs';
import { User } from '../../models/user';
import { Community } from '../../models/community';
import { Router } from '@angular/router';
import { ObjectId } from 'mongodb';
declare var bootstrap: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  userId: ObjectId | null = null;
  community_ids: ObjectId[] = [];
  communities: Community[] = [];
  recentCommunities: { id: string; name: string; iconImgSrc: string }[] = [];
  joined_communities_ids: ObjectId[] = [];
  joined_communities: Community[] = [];
  constructor(
    private authService: AuthService,
    private helperService: HelperService,
    public router: Router
  ) {}

  ngOnInit() {
    this.authService
      .getUserId()
      .pipe(
        tap((userId) => {
          this.userId = userId;
        }),
        switchMap((userId) => {
          if (userId) {
            return this.helperService.getFieldFromCollection<
              User,
              'community_ids',
              ObjectId
            >('users', 'community_ids', '_id', userId);
          } else {
            return of([]);
          }
        }),
        switchMap((community_ids) => {
          this.community_ids = community_ids.flat();
          if (this.community_ids.length > 0) {
            return from(this.community_ids).pipe(
              concatMap((id: ObjectId) =>
                this.helperService.getDocumentById<Community>('Community', id)
              ),
              toArray()
            );
          } else {
            return of([]);
          }
        })
      )
      .subscribe((communities) => {
        this.communities = communities.flat();
      });

    this.authService
      .getUserId()
      .pipe(
        tap((userId) => {
          this.userId = userId;
        }),
        switchMap((userId) => {
          if (userId) {
            return this.helperService.getFieldFromCollection<
              User,
              'joined_communities',
              ObjectId
            >('users', 'joined_communities', '_id', userId);
          } else {
            return of([]);
          }
        }),
        switchMap((joined_communities_ids) => {
          this.joined_communities_ids = joined_communities_ids.flat();
          if (this.joined_communities_ids.length > 0) {
            return from(this.joined_communities_ids).pipe(
              concatMap((id: ObjectId) =>
                this.helperService.getDocumentById<Community>('Community', id)
              ),
              toArray()
            );
          } else {
            return of([]);
          }
        })
      )
      .subscribe((joined_communities) => {
        this.joined_communities = joined_communities.flat();
      });
    this.loadRecentCommunities();
  }

  loadRecentCommunities(): void {
    const recentCommunitiesString =
      sessionStorage.getItem('recent_communities');
    if (recentCommunitiesString) {
      this.recentCommunities = JSON.parse(recentCommunitiesString);
    }
  }

  displayCommunity(communityId: string) {
    this.router.navigate([`community/${communityId}`]);
  }

  createCommunity() {
    if (this.userId) {
      // console.log(this.userId);
      this.router.navigate(['/createCommunity']);
    } else {
      const modal = new bootstrap.Modal(
        document.getElementById('exampleModal')
      );
      modal.show();
    }
  }
}
