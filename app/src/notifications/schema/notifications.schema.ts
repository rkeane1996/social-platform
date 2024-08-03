import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

@Schema()
export class Notifications {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    user_id;
    @Prop({ type: String })
    type;
    @Prop({ type: String })
    message;
    @Prop({ type: Boolean, default: false })
    read;
    @Prop({ type: Date, default: Date.now })
    created_at;
}

export type NotificationsDocument = HydratedDocument<Notifications>;
export const NotificationsSchema = SchemaFactory.createForClass(Notifications);