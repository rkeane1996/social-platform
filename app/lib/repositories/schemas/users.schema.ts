import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';


@Schema({_id: false})
export class PostSubdocument {
  @Prop({ type: Types.ObjectId})
  post_id: string;
}

@Schema({_id: false})
export class UserSubdocument {
  @Prop({ type: Types.ObjectId})
  user_id: string;
}


@Schema()
export class Users {
  @Prop({ type: String, unique: true })
  username;

  @Prop({ type: String, unique: true, select: false })
  email;

  @Prop({ type: String, select: false })
  password;

  @Prop({ type: String })
  name;

  @Prop({ type: String })
  bio;

  @Prop({ type: String })
  profile_picture;

  @Prop([{ type: UserSubdocument, ref: 'Users' }])
  followers;

  @Prop([{ type: UserSubdocument, ref: 'Users' }])
  following;

  @Prop([{ type: PostSubdocument, ref: 'Posts' }])
  posts;

  @Prop({ type: Date, default: Date.now })
  created_at;
}

export type UsersDocument = HydratedDocument<Users>;
export const UsersSchema = SchemaFactory.createForClass(Users);