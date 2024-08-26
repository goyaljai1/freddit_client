import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of, switchMap } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { HttpClient } from '@angular/common/http';
import { ObjectId } from 'mongodb';
import { __values } from 'tslib';
declare var bootstrap: any;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedInSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  private userIdSubject = new BehaviorSubject<ObjectId | null>(null);

  private apiUrl = 'http://localhost:3000/api/verify-token';

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {
    this.checkTokenValidity();
  }

  checkTokenValidity(): void {
    const token = this.localStorageService.getItem('token');
    if (token) {
      this.verifyToken(token).subscribe(
        (response) => {
          const isValid = response.message === 'Token is valid';
          if (isValid) {
            this.isLoggedInSubject.next(true);

            this.userIdSubject.next(response.userId || null);
          } else {
            this.setLoginStatus(false);
          }
        },
        (error) => {
          this.setLoginStatus(false);
        }
      );
    } else {
      this.setLoginStatus(false);
    }
  }

  private verifyToken(
    token: string
  ): Observable<{ message: string; userId?: ObjectId }> {
    return this.http
      .post<{ message: string; userId?: ObjectId }>(this.apiUrl, { token })
      .pipe(
        catchError(() => of({ message: 'Invalid token' })) // Handle errors
      );
  }

  setLoginStatus(status: boolean): void {
    this.isLoggedInSubject.next(status);
    if (!status) {
      this.localStorageService.removeItem('token');
      this.userIdSubject.next(null);
    }
  }

  getLoginStatus(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  getUserId(): Observable<ObjectId | null> {
    return this.userIdSubject.asObservable();
  }

  openModal() {
    const modal = new bootstrap.Modal(document.getElementById('exampleModal'));
    modal.show();
  }

  closeModal(modalId: string) {
    const modalElement = document.getElementById(modalId);

    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement);

      if (modalInstance) {
        modalInstance.hide();
      }
    }
  }
}
