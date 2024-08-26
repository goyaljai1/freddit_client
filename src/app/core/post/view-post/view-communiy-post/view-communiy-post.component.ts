import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { PostService } from '../../../../shared/services/post.service';
import { ObjectId } from 'mongodb';
import { Router } from '@angular/router';
import { UserService } from '../../../../shared/services/user.service';
import { AuthService } from '../../../../shared/services/utils/auth.service';
import { HelperService } from '../../../../shared/services/utils/helper.service';
import { User } from '../../../../models/user';
import { map, Observable, Subscription } from 'rxjs';
import { ConfirmationModalComponent } from '../../../../shared/components/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-view-communiy-post',
  templateUrl: './view-communiy-post.component.html',
  styleUrl: './view-communiy-post.component.scss',
})
export class ViewCommuniyPostComponent implements OnInit {
  sortPostMethod: string = 'New'; // Default sort method if none is selected

  @Input() communityId: ObjectId | null = null;
  @Input() isModerator: boolean = false;
  @ViewChild('confirmationModal')
  confirmationModal!: ConfirmationModalComponent;
  @Input() sortPost!: EventEmitter<string>;
  private eventSubscription!: Subscription;

  posts!: any[];
  creators!: Object[];
  isFullscreen = false;
  fullScreenImgSrc!: string;
  userId!: ObjectId;
  isPostSaved: boolean | undefined;

  constructor(
    public postService: PostService,
    private router: Router,
    public userService: UserService,
    public helperService: HelperService,
    private authService: AuthService
  ) {
    // console.log('okkk');
  }

  ngOnInit(): void {
    this.loadPosts(this.communityId!);
    this.authService.getUserId().subscribe((userId) => {
      this.userId = userId!;
    });
    this.eventSubscription = this.sortPost.subscribe((data: string) => {
      this.sortPostMethod = data;
      this.sortPosts();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['communityId'] && !changes['communityId'].isFirstChange()) {
      this.loadPosts(this.communityId!);
    }
  }

  loadPosts(communityId: ObjectId): void {
    this.postService.getPostsByCommunity(communityId).subscribe(
      (posts) => {
        this.posts = posts;
        this.sortPosts();
        if (this.userId) this.checkSavedPosts();
      },
      (error) => {
        console.error('Error fetching posts:', error);
      }
    );
  }

  sortPosts(): void {
    if (this.sortPostMethod === 'Most Upvoted') {
      this.posts = this.postService.sortPostsByVoteCount(
        this.posts,
        'descending'
      );
    } else if (this.sortPostMethod === 'New') {
      this.posts = this.postService.sortPostsByTime(this.posts, 'descending');
    }
  }

  checkSavedPosts(): void {
    this.posts.forEach((post) => {
      this.isSavedPost(post._id).subscribe((isSaved) => {
        post.isSaved = isSaved; // Add a property `isSaved` to the post object
      });
    });
  }

  ngOnDestroy(): void {
    if (this.eventSubscription) {
      this.eventSubscription.unsubscribe();
    }
  }

  isSavedPost(postId: ObjectId): Observable<boolean> {
    return this.helperService
      .getDocumentById<User>('User', this.userId)
      .pipe(map((data: User) => data.saved_post_ids.includes(postId)));
  }

  saveUnsavePost(postId: ObjectId, userId: ObjectId, action: 'push' | 'pop') {
    if (this.userId) {
      this.postService.saveUnsavePost(postId, userId, action);
      this.checkSavedPosts();
    } else {
      this.authService.openModal();
    }
  }

  openFullscreen(imgSrc: string): void {
    this.fullScreenImgSrc = imgSrc;
    this.isFullscreen = true;
  }

  closeFullscreen(): void {
    this.isFullscreen = false;
  }

  openPost(event: MouseEvent, post: any): void {
    if (event.currentTarget === event.target) {
      this.router.navigate([`/post/${post._id}`], { state: { post } });
    }
  }
  approvePost(postId: ObjectId) {
    this.postService.updatePost(postId, 'status', 'approved');
    this.postService.updatePost(postId, 'status_changed_at', new Date());
    const post = this.posts.find((post) => post._id === postId);
    if (post) {
      post.status = 'approved';
      post.status_changed_at = new Date();
    }
  }
  rejectPost(postId: ObjectId) {
    this.postService.updatePost(postId, 'status', 'rejected');
    this.postService.updatePost(postId, 'status_changed_at', new Date());
    const post = this.posts.find((post) => post._id === postId);
    if (post) {
      post.status = 'rejected';
      post.status_changed_at = new Date();
    }
  }

  editPost(postId: ObjectId) {
    this.router.navigate([`editPost/${postId}`]);
  }

  editStatus(postId: ObjectId) {
    const post = this.posts.find((post) => post._id === postId);

    if (post) {
      post.status = 'pending';
    }
    this.scrollDown();
  }

  deletePost(post: any) {
    this.postService.deletePost(post);
    this.loadPosts(this.communityId!);
  }

  openConfirmationModal(): void {
    this.confirmationModal.showModal();
  }

  onConfirmed(): void {
    // console.log('Confirmed action!');
  }

  scrollDown(): void {
    window.scrollBy({
      top: 500, // Adjust this value to scroll by the desired amount (in pixels)
      left: 0,
      behavior: 'smooth', // Smooth scrolling
    });
  }
}
