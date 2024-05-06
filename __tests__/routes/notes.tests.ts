import request from "supertest";
import app from "../../src/app";
import { Note, NotesRaw } from "../../src/types/notes";
import { getNotes, getNoteById, addNote, updateNote, deleteNoteById } from '../../src/services/data';

// Prepare mock data
const mockNotes: Note[] = [
    { id: 1, title: "Test Note1", content: "Note for TestUser1", user: "TestUser1" },
    { id: 2, title: "Test Note2", content: "Note for TestUser2", user: "TestUser2" },
    { id: 3, title: "Test Note3", content: "Another Note for TestUser1", user: "TestUser1" }
  ];

const authenticatedUser: string = "TestUser1";

// Mock service functions
jest.mock('../../src/services/data', () => ({
    getNotes: jest.fn(() => mockNotes),
    getNoteById: jest.fn(id => mockNotes.find(note => note.id === id)),
    addNote: jest.fn(),
    updateNote: jest.fn(),
    deleteNoteById: jest.fn()
}));


describe("Notes routes, authenticated user", () => {


    test("GET /notes - retrieve all notes for authenticated user", async () => {  
        
        const res = await request(app)
            .get("/notes")
            .set('Authorization', authenticatedUser)
            .expect(200);
   
        expect(res.body).toEqual(mockNotes.filter(note => note.user === authenticatedUser));
        expect(getNotes).toHaveBeenCalled();
    });

    test("GET /notes/:id - retrieve a note by ID", async () => {
        const noteId = 1;
        const res = await request(app)
            .get(`/notes/${noteId}`)
            .set('Authorization', authenticatedUser)
            .expect(200);
    
        expect(res.body).toEqual(mockNotes.find(note => note.id === noteId));
        expect(getNoteById).toHaveBeenCalledWith(noteId);
    });

    test("POST /notes - add a new note", async () => {
        const newNote = { title: 'New Note', content: 'Content for new note', user: authenticatedUser };

        const res = await request(app)
            .post("/notes")
            .send(newNote)
            .set('Authorization', authenticatedUser)
            .expect(204); 
        
        expect(addNote).toHaveBeenCalledWith(newNote.title, newNote.content, newNote.user);
    });

    test("PUT /notes/:id - update a note", async () => {
        const updatedNote = { id: 1, title: 'Updated Note', content: 'Updated content', user: authenticatedUser };

        const res = await request(app)
            .put(`/notes/${updatedNote.id}`)
            .send(updatedNote)
            .set('Authorization', authenticatedUser)
            .expect(204);

        expect(updateNote).toHaveBeenCalledWith(updatedNote.id, updatedNote.title, updatedNote.content, updatedNote.user);
    });

    test("PATCH /notes/:id - partially update a note", async () => {
        const partialUpdate = { title: 'Partially Updated Note' };
        const noteToUpdate = mockNotes[1];
        const noteId = 2;
        const authUser = noteToUpdate.user;
        const oldContent = noteToUpdate.content;

        const res = await request(app)
            .patch(`/notes/${noteId}`)
            .send(partialUpdate)
            .set('Authorization', authUser)
            .expect(204);

        expect(updateNote).toHaveBeenCalledWith(noteId, partialUpdate.title, oldContent, authUser);
    });

    test("DELETE /notes/:id - delete a note", async () => {
        const noteId = 1;

        const res = await request(app)
            .delete(`/notes/${noteId}`)
            .set('Authorization', authenticatedUser)
            .expect(204);

        expect(deleteNoteById).toHaveBeenCalledWith(noteId);
    });
});