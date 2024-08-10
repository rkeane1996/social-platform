import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

@Schema()
export class Posts {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Users' })
  user_id;

  @Prop({ type: String })
  caption;

  @Prop({ type: String })
  image_url;

  @Prop({ type: Date, default: Date.now })
  created_at;

  @Prop([{ like_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Likes' } }])
  likes;

  @Prop([
    { comment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Comments' } },
  ])
  comments;
}

export type PostsDocument = HydratedDocument<Posts>;
export const PostsSchema = SchemaFactory.createForClass(Posts);
