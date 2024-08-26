import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ObjectId } from 'mongodb';
import { Community } from '../../../models/community';
import { HelperService } from '../../../shared/services/utils/helper.service';
import { AuthService } from '../../../shared/services/utils/auth.service';
import { PostService } from '../../../shared/services/post.service';
import { UploadService } from '../../../shared/services/utils/upload-service.service';
import { CommunityService } from '../../../shared/services/community.service';
import { UserService } from '../../../shared/services/user.service';
import { Post } from '../../../models/post';
import { ActivatedRoute, Params } from '@angular/router';
import { ToastMessageService } from '../../../shared/services/utils/toast-message.service';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrl: '../create-post/create-post.component.scss',
})
export class EditPostComponent implements OnInit {
  postTextForm!: FormGroup;
  postMediaForm!: FormGroup;
  uploadPostForm!: FormGroup;
  isFileSelected: boolean = false;
  selectedFile: File | null = null;
  filePreviewUrl: string | null = null;
  isFileImage: boolean = false;
  isFileVideo: boolean = false;
  allCommunities!: any[];
  textError: boolean = false;
  userId!: ObjectId;
  post!: any;
  community!: Community;

  postId!: ObjectId;
  filteredCommunities: any[] = [];
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
    private activatedRoute: ActivatedRoute,
    private toastMessageService: ToastMessageService
  ) {}

  ngOnInit() {
    this.initializeForms();
    this.loadPostData();
    this.loadUserId();
  }

  private initializeForms() {
    this.postTextForm = this.fb.group({
      title: ['', Validators.required],
      text: [''],
    });

    this.postMediaForm = this.fb.group({
      title: ['', Validators.required],
    });
  }

  private loadPostData() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.postId = params['id'];

      this.helperService
        .getDocumentById<Post>('Post', this.postId)
        .subscribe((post: Post) => {
          this.post = post;
          this.updateFormValues();
          this.loadCommunityData(post.community_id);
        });
    });
  }

  private loadCommunityData(communityId: ObjectId) {
    this.helperService
      .getDocumentById<Community>('Community', communityId)
      .subscribe((community: Community) => {
        this.community = community;
      });
  }

  private loadUserId() {
    this.authService.getUserId().subscribe((userId) => {
      this.userId = userId!;
    });
  }

  private updateFormValues() {
    this.postTextForm.patchValue({
      title: this.post.title,
      text: this.post.text,
    });

    this.postMediaForm.patchValue({
      title: this.post.title,
    });

    if (this.post.img_src) {
      this.setupFilePreview(this.post.img_src, true, false);
    } else if (this.post.vid_src) {
      this.setupFilePreview(this.post.vid_src, false, true);
    }
  }

  private setupFilePreview(url: string, isImage: boolean, isVideo: boolean) {
    this.filePreviewUrl = url;
    this.isFileImage = isImage;
    this.isFileVideo = isVideo;
    this.isFileSelected = true;
  }

  validateText() {
    const rawText = this.postTextForm.get('text')!.value;
    if (rawText) {
      const strippedText = rawText.replace(/<[^>]*>/g, ''); // Remove HTML tags
      this.textError = !/\S/.test(strippedText); // Check for non-whitespace characters
    } else {
      this.textError = true;
    }
  }

  onSubmit(type: string) {
    if (type === 'text') {
      this.handleTextSubmission();
    } else if (type === 'media') {
      this.handleMediaSubmission();
    }
  }

  private handleTextSubmission() {
    if (this.post.title !== this.postTextForm.get('title')!.value) {
      this.updatePost('title', this.postTextForm.get('title')!.value);
    }

    this.validateText();
    if (!this.textError && this.postTextForm.valid) {
      this.updatePost('text', this.postTextForm.get('text')!.value);
    }

    this.postTextForm.reset();
    this.userService.displayUser(this.userId);
  }

  private handleMediaSubmission() {
    if (this.post.title !== this.postMediaForm.get('title')!.value) {
      this.updatePost('title', this.postMediaForm.get('title')!.value);
    }

    if (this.isFileSelected && this.selectedFile) {
      this.uploadFile(this.post._id);
    } else {
      this.postMediaForm.reset();
      this.userService.displayUser(this.userId);
    }
  }

  private updatePost(field: keyof Post, value: any) {
    this.postService.updatePost(this.post._id, field, value);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      if (
        this.selectedFile &&
        this.uploadService.isFileSizeValid(this.selectedFile)
      ) {
        const fileType = this.selectedFile.type;
        this.isFileImage = fileType.startsWith('image/');
        this.isFileVideo = fileType.startsWith('video/');
        this.uploadService
          .isValidFile(this.selectedFile, fileType.split('/')[0])
          .then((isValid) => {
            if (isValid) {
              this.filePreviewUrl = URL.createObjectURL(this.selectedFile!);
              this.isFileSelected = true;
            } else {
              this.toastMessageService.showError('Invalid File Type');
              this.isFileSelected = false;
              this.selectedFile = null;
            }
          })
          .catch((error) => {
            console.error(error.message);
          });
      } else {
        this.isFileSelected = false;
        this.selectedFile = null;
        return;
      }
    } else {
      this.resetFileSelection();
    }
  }

  removeFile(): void {
    this.resetFileSelection();
    const fileInput = document.getElementById('imageP') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }

    if (this.filePreviewUrl) {
      URL.revokeObjectURL(this.filePreviewUrl);
    }
  }

  private resetFileSelection() {
    this.filePreviewUrl = null;
    this.isFileImage = false;
    this.isFileVideo = false;
    this.isFileSelected = false;
    this.selectedFile = null;
  }

  private uploadFile(postId: ObjectId) {
    const fileExtension = this.selectedFile!.name.split('.')
      .pop()
      ?.toLowerCase();
    if (!fileExtension) {
      console.error('Unable to determine file extension');
      return;
    }

    const isImage = ['jpg', 'png'].includes(fileExtension);
    const isVideo = ['mp4', 'avi'].includes(fileExtension);

    if (!isImage && !isVideo) {
      console.error('Unsupported file type');
      return;
    }

    const fileType = isImage ? 'singleImagePost' : 'singleVideoPost';
    const srcField = isImage ? 'img_src' : 'vid_src';
    const filePath = `http://localhost:3000/image/${fileType}/post_${postId}.${fileExtension}`;

    this.uploadService
      .uploadFile(this.selectedFile!, fileType, postId)
      .subscribe(
        () => {
          this.updatePost(srcField, filePath);
          if (isImage) {
            this.updatePost('vid_src', null);
            this.postMediaForm.reset();
            this.userService.displayUser(this.userId);
          } else if (isVideo) {
            this.updatePost('img_src', null);
            this.postMediaForm.reset();
            this.userService.displayUser(this.userId);
          }
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
  }
}
