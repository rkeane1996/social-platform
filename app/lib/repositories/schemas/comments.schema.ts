import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

@Schema()
export class Comments {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Posts' })
  post_id;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Users' })
  user_id;

  @Prop({ type: String })
  text;

  @Prop({ type: Date, default: Date.now })
  created_at;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Likes' }])
  likes;
}

export type CommentsDocument = HydratedDocument<Comments>;
export const CommentsSchema = SchemaFactory.createForClass(Comments);
