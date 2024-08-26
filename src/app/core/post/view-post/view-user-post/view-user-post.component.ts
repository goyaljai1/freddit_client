import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ObjectId } from 'mongodb';
import { PostService } from '../../../../shared/services/post.service';
import { UserService } from '../../../../shared/services/user.service';
import { HelperService } from '../../../../shared/services/utils/helper.service';
import { AuthService } from '../../../../shared/services/utils/auth.service';
import { forkJoin, map, Observable, Subscription } from 'rxjs';
import { User } from '../../../../models/user';
import { Router } from '@angular/router';
import { CommunityService } from '../../../../shared/services/community.service';
import { ConfirmationModalComponent } from '../../../../shared/components/confirmation-modal/confirmation-modal.component';
import { VoteService } from '../../../../shared/services/utils/vote.service';

@Component({
  selector: 'app-view-user-post',
  templateUrl: './view-user-post.component.html',
  styleUrl: '../view-communiy-post/view-communiy-post.component.scss',
})
export class ViewUserPostComponent implements OnInit, OnChanges {
  @Input() userId!: ObjectId;
  @Input() isSelfProfile!: boolean;
  @Input() showSavedPost!: boolean;
  @Input() savedPostIds!: ObjectId[];

  @Input() sortPost!: EventEmitter<string>;
  private eventSubscription!: Subscription;

  posts!: any[];
  creators!: Object[];
  isFullscreen = false;
  fullScreenImgSrc!: string;
  isPostSaved: boolean | undefined;
  sortPostMethod: string = 'New';
  showSavedPosts: boolean = false;
  @ViewChild('confirmationModal')
  confirmationModal!: ConfirmationModalComponent;

  constructor(
    public postService: PostService,
    private router: Router,
    public userService: UserService,
    public helperService: HelperService,
    public communityService: CommunityService,
    private voteService: VoteService
  ) {}

  ngOnInit(): void {
    if (this.userId && !this.showSavedPost) {
      this.loadPosts(this.userId);
    }
    if (this.userId && this.showSavedPost) {
      this.isSavedPosts();
    }
    this.eventSubscription = this.sortPost.subscribe((data: string) => {
      this.sortPostMethod = data;
      this.sortPosts();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userId'] && !changes['userId'].isFirstChange()) {
      this.loadPosts(this.userId);
    }
  }

  ngOnDestroy(): void {
    if (this.eventSubscription) {
      this.eventSubscription.unsubscribe();
    }
  }

  loadPosts(userId: ObjectId): void {
    this.postService.getPostsByUser(userId).subscribe(
      (posts) => {
        this.posts = posts;
        const totalVoteCount = this.posts.reduce(
          (sum, post) => sum + post.vote_count,
          0
        );
        this.voteService.setPostKarma(totalVoteCount);
        this.sortPosts(); // Ensure posts are sorted after loading
        this.checkSavedPosts();
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
      // console.log(this.posts);
    }
  }

  checkSavedPosts(): void {
    this.posts.forEach((post) => {
      this.isSavedPost(post._id).subscribe((isSaved: any) => {
        post.isSaved = isSaved; // Add a property `isSaved` to the post object
      });
    });
  }

  isSavedPost(postId: ObjectId): Observable<boolean> {
    return this.helperService
      .getDocumentById<User>('User', this.userId)
      .pipe(map((data: User) => data.saved_post_ids.includes(postId)));
  }

  saveUnsavePost(postId: ObjectId, userId: ObjectId, action: 'push' | 'pop') {
    this.postService.saveUnsavePost(postId, userId, action);
    this.checkSavedPosts();
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
  }
  rejectPost(postId: ObjectId) {
    this.postService.updatePost(postId, 'status', 'rejected');
    this.postService.updatePost(postId, 'status_changed_at', new Date());
  }

  editPost(postId: ObjectId) {
    this.router.navigate([`editPost/${postId}`]);
  }

  deletePost(post: any) {
    this.postService.deletePost(post);
    this.loadPosts(this.userId!);
  }

  openConfirmationModal(): void {
    this.confirmationModal.showModal();
  }

  isSavedPosts() {
    const savedPostsObservables = this.savedPostIds.map((postId) => {
      return this.helperService.getDocumentById('Post', postId);
    });
    forkJoin(savedPostsObservables).subscribe((savedPosts) => {
      this.posts = savedPosts;
    });
  }
}
