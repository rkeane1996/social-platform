import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

@Schema()
export class Users {
    @Prop({ type: String, unique: true })
    username;

    @Prop({ type: String, unique: true })
    email;

    @Prop({ type: String })
    password;

    @Prop({ type: String })
    name;

    @Prop({ type: String })
    bio;

    @Prop({ type: String })
    profile_picture;

    @Prop([{ user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } }])
    followers;

    @Prop([{ user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } }])
    following;
    
    @Prop([{ post_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' } }])
    posts;

    @Prop({ type: Date, default: Date.now })
    created_at;
}


export type UsersDocument = HydratedDocument<Users>;
export const UsersSchema = SchemaFactory.createForClass(Users);