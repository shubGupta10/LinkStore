import mongoose, {Schema, Document} from "mongoose";

export interface Link extends Document {
    linkName: String;
    actualLink: String;
    createdAt: Date;
    userId: String;
}


const LinkSchema: Schema<Link> = new mongoose.Schema({
    linkName: {
        type: String,
        required: [true, 'Link is required'],
    },
    actualLink: {
        type: String,
        required: [true, 'Link is required']
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    userId: {
        type: String,
        required: true
    }
    
})

const LinkModel = mongoose.models.Link || mongoose.model<Link>('Link', LinkSchema);


export default LinkModel