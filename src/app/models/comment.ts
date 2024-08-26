import { ObjectId } from 'mongodb';
import { User } from './user';

export class Comment {
  _id?: ObjectId;
  post_id: ObjectId;
  parent_comment_id?: ObjectId; // Made optional as the top-level comments might not have a parent
  child_comment_id: ObjectId[] = [];
  comment_text_body: string;
  vote_count: number;
  user_id: ObjectId;
  level: number;
  timestamp?: Date;
  updatedAt?: Date;
  is_deleted?: boolean;

  constructor(
    post_id: ObjectId,
    comment_text_body: string,
    user_id: ObjectId,
    level: number,
    vote_count: number,
    parent_comment_id?: ObjectId,
    _id?: ObjectId,
    child_comment_id?: ObjectId[],
    timestamp?: Date,
    updatedAt?: Date,
    is_deleted?: boolean
  ) {
    this._id = _id;
    this.post_id = post_id;
    this.parent_comment_id = parent_comment_id;
    this.child_comment_id = child_comment_id || [];
    this.comment_text_body = comment_text_body;
    this.vote_count = vote_count;
    this.user_id = user_id;
    this.timestamp = timestamp || new Date();
    this.level = level;
    this.is_deleted = is_deleted;
    this.updatedAt = updatedAt;
  }
}
