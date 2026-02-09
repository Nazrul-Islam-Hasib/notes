import { Request, Response } from 'express';
import { Note } from '../models/Note';

const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

const formatNoteResponse = (note: any) => ({
    id: note._id.toString(),
    title: note.title,
    tags: note.tags,
    content: note.content,
    lastEdited: formatDate(note.lastEdited),
    isArchived: note.isArchived,
    color: note.color,
    userId: note.userId
});

// Get all notes for a user
export const getNotes = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const notes = await Note.find({ userId }).sort({ lastEdited: -1 });

        res.json(notes.map(formatNoteResponse));
    } catch (error: any) {
        console.error('Fetch notes failed:', error);
        res.status(500).json({
            message: 'Failed to fetch notes'
        });
    }
};


// Get a single note
export const getNoteById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'Note ID is required' });
        }

        const note = await Note.findById(id);

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        res.json(formatNoteResponse(note));
    } catch (error: any) {
        console.error('Fetch note failed:', error);
        res.status(500).json({
            message: 'Failed to fetch note'
        });
    }
};


// Create a new note
export const createNote = async (req: Request, res: Response) => {
    try {
        const { title, tags, content, isArchived, color, userId } = req.body;
        const note = new Note({
            title,
            tags: tags || [],
            content,
            lastEdited: new Date(),
            isArchived: isArchived || false,
            color,
            userId
        });
        const savedNote = await note.save();

        res.status(201).json(formatNoteResponse(savedNote));
    } catch (error: any) {
        console.error('Create Node failed:', error);
        res.status(400).json({
            message: error.message,
            errors: error.errors
        });
    }
};

// Update a note
export const updateNote = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'Note ID is required' });
        }

        const updates = {
            ...req.body,
            lastEdited: new Date()
        };

        const note = await Note.findByIdAndUpdate(
            id,
            updates,
            {
                new: true,
                runValidators: true
            }
        );

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        res.json(formatNoteResponse(note));
    } catch (error: any) {
        console.error('Update note failed:', error);

        res.status(400).json({
            message: error.message,
            errors: error.errors
        });
    }
};


// Delete a note
export const deleteNote = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'Note ID is required' });
        }

        const note = await Note.findByIdAndDelete(id);

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        res.json({ message: 'Note deleted successfully' });
    } catch (error: any) {
        console.error('Delete note failed:', error);
        res.status(500).json({
            message: 'Failed to delete note'
        });
    }
};


// Archive/Unarchive a note
export const toggleArchive = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'Note ID is required' });
        }

        const note = await Note.findById(id);

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        note.isArchived = !note.isArchived;
        note.lastEdited = new Date();

        const updatedNote = await note.save();
        res.json(formatNoteResponse(updatedNote));
    } catch (error: any) {
        console.error('Toggle archive failed:', error);
        res.status(500).json({
            message: 'Failed to toggle archive'
        });
    }
};
