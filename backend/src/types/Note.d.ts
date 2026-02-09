export interface INote {
    _id?: string;
    title: string;
    tags: string[];
    content: string;
    lastEdited: Date;
    isArchived: boolean;
    color?: string;
    userId: string;
}
export interface NoteResponse {
    id: string;
    title: string;
    tags: string[];
    content: string;
    lastEdited: string;
    isArchived: boolean;
    color?: string;
    userId: string;
}
//# sourceMappingURL=Note.d.ts.map