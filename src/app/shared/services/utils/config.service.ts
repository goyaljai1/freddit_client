import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private token: string | null;

  constructor(private localStorageService: LocalStorageService) {
    this.token = this.localStorageService.getItem('token');
  }

  readonly baseUrl = 'http://localhost:3000';

  get httpHeader() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    if (this.token) {
      headers = headers.set('Authorization', `Bearer ${this.token}`);
    }

    return { headers: headers };
  }

  getHttpHeadersWithoutContentType() {
    let headers = new HttpHeaders();

    if (this.token) {
      headers = headers.set('Authorization', `Bearer ${this.token}`);
    }

    return headers;
  }
}
