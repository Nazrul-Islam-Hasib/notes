import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../index';
import { Note } from '../models/Note';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Note.deleteMany({});
});

describe('Note Controller', () => {
  const userId = new mongoose.Types.ObjectId().toString();
  const noteData = {
    title: 'Test Note',
    content: 'Test content',
    tags: ['test'],
    userId: userId,
  };

  describe('POST /api/notes', () => {
    it('should create a new note successfully', async () => {
      const response = await request(app)
        .post('/api/notes')
        .send(noteData);

      expect(response.status).toBe(201);
      expect(response.body.title).toBe(noteData.title);
      expect(response.body.content).toBe(noteData.content);
      expect(response.body.userId).toBe(userId);
      expect(response.body).toHaveProperty('id');
    });

    it('should fail if title is missing', async () => {
      const { title, ...rest } = noteData;
      const response = await request(app)
        .post('/api/notes')
        .send(rest);

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/notes/user/:userId', () => {
    it('should get all notes for a user', async () => {
      await Note.create(noteData);
      await Note.create({ ...noteData, title: 'Another Note' });

      const response = await request(app).get(`/api/notes/user/${userId}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(response.body[0].userId).toBe(userId);
    });
  });

  describe('GET /api/notes/:id', () => {
    it('should get a single note by id', async () => {
      const createdNote = await Note.create(noteData);
      const response = await request(app).get(`/api/notes/${createdNote._id}`);

      expect(response.status).toBe(200);
      expect(response.body.title).toBe(noteData.title);
    });

    it('should return 404 if note not found', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app).get(`/api/notes/${fakeId}`);

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/notes/:id', () => {
    it('should update a note', async () => {
      const createdNote = await Note.create(noteData);
      const updatedTitle = 'Updated Title';

      const response = await request(app)
        .put(`/api/notes/${createdNote._id}`)
        .send({ title: updatedTitle });

      expect(response.status).toBe(200);
      expect(response.body.title).toBe(updatedTitle);
    });
  });

  describe('DELETE /api/notes/:id', () => {
    it('should delete a note', async () => {
      const createdNote = await Note.create(noteData);
      const response = await request(app).delete(`/api/notes/${createdNote._id}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Note deleted successfully');

      const note = await Note.findById(createdNote._id);
      expect(note).toBeNull();
    });
  });
});
