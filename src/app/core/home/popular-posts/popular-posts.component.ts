import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ConfirmationModalComponent } from '../../../shared/components/confirmation-modal/confirmation-modal.component';
import { ObjectId } from 'mongodb';
import { PostService } from '../../../shared/services/post.service';
import { UserService } from '../../../shared/services/user.service';
import { HelperService } from '../../../shared/services/utils/helper.service';
import { AuthService } from '../../../shared/services/utils/auth.service';
import { CommunityService } from '../../../shared/services/community.service';
import { map, Observable } from 'rxjs';
import { User } from '../../../models/user';

@Component({
  selector: 'app-popular-posts',
  templateUrl: './popular-posts.component.html',
  styleUrl:
    '../../post/view-post/view-communiy-post/view-communiy-post.component.scss',
})
export class PopularPostsComponent implements OnInit {
  posts: any[] = [];
  userId!: ObjectId;
  popularCommunites!: any[];
  @ViewChild('confirmationModal')
  confirmationModal!: ConfirmationModalComponent;
  page: number = 0;
  limit: number = 5;
  loading: boolean = false;

  constructor(
    public postService: PostService,
    public userService: UserService,
    public helperService: HelperService,
    private authService: AuthService,
    public communityService: CommunityService
  ) {
    this.loadPosts();
  }
  ngOnInit(): void {
    this.getPopularCommunities();
    this.authService.getUserId().subscribe((userId) => {
      this.userId = userId!;
    });
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight &&
      !this.loading
    ) {
      this.loadPosts();
    }
  }

  getPopularCommunities() {
    this.communityService.getPopularCommunities().subscribe((communities) => {
      this.popularCommunites = communities;
      // console.log(communities);
    });
  }

  loadPosts(): void {
    this.loading = true;
    const skip = this.page * this.limit;

    this.postService
      .getHomePagePosts(this.limit, skip, 'popularity')
      .subscribe((posts) => {
        this.posts = [...this.posts, ...posts];
        this.page++;
        this.loading = false;
      });
  }
  saveUnsavePost(postId: ObjectId, userId: ObjectId, action: 'push' | 'pop') {
    if (this.userId) {
      this.postService.saveUnsavePost(postId, userId, action);
      this.checkSavedPosts();
    } else {
      this.authService.openModal();
    }
  }
  checkSavedPosts(): void {
    this.posts.forEach((post) => {
      this.isSavedPost(post._id).subscribe((isSaved: any) => {
        post.isSaved = isSaved;
      });
    });
  }
  isSavedPost(postId: ObjectId): Observable<boolean> {
    return this.helperService
      .getDocumentById<User>('User', this.userId)
      .pipe(map((data: User) => data.saved_post_ids.includes(postId)));
  }

  deletePost(post: any) {
    this.postService.deletePost(post);
    this.loadPosts();
  }

  openConfirmationModal(): void {
    this.confirmationModal.showModal();
  }
}
