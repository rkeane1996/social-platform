import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

@Schema()
export class Posts {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user_id;

  @Prop({ type: String })
  caption;

  @Prop({ type: String })
  image_url;

  @Prop({ type: Date, default: Date.now })
  created_at;

  @Prop([{ user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } }])
  likes;

  @Prop([
    { comment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' } },
  ])
  comments;
}

export type PostsDocument = HydratedDocument<Posts>;
export const PostsSchema = SchemaFactory.createForClass(Posts);
