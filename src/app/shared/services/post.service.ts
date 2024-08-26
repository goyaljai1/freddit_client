import { Injectable } from '@angular/core';
import { Post } from '../../models/post';
import { HttpClient } from '@angular/common/http';
import { HelperService } from './utils/helper.service';
import { ConfigService } from './utils/config.service';
import { catchError, Observable } from 'rxjs';
import { ObjectId } from 'mongodb';
import { UserService } from './user.service';
import { response } from 'express';
import { CommunityService } from './community.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(
    private httpClient: HttpClient,
    private helperService: HelperService,
    private config: ConfigService,
    private userService: UserService,
    private communityService: CommunityService,
    private router: Router
  ) {}
  addPost(post: Post): Observable<Post> {
    return this.httpClient
      .post<Post>(
        `${this.config.baseUrl}/post`,
        JSON.stringify(post),
        this.config.httpHeader
      )
      .pipe(catchError(this.helperService.handleError));
  }
  updatePost<K extends keyof Post>(
    postId: ObjectId,
    field: K,
    value?: ObjectId | Post[K],
    isArray: boolean = false,
    arrayOperation: 'push' | 'pop' | null = null,
    isNumber: boolean = false
  ) {
    this.helperService
      .updateCollectionField(
        'Post',
        postId,
        field,
        value,
        isArray,
        arrayOperation,
        isNumber
      )
      .subscribe({
        next: (response) => {
          return response;
        },
        error: (error) => {
          console.error(`Error updating ${field}:`, error);
        },
      });
  }

  getPostsByCommunity(communityId: ObjectId): Observable<Post[]> {
    return this.httpClient.get<Post[]>(
      `${this.config.baseUrl}/post/community/${communityId}`
    );
  }

  getHomePagePosts(
    limit: number,
    skip: number,
    sortBasedOn: string
  ): Observable<Post[]> {
    return this.httpClient.get<Post[]>(`${this.config.baseUrl}/post/home`, {
      params: {
        limit: limit.toString(),
        skip: skip.toString(),
        sortBasedOn: sortBasedOn,
      },
    });
  }

  getPostsByUser(userId: ObjectId): Observable<Post[]> {
    return this.httpClient.get<Post[]>(
      `${this.config.baseUrl}/post/user/${userId}`
    );
  }

  displayPost(postId: ObjectId) {
    this.router.navigate([`post/${postId}`]);
  }

  saveUnsavePost(postId: ObjectId, userId: ObjectId, action: 'push' | 'pop') {
    this.userService.updateUser(userId, 'saved_post_ids', postId, true, action);
  }

  editPost(postId: ObjectId) {
    this.router.navigate([`editPost/${postId}`]);
  }

  timeAgo(postedTime: Date): string {
    const now = new Date();
    const postedDate = new Date(postedTime);
    const diffInSeconds = Math.floor(
      (now.getTime() - postedDate.getTime()) / 1000
    );

    if (diffInSeconds < 60) {
      return 'Just now';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} min. ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hr. ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} d. ago`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} mo. ago`;
    }

    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} yr. ago`;
  }

  sortPostsByTime(
    posts: any[],
    order: 'ascending' | 'descending' = 'descending'
  ): any[] {
    // console.log(posts, 'posts jere');
    return posts.sort((a, b) => {
      const timeA = new Date(a.time_of_posting).getTime();
      const timeB = new Date(b.time_of_posting).getTime();

      if (order === 'ascending') {
        return timeA - timeB;
      } else {
        return timeB - timeA;
      }
    });
  }

  sortPostsByVoteCount(
    posts: any[],
    order: 'ascending' | 'descending' = 'descending'
  ): any[] {
    return posts.sort((a, b) => {
      if (order === 'ascending') {
        return a.vote_count - b.vote_count; // Ascending order
      } else {
        return b.vote_count - a.vote_count; // Descending order
      }
    });
  }

  deletePost(post: any) {
    const response = this.updatePost(post._id, 'is_deleted', true);
    this.userService.updateUser(
      post.creator_id,
      'created_post_ids',
      post._id,
      true,
      'pop'
    );
    this.communityService.updateCommunity(
      post.community_id,
      'post_ids',
      post._id,
      true,
      'pop'
    );
    return response;
  }
  openPost(event: MouseEvent, post: any): void {
    if (event.currentTarget === event.target) {
      this.router.navigate([`/post/${post._id}`], { state: { post } });
    }
  }
}
