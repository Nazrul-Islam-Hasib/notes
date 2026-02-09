import mongoose, { Document } from 'mongoose';
export interface INoteDocument extends Document {
    title: string;
    tags: string[];
    content: string;
    lastEdited: Date;
    isArchived: boolean;
    color?: string;
    userId: string;
}
export declare const Note: mongoose.Model<INoteDocument, {}, {}, {}, mongoose.Document<unknown, {}, INoteDocument, {}, mongoose.DefaultSchemaOptions> & INoteDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, INoteDocument>;
//# sourceMappingURL=Note.d.ts.map