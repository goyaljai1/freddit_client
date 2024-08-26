import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { SearchbarComponent } from './shared/components/searchbar/searchbar.component';
import { SelfUserProfileComponent } from './core/self-user-profile/self-user-profile.component';
import { EditProfileComponent } from './core/edit-profile/edit-profile.component';
import { CreateCommunityComponent } from './core/community/create-community/create-community.component';
import { ViewCommunityComponent } from './core/community/view-community/view-community.component';
import { CommunitySettingComponent } from './core/community/community-setting/community-setting.component';
import { SidebarComponent } from './core/sidebar/sidebar.component';
import { CreatePostComponent } from './core/post/create-post/create-post.component';
import { ViewDetailedPostComponent } from './core/post/view-post/view-detailed-post/view-detailed-post.component';
import { ViewSharedCommentComponent } from './core/comment/view-shared-comment/view-shared-comment.component';
import { EditPostComponent } from './core/post/edit-post/edit-post.component';
import { HomePostsComponent } from './core/home/home-posts/home-posts.component';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { PopularPostsComponent } from './core/home/popular-posts/popular-posts.component';
import { editUserProfileGuard } from './gaurds/edit-user-profile.guard';
import { communityGuard } from './gaurds/community.guard';
import { editPostGuard } from './gaurds/edit-post.guard';
import { createPostCommunityGuard } from './gaurds/create-post-community.guard';

const routes: Routes = [
  { path: 'navbar', component: NavbarComponent },
  { path: 'searchbar', component: SearchbarComponent },
  {
    path: 'user/:id',
    component: SelfUserProfileComponent,
  },
  {
    path: 'user/:id/editProfile',
    component: EditProfileComponent,
    canActivate: [editUserProfileGuard],
  },
  {
    path: 'createCommunity',
    component: CreateCommunityComponent,
    canActivate: [createPostCommunityGuard],
  },
  {
    path: 'community/:id',
    component: ViewCommunityComponent,
  },
  {
    path: 'community/:id/settings',
    component: CommunitySettingComponent,
    canActivate: [communityGuard],
  },
  { path: 'sidebar', component: SidebarComponent },
  {
    path: 'createPost',
    component: CreatePostComponent,
    canActivate: [createPostCommunityGuard],
  },
  {
    path: 'post/:id',
    component: ViewDetailedPostComponent,
  },
  {
    path: 'comment/:id',
    component: ViewSharedCommentComponent,
  },
  {
    path: 'editPost/:id',
    component: EditPostComponent,
    canActivate: [editPostGuard],
  },
  { path: '', component: HomePostsComponent },
  { path: 'home', component: HomePostsComponent },
  { path: 'popular', component: PopularPostsComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
