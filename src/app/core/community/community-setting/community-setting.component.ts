import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../models/user';
import { UserService } from '../../../shared/services/user.service';
import { UploadService } from '../../../shared/services/utils/upload-service.service';
import { HelperService } from '../../../shared/services/utils/helper.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Community } from '../../../models/community';
import { CommunityService } from '../../../shared/services/community.service';
import { AuthService } from '../../../shared/services/utils/auth.service';
import { ToastMessageService } from '../../../shared/services/utils/toast-message.service';

@Component({
  selector: 'app-community-setting',
  templateUrl: './community-setting.component.html',
  styleUrl: './community-setting.component.scss',
})
export class CommunitySettingComponent implements OnInit {
  selectedFile: File | null = null;
  updateDisplayName!: FormGroup;
  updateIcon!: FormGroup;
  updateDescription!: FormGroup;
  userProfile: User | undefined;
  uploadBanner!: FormGroup;
  community!: Community;
  updateGuidelines!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private uploadService: UploadService,
    private helperService: HelperService,
    private activatedRoute: ActivatedRoute,
    public communityService: CommunityService,
    private authService: AuthService,
    private toastMessageService: ToastMessageService
  ) {}

  ngOnInit() {
    this.userService.getProfile().subscribe(
      (data) => {
        this.userProfile = data;
      },
      (error) => {
        console.error('Error fetching profile data', error);
      }
    );
    this.activatedRoute.params.subscribe((params: Params) => {
      const communityId = params['id'];
      if (communityId) {
        this.helperService
          .getDocumentById<Community>('Community', communityId)
          .subscribe(
            (data: Community) => {
              this.community = data;
              this.initializeForm();
            },
            (error) => {
              console.error('Error fetching community:', error);
            }
          );
      }
    });
  }

  onFileSelected(event: Event, fieldName: string): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
      if (
        this.selectedFile &&
        this.uploadService.isFileSizeValid(this.selectedFile)
      ) {
        this.uploadService
          .isValidFile(this.selectedFile, 'image')
          .then((isValid) => {
            if (isValid) {
              this.readFile(this.selectedFile!, fieldName);
            } else {
              this.toastMessageService.showError('Invalid File Type');
              this.selectedFile = null;
            }
          })
          .catch((error) => {
            console.error(error.message);
            return;
          });
      } else {
        return;
      }
    }
  }

  private readFile(file: File, fieldName: string): void {
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (e.target?.result) {
        if (fieldName === 'banner') {
          this.community.banner_img_src = e.target.result as string;
        } else if (fieldName === 'icon') {
          this.community.icon_img_src = e.target.result as string;
        }
      }
    };
    reader.readAsDataURL(file);
  }

  initializeForm() {
    this.updateDisplayName = this.fb.group({
      display_name: [this.community?.display_name || '', Validators.required],
    });
    this.updateIcon = this.fb.group({
      icon_image: [this.community?.icon_img_src || '', Validators.required],
    });
    this.uploadBanner = this.fb.group({
      display_banner: [
        this.community?.banner_img_src || '',
        Validators.required,
      ],
    });
    this.updateDescription = this.fb.group({
      description: [this.community?.description || '', Validators.required],
    });
  }

  onUpload(type: string, modalId: string) {
    if (this.selectedFile) {
      const imageExtension = this.selectedFile.name.split('.').pop();
      if (this.community?._id) {
        this.uploadService
          .uploadFile(this.selectedFile, type, this.community._id)
          .subscribe(
            (response) => {
              if (this.community?._id) {
                const imageName = `http://localhost:3000/image/${type}/${type}_${this.community._id}.${imageExtension}`;
                const updateField =
                  type === 'communityIcon' ? 'icon_img_src' : 'banner_img_src';

                this.communityService.updateCommunity(
                  this.community._id,
                  updateField,
                  imageName
                );
              } else {
                console.error(
                  'Community ID not defined inside upload service response'
                );
              }
            },
            (uploadError) => {
              console.error('Error occurred during file upload:', uploadError);
            }
          );
      } else {
        console.error('Community ID not defined');
      }
    } else {
      console.error('No file selected');
    }
    this.closeModal(modalId);
  }

  closeModal(modalId: string) {
    this.authService.closeModal(modalId);
  }
}
