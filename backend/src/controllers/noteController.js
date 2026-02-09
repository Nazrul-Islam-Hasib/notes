"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleArchive = exports.deleteNote = exports.updateNote = exports.createNote = exports.getNoteById = exports.getNotes = void 0;
const express_1 = require("express");
const Note_1 = require("../models/Note");
const formatDate = (date) => {
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};
const formatNoteResponse = (note) => ({
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
const getNotes = async (req, res) => {
    try {
        const userId = req.params.userId;
        const notes = await Note_1.Note.find({ userId }).sort({ lastEdited: -1 });
        res.json(notes.map(formatNoteResponse));
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching notes', error });
    }
};
exports.getNotes = getNotes;
// Get a single note
const getNoteById = async (req, res) => {
    try {
        const note = await Note_1.Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.json(formatNoteResponse(note));
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching note', error });
    }
};
exports.getNoteById = getNoteById;
// Create a new note
const createNote = async (req, res) => {
    try {
        const { title, tags, content, isArchived, color, userId } = req.body;
        const note = new Note_1.Note({
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
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating note', error });
    }
};
exports.createNote = createNote;
// Update a note
const updateNote = async (req, res) => {
    try {
        const { title, tags, content, isArchived, color } = req.body;
        const note = await Note_1.Note.findByIdAndUpdate(req.params.id, {
            title,
            tags,
            content,
            isArchived,
            color,
            lastEdited: new Date()
        }, { new: true });
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.json(formatNoteResponse(note));
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating note', error });
    }
};
exports.updateNote = updateNote;
// Delete a note
const deleteNote = async (req, res) => {
    try {
        const note = await Note_1.Note.findByIdAndDelete(req.params.id);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.json({ message: 'Note deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting note', error });
    }
};
exports.deleteNote = deleteNote;
// Archive/Unarchive a note
const toggleArchive = async (req, res) => {
    try {
        const note = await Note_1.Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        note.isArchived = !note.isArchived;
        note.lastEdited = new Date();
        const updatedNote = await note.save();
        res.json(formatNoteResponse(updatedNote));
    }
    catch (error) {
        res.status(500).json({ message: 'Error toggling archive', error });
    }
};
exports.toggleArchive = toggleArchive;
//# sourceMappingURL=noteController.js.map