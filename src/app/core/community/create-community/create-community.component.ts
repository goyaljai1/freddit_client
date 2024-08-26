import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Community } from '../../../models/community';
import { CommunityService } from '../../../shared/services/community.service';
import { UploadService } from '../../../shared/services/utils/upload-service.service';
import { HelperService } from '../../../shared/services/utils/helper.service';
import { AuthService } from '../../../shared/services/utils/auth.service';
import { UserService } from '../../../shared/services/user.service';
import { ObjectId } from 'mongodb';
import { ToastMessageService } from '../../../shared/services/utils/toast-message.service';

@Component({
  selector: 'app-create-community',
  templateUrl: './create-community.component.html',
  styleUrls: ['./create-community.component.scss'],
})
export class CreateCommunityComponent implements OnInit {
  communityForm!: FormGroup;
  isCommunityFormSubmitted: boolean = false;
  banner: string | ArrayBuffer = 'assets/communityDefaultBanner.jpg';
  icon: string | ArrayBuffer = 'assets/community.jpg';
  isStylingCompleted: boolean = false;
  isTopicSelectionActive: boolean = false;
  selectedTopics: string[] = [];
  bannerFileName!: string;
  iconFileName!: string;
  bannerFile: File | null = null;
  iconFile: File | null = null;
  communityId!: ObjectId;
  userId: ObjectId | null = null;
  bannerFileExtension!: string;
  iconFileExtension!: string;
  arrCommunityNames!: string[];
  // Interest form options
  technologyTopics = [
    'Artificial Intelligence',
    'Blockchain',
    'Cybersecurity',
    'Data Science',
    'Machine Learning',
    'Programming',
    'Software Development',
  ];
  sportsTopics = [
    'Basketball',
    'Football',
    'Golf',
    'Soccer',
    'Tennis',
    'Running',
    'Swimming',
  ];
  musicTopics = ['Rock', 'Pop', 'Hip Hop', 'EDM', 'Classical', 'Jazz', 'R&B'];
  travelTopics = [
    'Adventure Travel',
    'Beach Holidays',
    'Cultural Tourism',
    'Nature Exploration',
    'Road Trips',
    'Solo Travel',
    'Family Vacations',
  ];
  foodTopics = [
    'Italian Cuisine',
    'Japanese Cuisine',
    'Mexican Cuisine',
    'Vegetarian & Vegan',
    'Healthy Eating',
    'Baking',
    'Street Food',
  ];
  scienceTopics = [
    'Astronomy',
    'Biology',
    'Chemistry',
    'Environmental Science',
    'Physics',
    'Psychology',
    'Space Exploration',
  ];
  trendingTopics = [
    'Climate Change',
    'Cryptocurrency',
    'Streaming Services',
    'Remote Work',
    'Wellness',
    'Sustainable Living',
    'Online Learning',
  ];

  constructor(
    private fb: FormBuilder,
    private communityService: CommunityService,
    private uploadService: UploadService,
    private helperService: HelperService,
    private authService: AuthService,
    private userService: UserService,
    private toastMessageService: ToastMessageService
  ) {}

  ngOnInit() {
    this.communityForm = this.fb.group({
      communityName: [
        '',
        [Validators.required, Validators.minLength(4)],
        this.checkIfCommunityNameExists.bind(this),
      ],
      description: ['', Validators.required],
    });
    this.authService.getUserId().subscribe((userId) => {
      this.userId = userId;
    });
    this.helperService
      .getFieldFromCollection<Community, 'community_name', string>(
        'communities',
        'community_name'
      )
      .subscribe((emails) => {
        this.arrCommunityNames = emails;
      });
  }
  checkIfCommunityNameExists(
    control: AbstractControl
  ): Promise<ValidationErrors | null> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const communityName = control.value.replaceAll(' ', '_');
        if (
          this.arrCommunityNames &&
          this.arrCommunityNames.includes(communityName)
        ) {
          resolve({ communityNameExists: true });
        } else {
          resolve(null);
        }
      }, 500);
    });
  }

  get communityName(): string {
    const control = this.communityForm.get('communityName');
    return control ? control.value : '';
  }

  get description(): string {
    const control = this.communityForm.get('description');
    return control ? control.value : '';
  }

  handleSubmit() {
    if (this.communityForm.valid) {
      this.isCommunityFormSubmitted = true;
    }
  }

  handleCancel() {
    this.communityForm.reset();
    this.isCommunityFormSubmitted = false;
  }

  triggerBannerUpload() {
    const bannerInput = document.getElementById('banner') as HTMLInputElement;
    bannerInput.click();
  }

  triggerIconUpload() {
    const iconInput = document.getElementById('icon') as HTMLInputElement;
    iconInput.click();
  }

  handleBackToCommunityForm() {
    this.isCommunityFormSubmitted = false;
  }

  handleStyleSubmit() {
    this.isStylingCompleted = true;
    this.isTopicSelectionActive = true;
  }
  handleFileChange(event: Event, type: 'banner' | 'icon') {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (file && this.uploadService.isFileSizeValid(file)) {
        this.uploadService
          .isValidFile(file, 'image')
          .then((isValid) => {
            if (isValid) {
              const imageExtension = file.name.split('.').pop();
              const reader = new FileReader();
              reader.onload = () => {
                if (type === 'banner') {
                  this.banner = reader.result!;
                  this.bannerFileExtension = imageExtension!;
                  if (input.files && input.files[0])
                    this.bannerFile = input.files[0];
                } else {
                  this.icon = reader.result!;
                  this.iconFileExtension = imageExtension!;
                  if (input.files && input.files[0])
                    this.iconFile = input.files[0];
                }
              };
              reader.readAsDataURL(file);
            } else {
              this.toastMessageService.showError('Invalid File Type');
              return;
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

  handleBackToStyling() {
    this.isStylingCompleted = false;
    this.isTopicSelectionActive = false;
  }

  canSubmit() {
    return this.selectedTopics.length >= 3;
  }

  toggleTopicSelection(topic: string) {
    const index = this.selectedTopics.indexOf(topic);
    if (index === -1) {
      this.selectedTopics.push(topic);
    } else {
      this.selectedTopics.splice(index, 1);
    }
  }

  handleFinalSubmit() {
    if (this.canSubmit() && this.communityForm.valid) {
      const tempCommunity: Community = {
        community_name: this.communityForm.value.communityName.replaceAll(
          ' ',
          '_'
        ),
        display_name: this.communityForm.value.communityName.replaceAll(
          ' ',
          '_'
        ),
        members_ids: [this.userId!],
        description: this.communityForm.value.description,
        topics: this.selectedTopics,
        guidelines: [],
        banner_img_src:
          'http://localhost:3000/image/communityBanner/defaultCommunityBanner.jpg',
        icon_img_src:
          'http://localhost:3000/image/communityIcon/defaultCommunityIcon.jpg',
        moderator_id: this.userId!,
        members_count: 1,
        community_type: 'public',
        post_ids: [],
      };

      this.communityService.addCommunity(tempCommunity).subscribe(
        (response: any) => {
          this.helperService
            .getFieldFromCollection<Community, '_id', ObjectId>(
              'communities',
              '_id',
              'community_name',
              this.communityForm.value.communityName.replaceAll(' ', '_')
            )
            .subscribe(
              (ids) => {
                this.communityId = ids[0];
                if (this.bannerFile) {
                  this.uploadService
                    .uploadFile(
                      this.bannerFile,
                      'communityBanner',
                      this.communityId
                    )
                    .subscribe(
                      (response) => {},
                      (error) => {
                        console.error('Error uploading banner:', error);
                      }
                    );

                  this.communityService.updateCommunity(
                    this.communityId,
                    'banner_img_src',
                    `http://localhost:3000/image/communityBanner/communityBanner_${this.communityId}.${this.bannerFileExtension}`
                  );
                }

                if (this.iconFile) {
                  this.uploadService
                    .uploadFile(
                      this.iconFile,
                      'communityIcon',
                      this.communityId
                    )
                    .subscribe(
                      (response) => {},
                      (error) => {
                        console.error('Error uploading icon:', error);
                      }
                    );
                  this.communityService.updateCommunity(
                    this.communityId,
                    'icon_img_src',
                    `http://localhost:3000/image/communityIcon/communityIcon_${this.communityId}.${this.iconFileExtension}`
                  );
                }
                this.userService.updateUser(
                  this.userId!,
                  'community_ids',
                  this.communityId,
                  true,
                  'push'
                );
                this.userService.updateUser(
                  this.userId!,
                  'joined_communities',
                  this.communityId,
                  true,
                  'push'
                );
                this.resetFormState();
              },
              (error) => {
                console.error('Error fetching community ID:', error);
                this.resetFormState();
              }
            );
        },
        (error: any) => {
          console.error('Error adding community', error);
          this.resetFormState();
        }
      );
    } else {
      this.resetFormState();
    }
  }
  resetFormState() {
    this.communityForm.reset();
    this.isCommunityFormSubmitted = false;
    this.banner = 'assets/communityDefaultBanner.jpg';
    this.icon = 'assets/community.jpg';
    this.isStylingCompleted = false;
    this.isTopicSelectionActive = false;
    this.selectedTopics = [];
    this.communityService.displayCommunity(this.communityId!);
  }
}
