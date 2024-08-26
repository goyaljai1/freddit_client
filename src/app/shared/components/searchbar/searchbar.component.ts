import { Component, OnInit } from '@angular/core';
import { ObjectId } from 'mongodb';
import { Community } from '../../../models/community';
import { HelperService } from '../../services/utils/helper.service';
import { User } from '../../../models/user';
import { UserService } from '../../services/user.service';
import { CommunityService } from '../../services/community.service';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrl: './searchbar.component.scss',
})
export class SearchbarComponent implements OnInit {
  searchTerm: string = '';
  filteredCommunity: any[] = [];
  filteredUsers: any[] = [];
  allCommunities!: any[];
  allUsers!: any[];
  selectedId: ObjectId | null = null;
  selectedCommunity!: Community;
  selectedUser!: User;

  constructor(
    private helperService: HelperService,
    public userService: UserService,
    public communityService: CommunityService
  ) {}

  ngOnInit(): void {
    // Fetch communities
  }

  beginSearch() {
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
          console.error('Error retrieving communities:', error);
        }
      );

    // Fetch users
    this.helperService
      .getAllDocumentsWithFieldNames('User', [
        '_id',
        'username',
        'profile_picture_src',
      ])
      .subscribe(
        (data) => {
          this.allUsers = data;
          // console.log(this.allUsers, 'all users');
        },
        (error) => {
          console.error('Error retrieving users:', error);
        }
      );
  }

  filterResults() {
    if (this.searchTerm.length != 0) {
      this.filteredCommunity = this.allCommunities.filter((community) =>
        community.community_name
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase())
      );
      this.filteredUsers = this.allUsers.filter((user) =>
        user.username.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  selectCommunity(community: any) {
    this.selectedId = community._id;
    this.selectedCommunity = community;
  }

  displayUser(userId: ObjectId) {
    this.userService.displayUser(userId);
    this.onSubmit();
  }

  displayCommunity(communityId: ObjectId) {
    this.communityService.displayCommunity(communityId);
    this.onSubmit();
  }

  onSubmit() {
    this.searchTerm = '';
  }
}
