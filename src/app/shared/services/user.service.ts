import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { User } from '../../models/user';
import { HelperService } from './utils/helper.service';
import { ConfigService } from './utils/config.service';
import { LocalStorageService } from './utils/local-storage.service';
import { AuthService } from './utils/auth.service';
import { ObjectId } from 'mongodb';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private httpClient: HttpClient,
    private helperService: HelperService,
    private config: ConfigService,
    private localStorageService: LocalStorageService,
    private authService: AuthService,
    private router: Router
  ) {}

  getUsers(): Observable<User[]> {
    return this.httpClient
      .get<User[]>(`${this.config.baseUrl}/users`, this.config.httpHeader)
      .pipe(catchError(this.helperService.handleError));
  }
  addUser(user: User): Observable<User> {
    return this.httpClient
      .post<User>(
        `${this.config.baseUrl}/signUp`,
        JSON.stringify(user),
        this.config.httpHeader
      )
      .pipe(catchError(this.helperService.handleError));
  }
  login(email: string, password: string): Observable<any> {
    return this.httpClient
      .post<any>(
        `${this.config.baseUrl}/login`,
        { email, password },
        this.config.httpHeader
      )
      .pipe(catchError(this.helperService.handleError));
  }

  logout(): void {
    this.localStorageService.removeItem('token');
    this.authService.setLoginStatus(false);
  }

  getProfile(): Observable<User> {
    return this.httpClient
      .get<User>(`${this.config.baseUrl}/profile`, this.config.httpHeader)
      .pipe(catchError(this.helperService.handleError));
  }

  displayUser(userId: ObjectId) {
    this.router.navigate([`user/${userId}`]);
  }

  updateUser<K extends keyof User>(
    userId: ObjectId,
    field: K,
    value: ObjectId | User[K],
    isArray: boolean = false,
    arrayOperation: 'push' | 'pop' | null = null
  ) {
    this.helperService
      .updateCollectionField(
        'User',
        userId,
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
}
