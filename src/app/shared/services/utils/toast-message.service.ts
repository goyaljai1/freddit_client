import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ToastMessageService {
  constructor(private toastr: ToastrService) {}
  // Toastr success message
  showSuccess(message: string) {
    this.toastr.success(message, 'Success', {
      closeButton: true,
      timeOut: 3000,
      progressBar: true,
      positionClass: 'toast-bottom-right',
    });
  }

  // Toastr error message
  showError(message: string) {
    this.toastr.error(message, 'Error', {
      closeButton: true,
      timeOut: 3000,
      progressBar: true,
      positionClass: 'toast-bottom-right',
    });
  }
}
