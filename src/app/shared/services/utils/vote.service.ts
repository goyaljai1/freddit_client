import { Injectable } from '@angular/core';
import { HelperService } from './helper.service';
import { Vote } from '../../../models/vote';
import { ObjectId } from 'mongodb';
import { BehaviorSubject, catchError, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';
import { ToastMessageService } from './toast-message.service';

@Injectable({
  providedIn: 'root',
})
export class VoteService {
  private postKarmaSource = new BehaviorSubject<number>(0);
  postKarma$ = this.postKarmaSource.asObservable();
  constructor(
    private helperService: HelperService,
    private httpClient: HttpClient,
    private config: ConfigService,
    private toastMessageService: ToastMessageService
  ) {}

  addVote(
    entity_id: ObjectId,
    user_id: ObjectId,
    action: 1 | 0 | -1
  ): Observable<any> {
    const tempVote: Vote = {
      entity_id: entity_id,
      user_id: user_id,
      status: action,
    };
    return this.helperService.addDocument<Vote>('Vote', tempVote); // Return the observable
  }

  getVoteStatus(
    postId: ObjectId,
    userId: ObjectId
  ): Observable<{ status: number; voteId: string | null }> {
    return this.httpClient
      .get<{ status: number; voteId: string | null }>(
        `${this.config.baseUrl}/getVotes/${postId}/${userId}`,
        this.config.httpHeader
      )
      .pipe(catchError(this.helperService.handleError));
  }

  updateVoteStatus(voteId: ObjectId, statusValue: number) {
    this.helperService
      .updateCollectionField('Vote', voteId, 'status', statusValue)
      .subscribe({
        next: (response) => {},
        error: (error) => {
          console.error(`Error updating status:`, error);
        },
      });
  }

  setPostKarma(postKarma: number) {
    this.postKarmaSource.next(postKarma);
  }
}
