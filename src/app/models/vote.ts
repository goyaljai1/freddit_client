import { ObjectId } from 'mongodb';

export class Vote {
  _id?: ObjectId;
  entity_id: ObjectId;
  status: 1 | -1 | 0;
  user_id: ObjectId;

  constructor(entity_id: ObjectId, status: 1 | -1 | 0, user_id: ObjectId) {
    this.entity_id = entity_id;
    this.status = status;
    this.user_id = user_id;
  }
}
