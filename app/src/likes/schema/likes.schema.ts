import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

@Schema()
export class Likes {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Users' })
  user_id;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Posts' })
  post_id;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Comments' })
  comment_id;

  @Prop({ type: Date, default: Date.now })
  created_at;
}

export type LikesDocument = HydratedDocument<Likes>;
export const LikesSchema = SchemaFactory.createForClass(Likes);
