import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

@Schema()
export class Comments {
  @Prop({ type: String, unique: true })
  username;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post' })
  post_id;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user_id;

  @Prop({ tyep: String })
  text;

  @Prop({ type: Date, default: Date.now })
  created_at;

  @Prop([{ user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } }])
  likes;
}

export type CommentsDocument = HydratedDocument<Comments>;
export const CommentsSchema = SchemaFactory.createForClass(Comments);
