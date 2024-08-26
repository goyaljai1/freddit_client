import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { privateDecrypt } from 'crypto';
import { HelperService } from '../../../shared/services/utils/helper.service';
import { Post } from '../../../models/post';
import { AuthService } from '../../../shared/services/utils/auth.service';
import { ObjectId } from 'mongodb';
import { PostService } from '../../../shared/services/post.service';
import { UploadService } from '../../../shared/services/utils/upload-service.service';
import { CommunityService } from '../../../shared/services/community.service';
import { UserService } from '../../../shared/services/user.service';
import { Community } from '../../../models/community';
import { ToastMessageService } from '../../../shared/services/utils/toast-message.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.scss',
})
export class CreatePostComponent implements OnInit {
  postTextForm!: FormGroup;
  postMediaForm!: FormGroup;
  uploadPost!: FormGroup;
  selectedFile: File | null = null;
  filePreviewUrl: string | ArrayBuffer | null = null;
  isFileImage: boolean = false;
  isFileVideo: boolean = false;
  allCommunities!: any[];
  userId!: ObjectId;
  charCount: number = 0;
  postTextCharCount: number = 0;

  postId!: ObjectId;
  filteredCommunity: any[] = [];
  searchQuery: string = '';
  selectedCommunityId: ObjectId | null = null;
  selectedCommunity!: Community;
  customToolbarOptions = [
    ['bold', 'italic'],
    ['blockquote', 'code-block'],
    ['link', 'image'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ script: 'sub' }, { script: 'super' }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ align: [] }],
  ];

  constructor(
    private fb: FormBuilder,
    private helperService: HelperService,
    private authService: AuthService,
    private postService: PostService,
    private uploadService: UploadService,
    private communityService: CommunityService,
    private userService: UserService,
    private toastMessageService: ToastMessageService
  ) {}

  ngOnInit() {
    this.postTextForm = this.fb.group({
      title: ['', Validators.required],
      text: [''],
    });
    this.postMediaForm = this.fb.group({
      title: ['', Validators.required],
    });
    this.authService.getUserId().subscribe((userId) => {
      this.userId = userId!;
    });
    this.helperService
      .getAllDocumentsWithFieldNames('Community', [
        '_id',
        'community_name',
        'icon_img_src',
      ])
      .subscribe(
        (data) => {
          this.allCommunities = data;
          // console.log(this.allCommunities, 'all communities');
        },
        (error) => {
          console.error('Error retrieving documents:', error);
        }
      );
  }
  updateCharCount() {
    const titleControl = this.postTextForm.get('title');
    this.charCount = titleControl ? titleControl.value.length : 0;
  }
  filterCommunities() {
    // console.log(this.searchQuery.length);
    if (this.searchQuery.length != 0)
      this.filteredCommunity = this.allCommunities.filter((community) =>
        community.community_name
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase())
      );
  }

  selectCommunity(community: any) {
    this.selectedCommunityId = community._id;
    this.selectedCommunity = community;
  }

  clearSelection() {
    this.selectedCommunityId = null;
    this.searchQuery = '';
  }

  displayText() {
    const rawText = this.postTextForm.get('text')!.value;
    if (rawText) {
      const strippedText = rawText.replace(/<[^>]*>/g, '');
      this.postTextCharCount = strippedText.length;
    } else {
      this.postTextCharCount = 0;
    }
  }

  onSubmit(type: string) {
    const now = new Date();
    const tempPost: Post = {
      creator_id: this.userId,
      community_id: this.selectedCommunityId!,
      category: type,
      title: '',
      text: '',
      status: 'pending',
      vote_count: 0,
      comment_count: 0,
      time_of_posting: now,
      parent_comment_ids: [],
    };
    if (type === 'text') {
      if (this.postTextForm.valid) {
        tempPost.title = this.postTextForm.get('title')!.value;
        tempPost.text = this.postTextForm.get('text')!.value;
        this.addPost(tempPost);
      }
      this.charCount = 0;
      this.postTextForm.reset();
    }
    if (type === 'media') {
      tempPost.title = this.postMediaForm.get('title')!.value;
      this.addPost(tempPost);
      this.charCount = 0;
      this.postMediaForm.reset();
    }
  }

  addPost(tempPost: Post) {
    // console.log(tempPost);

    this.postService.addPost(tempPost).subscribe(
      (response: any) => {
        this.postId = response._id;
        if (tempPost.category === 'text') {
          this.communityService.updateCommunity(
            this.selectedCommunityId!,
            'post_ids',
            this.postId,
            true,
            'push'
          );
        } else {
          this.onUpload(response._id);
        }

        this.userService.updateUser(
          this.userId,
          'created_post_ids',
          response._id,
          true,
          'push'
        );
        this.userService.displayUser(this.userId);
      },
      (error: any) => {
        console.error('Error adding post', error);
        this.postTextForm.reset();
      }
    );
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      if (
        this.selectedFile &&
        this.uploadService.isFileSizeValid(this.selectedFile)
      ) {
        const fileType = this.selectedFile!.type;
        this.isFileImage = fileType.startsWith('image/');
        this.isFileVideo = fileType.startsWith('video/');
        this.uploadService
          .isValidFile(this.selectedFile, fileType.split('/')[0])
          .then((isValid) => {
            if (isValid) {
              this.filePreviewUrl = URL.createObjectURL(this.selectedFile!);
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
    } else {
      this.filePreviewUrl = null;
      this.isFileImage = false;
      this.isFileVideo = false;
    }
  }

  removeFile(): void {
    // Clear the file input
    const fileInput = document.getElementById('imageP') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }

    // Reset file preview
    this.filePreviewUrl = null;
    this.isFileImage = false;
    this.isFileVideo = false;

    // Optionally, revoke the object URL
    if (this.filePreviewUrl) {
      URL.revokeObjectURL(this.filePreviewUrl);
    }
    this.selectedFile = null;
  }
  onUpload(postId: ObjectId) {
    if (this.selectedFile) {
      const fileExtension = this.selectedFile.name
        .split('.')
        .pop()
        ?.toLowerCase();

      if (fileExtension && ['jpg', 'png'].includes(fileExtension)) {
        this.uploadService
          .uploadFile(this.selectedFile, 'singleImagePost', postId)
          .subscribe(
            () => {
              this.communityService.updateCommunity(
                this.selectedCommunityId!,
                'post_ids',
                postId,
                true,
                'push'
              );
              this.postService.updatePost(
                postId,
                'img_src',
                `http://localhost:3000/image/singleImagePost/post_${postId}.${fileExtension}`
              );
            },
            (error) => {
              if (error.error.error === 'File size should not exceed 10 MB.') {
                this.toastMessageService.showError(`File size limit exceded!`);
                this.selectedFile = null;
                return;
              } else {
                console.error('Error uploading video file:', error);
              }
            }
          );
      } else if (fileExtension && ['mp4', 'avi'].includes(fileExtension)) {
        this.uploadService
          .uploadFile(this.selectedFile, 'singleVideoPost', postId)
          .subscribe(
            () => {
              this.communityService.updateCommunity(
                this.selectedCommunityId!,
                'post_ids',
                postId,
                true,
                'push'
              );
              this.postService.updatePost(
                postId,
                'vid_src',
                `http://localhost:3000/image/singleVideoPost/post_${postId}.${fileExtension}`
              );
            },
            (error) => {
              if (error.error.error === 'File size should not exceed 10 MB.') {
                this.toastMessageService.showError(`File size limit exceded!`);
                this.selectedFile = null;
                return;
              } else {
                console.error('Error uploading video file:', error);
              }
            }
          );
      } else {
        console.error('Unsupported file type');
      }
    } else {
      console.error('No file selected');
    }
  }
}
