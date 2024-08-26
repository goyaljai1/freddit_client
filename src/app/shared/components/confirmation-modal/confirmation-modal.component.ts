import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
declare var bootstrap: any; // Declare bootstrap for TypeScript

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrl: './confirmation-modal.component.scss',
})
export class ConfirmationModalComponent {
  @ViewChild('confirmationModal') confirmationModal!: ElementRef;
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  private modalInstance: any;

  ngAfterViewInit(): void {
    this.modalInstance = new bootstrap.Modal(
      this.confirmationModal.nativeElement
    );
  }

  showModal(): void {
    this.modalInstance.show();
  }

  hideModal(): void {
    this.modalInstance.hide();
  }

  onConfirm(): void {
    this.confirm.emit();
    this.hideModal();
  }

  onCancel(): void {
    this.cancel.emit();
    this.hideModal();
  }
}
