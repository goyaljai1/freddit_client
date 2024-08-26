import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
  withHttpTransferCacheOptions,
} from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpErrorResponse } from '@angular/common/http';
import { InterceptorService } from './shared/services/utils/interceptor.service';
import { LocalStorageService } from './shared/services/utils/local-storage.service';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { SearchbarComponent } from './shared/components/searchbar/searchbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './shared/components/login/login.component';
import { SignupComponent } from './shared/components/signup/signup.component';
import { core } from '@angular/compiler';
import { SelfUserProfileComponent } from './core/self-user-profile/self-user-profile.component';
import { ContentComponent } from './core/content/content.component';
import { SidebarComponent } from './core/sidebar/sidebar.component';
import { EditProfileComponent } from './core/edit-profile/edit-profile.component';
import { CreateCommunityComponent } from './core/community/create-community/create-community.component';
import { ViewCommunityComponent } from './core/community/view-community/view-community.component';
import { CommunitySettingComponent } from './core/community/community-setting/community-setting.component';
import { CreatePostComponent } from './core/post/create-post/create-post.component';
import { QuillModule } from 'ngx-quill';
import { ViewCommuniyPostComponent } from './core/post/view-post/view-communiy-post/view-communiy-post.component';
import { ViewDetailedPostComponent } from './core/post/view-post/view-detailed-post/view-detailed-post.component';
import { CommunityInfoCardComponent } from './core/community/community-info-card/community-info-card.component';
import { CreateCommentComponent } from './core/comment/create-comment/create-comment.component';
import { ViewCommentComponent } from './core/comment/view-comment/view-comment.component';
import { CreateReplyComponent } from './core/comment/create-reply/create-reply.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VoteComponent } from './shared/components/vote/vote.component';
import { ViewSharedCommentComponent } from './core/comment/view-shared-comment/view-shared-comment.component';
import { EditPostComponent } from './core/post/edit-post/edit-post.component';
import { EditCommentComponent } from './core/comment/edit-comment/edit-comment.component';
import { ViewUserPostComponent } from './core/post/view-post/view-user-post/view-user-post.component';
import { ViewUserCommentComponent } from './core/comment/view-user-comment/view-user-comment.component';
import { ConfirmationModalComponent } from './shared/components/confirmation-modal/confirmation-modal.component';
import { ModActionComponent } from './core/community/mod-action/mod-action.component';
import { PostTemplateComponent } from './shared/components/post-template/post-template.component';
import { PostUserInfoComponent } from './shared/components/post-user-info/post-user-info.component';
import { HomePostsComponent } from './core/home/home-posts/home-posts.component';
import { TruncatePipe } from './pipes/truncate.pipe';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { PopularPostsComponent } from './core/home/popular-posts/popular-posts.component';
import { LowResolutionWrapperComponent } from './shared/components/low-resolution-wrapper/low-resolution-wrapper.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SearchbarComponent,
    LoginComponent,
    SignupComponent,
    SelfUserProfileComponent,
    ContentComponent,
    SidebarComponent,
    EditProfileComponent,
    CreateCommunityComponent,
    ViewCommunityComponent,
    CommunitySettingComponent,
    CreatePostComponent,
    ViewCommuniyPostComponent,
    ViewDetailedPostComponent,
    CommunityInfoCardComponent,
    CreateCommentComponent,
    ViewCommentComponent,
    CreateReplyComponent,
    VoteComponent,
    ViewSharedCommentComponent,
    EditPostComponent,
    EditCommentComponent,
    ViewUserPostComponent,
    ViewUserCommentComponent,
    ConfirmationModalComponent,
    ModActionComponent,
    PostTemplateComponent,
    PostUserInfoComponent,
    HomePostsComponent,
    TruncatePipe,
    PageNotFoundComponent,
    PopularPostsComponent,
    LowResolutionWrapperComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    QuillModule.forRoot(),
    ReactiveFormsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true,
    },
    LocalStorageService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
