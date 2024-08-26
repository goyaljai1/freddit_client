import { ObjectId } from 'mongodb';

export class User {
  username: string;
  email: string;
  password: Password;
  selected_interests: string[];
  display_name: string;
  profile_picture_src: string;
  cake_day: string;
  about_description: string;
  community_ids: ObjectId[];
  _id?: ObjectId;
  joined_communities: ObjectId[];
  created_post_ids: ObjectId[];
  saved_post_ids: ObjectId[];

  constructor(
    username: string,
    email: string,
    password: Password,
    selected_interests: string[],
    display_name: string,
    profile_picture_src: string,
    cake_day: string,
    about_description: string,
    community_ids: ObjectId[],
    _id: ObjectId,
    joined_communities: ObjectId[],
    created_post_ids: ObjectId[],
    saved_post_ids: ObjectId[]
  ) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.selected_interests = selected_interests;
    this.display_name = display_name;
    this.profile_picture_src = profile_picture_src;
    this.cake_day = cake_day;
    this.about_description = about_description;
    this.community_ids = community_ids;
    this._id = _id;
    this.joined_communities = joined_communities;
    this.created_post_ids = created_post_ids;
    this.saved_post_ids = saved_post_ids;
  }
}

class Password {
  iv: string;
  encrypted_data: string;

  constructor(iv: string, encrypted_data: string) {
    this.iv = iv;
    this.encrypted_data = encrypted_data;
  }
}
