import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { Community } from '../../models/community';
import { HttpClient } from '@angular/common/http';
import { HelperService } from './utils/helper.service';
import { ConfigService } from './utils/config.service';
import { ObjectId } from 'mongodb';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class CommunityService {
  constructor(
    private httpClient: HttpClient,
    private helperService: HelperService,
    private config: ConfigService,
    private router: Router
  ) {}

  addCommunity(community: Community): Observable<Community> {
    return this.helperService.addDocument<Community>('Community', community);
  }

  updateCommunity<K extends keyof Community>(
    communityId: ObjectId,
    field: K,
    value: Community[K] | ObjectId,
    isArray: boolean = false,
    arrayOperation: 'push' | 'pop' | null = null
  ) {
    this.helperService
      .updateCollectionField(
        'Community',
        communityId,
        field,
        value,
        isArray,
        arrayOperation
      )
      .subscribe({
        next: (response) => {},
        error: (error) => {
          console.error(`Error updating ${field}:`, error);
        },
      });
  }

  getCommunityByPostId(postId: ObjectId): Observable<Community> {
    return this.httpClient
      .get<Community>(
        `${this.config.baseUrl}/community/post/${postId}`,
        this.config.httpHeader
      )
      .pipe(catchError(this.helperService.handleError));
  }

  getPopularCommunities() {
    return this.httpClient
      .get<Community[]>(
        `${this.config.baseUrl}/popularCommunities`,
        this.config.httpHeader
      )
      .pipe(catchError(this.helperService.handleError));
  }

  displayCommunity(communityId: ObjectId) {
    this.router.navigate([`community/${communityId}`]);
  }
}
