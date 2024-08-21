import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';


@Schema({_id: false})
export class LikeSubdocument {
  @Prop({ type: Types.ObjectId})
  like_id: string;
}

@Schema({_id: false})
export class CommentSubdocument {
  @Prop({ type: Types.ObjectId})
  comment_id: string;
}

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

  @Prop([{ type: LikeSubdocument, ref: 'Likes' }])
  likes;

  @Prop([
    { type: CommentSubdocument, ref: 'Comments' },
  ])
  comments;
}

export type PostsDocument = HydratedDocument<Posts>;
export const PostsSchema = SchemaFactory.createForClass(Posts);
