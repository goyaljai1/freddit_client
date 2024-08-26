import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ConfigService } from './config.service';
import { ObjectId } from 'mongodb';
import { ToastMessageService } from './toast-message.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class HelperService {
  constructor(
    private httpClient: HttpClient,
    private config: ConfigService,
    private toastMessageService: ToastMessageService,
    private router: Router
  ) {}

  getFieldFromCollection<T, K extends keyof T, F = string>(
    collection: string,
    field: K,
    searchField?: keyof T,
    searchValue?: any
  ): Observable<F[]> {
    let url = `${this.config.baseUrl}/${collection}`;
    if (searchField && searchValue !== undefined) {
      url += `?${String(searchField)}=${searchValue}`;
    }
    return this.httpClient.get<T | T[]>(url, this.config.httpHeader).pipe(
      catchError(this.handleError),
      map((response) => {
        if (Array.isArray(response)) {
          return response.map((item) => item[field] as F);
        } else {
          return [response[field] as F];
        }
      })
    );
  }

  getDocumentById<T>(collection: string, id: ObjectId): Observable<T> {
    return this.httpClient
      .get<T>(
        `${this.config.baseUrl}/api/${collection}/${id}`,
        this.config.httpHeader
      )
      .pipe(
        catchError((error) => {
          this.router.navigate(['**']);
          return this.handleError(error);
        })
      );
  }

  addDocument<T>(collection: string, document: T): Observable<T> {
    return this.httpClient
      .post<T>(
        `${this.config.baseUrl}/add/${collection}`,
        JSON.stringify(document),
        this.config.httpHeader
      )
      .pipe(catchError(this.handleError));
  }

  updateCollectionField(
    collectionName: string,
    id: ObjectId,
    field: string,
    fieldValue?: any,
    isArray: boolean = false,
    arrayAction: 'push' | 'pop' | null = null,
    isNumber: boolean = false
  ): Observable<any> {
    return this.httpClient
      .put<any>(
        `${this.config.baseUrl}/update_field`,
        {
          collectionName,
          id,
          field,
          fieldValue,
          isArray,
          arrayAction,
          isNumber,
        },
        this.config.httpHeader
      )
      .pipe(catchError(this.handleError));
  }

  getAllDocumentsWithFieldNames(
    collectionName: string,
    fieldNames: string[]
  ): Observable<any[]> {
    const fields = fieldNames.join(',');
    return this.httpClient.get<any[]>(
      `${this.config.baseUrl}/getAllDocumentsWithFieldNames/${collectionName}?fields=${fields}`
    );
  }
  handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof HttpErrorResponse) {
      errorMessage = `An error occurred: ${error.error.message}`;
    } else {
      errorMessage = `Server returned code: ${error.status}, error message is: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }

  copyText(text: string) {
    navigator.clipboard
      .writeText(`http://localhost:4200/${text}`)
      .then(() => {
        this.toastMessageService.showSuccess('Link Copied');
      })
      .catch((err) => {
        console.error('Could not copy text: ', err);
      });
  }

  deletDocument(collection: string, documentId: ObjectId) {
    return this.httpClient.delete(
      `${this.config.baseUrl}/${collection}/${documentId}`
    );
  }
}
