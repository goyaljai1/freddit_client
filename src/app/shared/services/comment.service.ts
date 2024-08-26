import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable } from 'rxjs';
import { HelperService } from './utils/helper.service';
import { Comment } from '../../models/comment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ConfigService } from './utils/config.service';
import { ObjectId } from 'mongodb';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private commentsSubject = new BehaviorSubject<Comment[]>([]);
  comments$ = this.commentsSubject.asObservable();
  constructor(
    private helperService: HelperService,
    private httpClient: HttpClient,
    private config: ConfigService
  ) {}
  addComment(comment: Comment): Observable<Comment> {
    return this.helperService.addDocument<Comment>('Comment', comment);
  }
  getCommentsByIds(commentId: ObjectId): Observable<Comment[]> {
    return this.httpClient
      .get<Comment[]>(
        `${this.config.baseUrl}/comments/${commentId}`,
        this.config.httpHeader
      )
      .pipe(catchError(this.helperService.handleError));
  }
  getComments(postId: ObjectId): Observable<any[]> {
    return this.httpClient.get<any[]>(
      `${this.config.baseUrl}/posts/${postId}/comments`
    );
  }

  loadComments(postId: ObjectId) {
    this.getComments(postId).subscribe((comments) => {
      this.commentsSubject.next(comments);
    });
  }
  updateComment<K extends keyof Comment>(
    commentId: ObjectId,
    field: K,
    value?: ObjectId | Comment[K] | number,
    isArray: boolean = false,
    arrayOperation: 'push' | 'pop' | null = null,
    isNumber: boolean = false
  ) {
    this.helperService
      .updateCollectionField(
        'Comment',
        commentId,
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
}
