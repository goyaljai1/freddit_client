import { ObjectId } from 'mongodb';

export class Post {
  _id?: ObjectId;
  creator_id: ObjectId;
  community_id: ObjectId;
  category: string;
  title: string;
  text?: string;
  img_src?: string; // Optional
  vid_src?: string; // Optional
  status: string;
  vote_count: number;
  comment_count: number;
  time_of_posting: Date;
  parent_comment_ids: ObjectId[];
  status_changed_at?: Date;
  is_deleted?: boolean;

  constructor(
    creator_id: ObjectId,
    community_id: ObjectId,
    category: string,
    title: string,
    status: string,
    vote_count: number,
    comment_count: number,
    time_of_posting: Date,
    parent_comment_ids: ObjectId[],
    _id?: ObjectId,
    text?: string,
    img_src?: string,
    vid_src?: string,
    status_changed_at?: Date,
    is_deleted?: boolean
  ) {
    this._id = _id;
    this.creator_id = creator_id;
    this.community_id = community_id;
    this.category = category;
    this.title = title;
    this.text = text;
    this.img_src = img_src;
    this.vid_src = vid_src;
    this.status = status;
    this.vote_count = vote_count;
    this.comment_count = comment_count;
    this.time_of_posting = time_of_posting;
    this.parent_comment_ids = parent_comment_ids;
    this.status_changed_at = status_changed_at;
    this.is_deleted = is_deleted;
  }
}
