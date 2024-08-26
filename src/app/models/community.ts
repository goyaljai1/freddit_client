import { ObjectId } from 'mongodb';

export class Community {
  _id?: ObjectId;
  community_name: string;
  display_name: string;
  members_ids: ObjectId[];
  description: string;
  topics: string[];
  guidelines: string[];
  banner_img_src: string;
  moderator_id: ObjectId;
  icon_img_src: string;
  members_count: number;
  community_type: string;
  post_ids: ObjectId[];

  constructor(
    _id: ObjectId,
    community_name: string,
    display_name: string,
    members_ids: ObjectId[],
    description: string,
    topics: string[],
    guidelines: string[],
    banner_img_src: string,
    icon_img_src: string,
    members_count: number,
    community_type: string,
    moderator_id: ObjectId,
    post_ids: ObjectId[]
  ) {
    this._id = _id;
    this.community_name = community_name;
    this.display_name = display_name;
    this.members_ids = members_ids;
    this.description = description;
    this.topics = topics;
    this.guidelines = guidelines;
    this.banner_img_src = banner_img_src;
    this.icon_img_src = icon_img_src;
    this.members_count = members_count;
    this.community_type = community_type;
    this.moderator_id = moderator_id;
    this.post_ids = post_ids;
  }
}
