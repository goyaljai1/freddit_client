import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { HelperService } from './helper.service';
import { catchError, Observable, throwError } from 'rxjs';
import { ObjectId } from 'mongodb';
import { ToastMessageService } from './toast-message.service';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  constructor(
    private httpClient: HttpClient,
    private configService: ConfigService,
    private toastMessageService: ToastMessageService
  ) {}

  uploadFile(file: File, type: string, entityId: ObjectId): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.httpClient
      .post<any>(
        `${this.configService.baseUrl}/upload/${type}/${entityId}`,
        formData,
        {
          headers: this.configService.getHttpHeadersWithoutContentType(),
        }
      )
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
  isFileSizeValid(file: File) {
    if (file.size > 10 * 1024 * 1024) {
      this.toastMessageService.showError(
        `File size limit exceded! Max. Limit: 10Mb`
      );
      return false;
    } else {
      return true;
    }
  }
  isValidFile(file: File, fileType: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error('No file provided'));
        return;
      }

      const reader = new FileReader();

      reader.onloadend = (e) => {
        const arrayBuffer = reader.result as ArrayBuffer;
        const bytes = new Uint8Array(arrayBuffer).subarray(0, 4); // Read first 4 bytes
        const header = Array.from(bytes)
          .map((byte) => byte.toString(16).padStart(2, '0'))
          .join('')
          .toUpperCase();

        if (fileType === 'image' && this.isValidImage(header)) {
          resolve(true);
        } else if (fileType === 'video' && this.isValidVideo(header)) {
          resolve(true);
        } else {
          resolve(false);
        }
      };

      reader.onerror = (e) => {
        reject(new Error('Error reading file'));
      };

      reader.readAsArrayBuffer(file);
    });
  }

  isValidImage(header: string): boolean {
    const validSignatures = [
      '89504E47', // PNG
      'FFD8FFE0', // JPEG
      'FFD8FFE1', // JPEG
      'FFD8FFE2', // JPEG
    ];
    return validSignatures.includes(header);
  }
  isValidVideo(header: string): boolean {
    const validSignatures = [
      '00000018', // MP4
      '00000020', // MP4
      '66747970', // MP4 (ISO Base Media file format)
      '52494646', // AVI (RIFF header)
    ];
    return validSignatures.includes(header);
  }
}
