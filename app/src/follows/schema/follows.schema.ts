import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

@Schema()
export class Follows {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    follower_id;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    following_id;
    
    @Prop({ type: Date, default: Date.now })
    created_at;
}


export type FollowsDocument = HydratedDocument<Follows>;
export const FollowsSchema = SchemaFactory.createForClass(Follows);