import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../models/user';
import { UserService } from '../../shared/services/user.service';
import { UploadService } from '../../shared/services/utils/upload-service.service';
import { HelperService } from '../../shared/services/utils/helper.service';
import { AuthService } from '../../shared/services/utils/auth.service';
import { buffer, from, switchMap } from 'rxjs';
import { ToastMessageService } from '../../shared/services/utils/toast-message.service';
declare var bootstrap: any;

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss',
})
export class EditProfileComponent implements OnInit {
  selectedFile: File | null = null;
  updateUsername!: FormGroup;
  updateProfilePicture!: FormGroup;
  updateDescription!: FormGroup;
  userProfile: User | undefined;

  constructor(
    private fb: FormBuilder,
    public userService: UserService,
    private uploadService: UploadService,
    private authService: AuthService,
    private toastMessageService: ToastMessageService
  ) {}

  ngOnInit() {
    this.userService.getProfile().subscribe(
      (data) => {
        this.userProfile = data;
        this.initializeForm();
      },
      (error) => {
        console.error('Error fetching profile data', error);
      }
    );
  }

  initializeForm() {
    this.updateUsername = this.fb.group({
      display_name: [this.userProfile?.display_name || '', Validators.required],
    });
    this.updateProfilePicture = this.fb.group({
      display_name: [
        this.userProfile?.profile_picture_src || '',
        Validators.required,
      ],
    });
    this.updateDescription = this.fb.group({
      about_description: [
        this.userProfile?.about_description || '',
        Validators.required,
      ],
    });
  }
  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      this.selectedFile = fileInput.files[0];
      if (
        this.selectedFile &&
        this.uploadService.isFileSizeValid(this.selectedFile)
      ) {
        this.uploadService
          .isValidFile(this.selectedFile, 'image')
          .then((isValid) => {
            if (isValid) {
              const reader = new FileReader();
              reader.onload = (e: any) => {
                this.userProfile!.profile_picture_src = e.target.result;
              };
              reader.readAsDataURL(this.selectedFile!);
            } else {
              this.toastMessageService.showError('Invalid File Type');
              this.selectedFile = null;
            }
          })
          .catch((error) => {
            console.error(error.message);
          });
      } else {
        this.selectedFile = null;
        return;
      }
    }
  }
  updateUserField(field: keyof User, fieldValue: string) {
    if (this.updateUsername.valid) {
      if (this.userProfile?._id)
        this.userService.updateUser(this.userProfile._id, field, fieldValue);
      if (field === 'display_name') {
        this.closeModal('exampleModal');
      } else if (field === 'about_description') {
        this.closeModal('about_descriptionModal');
      }
    } else {
      console.error('Form is invalid.');
    }
  }

  onUpload() {
    if (this.selectedFile) {
      const imageExtension = this.selectedFile.name.split('.').pop();
      if (this.userProfile?._id)
        this.uploadService
          .uploadFile(this.selectedFile, 'profilePicture', this.userProfile._id)
          .subscribe(() => {
            if (this.userProfile?._id) {
              const profilePictureSrc = `http://localhost:3000/image/profilePictures/avatar_${
                this.userProfile!._id
              }.${imageExtension}`;
              return this.userService.updateUser(
                this.userProfile._id,
                'profile_picture_src',
                profilePictureSrc
              );
            } else {
              return 'profile id not defined';
            }
          });
    } else {
      console.error('No file selected');
    }
    this.closeModal('uploadProfilePictureModal');
  }

  closeModal(modalId: string) {
    this.authService.closeModal(modalId);
  }
}
