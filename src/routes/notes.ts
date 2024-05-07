import { Request, Response, Router } from 'express'
import { getNotes, getNoteById, addNote, updateNote, deleteNoteById } from '../services/data'
import { Note, NotesRaw } from '../types/notes'
import { hasAuthentication } from '../middleware/auth'
import { RequestBody } from '../types/requestBody'
import * as fs from 'fs';

export const notesRouter = Router()
function getNotesByUser(authorizedUser: string): Note[] {
  // Hier implementiere die Logik zum Abrufen der Notizen des autorisierten Benutzers
  // Beispiel: Lies die Notizen aus der Datenbank oder einer Datei basierend auf dem autorisierten Benutzer
  // Annahme: Die Notizen werden aus einer JSON-Datei mit dem Namen 'notes.json' gelesen
  const notesRaw = fs.readFileSync('data/notes.json', 'utf8');
  const notesData = JSON.parse(notesRaw) as NotesRaw;
  const userNotes = notesData.notes.filter(note => note.user === authorizedUser);
  return userNotes;
};



/**
 * @route POST /notes - Endpoint to add a new note.
 * @middleware hasAuthentication - The method requires authentication.
 * @description Creates a new note with the given title, content, and user from the request body.
 * @param {Request} req - The reuqest object containing title, content, and user.
 * @param {Response} res - The response object.
 * @returns {void} Responds with a HTTP 204 No Content status upon successful addition of the note.
 */
notesRouter.post('/', hasAuthentication, (req: Request, res: Response) => {
  const authorizedUser = req.headers.authorization!

  const {title, content, user, categories}: RequestBody = req.body
  
  if (authorizedUser !== user) {
    res.status(403).send('Forbidden')

  } else {
   const newNote = addNote(title, content, user, categories)
   res.status(201).send('Die Notiz wurde erfolgreich erstellt.\n' + JSON.stringify(newNote))
  }

  
});

/**
 * @route GET /notes - Endpoint to retrieve notes belonging to the authenticated user.
 * @middleware hasAuthentication - The method requires authentication.
 * @description Retrieves notes belonging to the authenticated user.
 * @param {Request} req - The request object containing the authorization header.
 * @param {Response} res - The response object containing notes belonging to the user.
 * @returns {void} - Responds with a HTTP 200 OK status and an array of notes belonging to the user.
 */
notesRouter.get('/', hasAuthentication, (req: Request, res: Response) => {
  const authorizedUser = req.headers.authorization!; // Extrahiert den autorisierten Benutzer aus dem Anforderungskopf

  const userNotes = getNotesByUser(authorizedUser); // Ruft die Notizen für den autorisierten Benutzer ab
  
  res.status(200).json(userNotes); // Sendet die abgerufenen Notizen als JSON-Antwort zurück
});


/**
 * @route GET /notes/:id - Endpoint to retrieve a specific note by ID associated with the authenticated user.
 * @middleware hasAuthentication - The method requires authentication.
 * @description Retrieves a note by its ID belonging to the authenticated user.
 * @param {Request} req - The request object containing the note ID as a parameter.
 * @param {Response} res - The response object.
 * @return {void} Responds with a HTTP 200 OK status and the requested note if found, 
 * or a HTTP 404 Not Found if the note doesn't exist.
 */
notesRouter.get('/:id', hasAuthentication, (req: Request, res: Response) => {

  const id: number = parseInt(req.params.id)
  const note: Note | undefined = getNoteById(id)

  if (note === undefined) {
    res.status(404).send(`Die Notiz mit ID ${id} wurde nicht gefunden.`)
  } else {
    res.status(200).send(note)
  }
});

/**
 * @route PUT /notes/:id - Endpoint to update a note by ID.
 * @middleware hasAuthentication - Requires authentication for access.
 * @description Updates a note with the specified ID, replacing its title, content, and user.
 * @param {Request} req - The request object containing the updated note details in the request body 
 * and the note ID in the route parameters.
 * @param {Response} res - The response object.
 * @returns {void} Responds with an HTTP 204 No Content status upon successful note creation. 
 * If the note does not exist, returns HTTP 404 Not Found.
 */
notesRouter.put('/:id', hasAuthentication, (req: Request, res: Response) => { 

  const {title, content, user, categories}: RequestBody = req.body;
  const authorizedUser = req.headers.authorization!;
  const noteId = parseInt(req.params.id);
  const noteToUpdate = getNoteById(noteId);
  

  if (!noteToUpdate || noteToUpdate.user !== authorizedUser) {
    res.status(403).send('Forbidden');
  } else {
    updateNote(noteId, title, content, user, categories); // Funktion zum Aktualisieren der Notiz
    res.status(200).send('Die Notiz wurde erfolgreich aktualisiert.');
  }
});

/**
 * @route PATCH /notes/:id - Endpoint to partially update a note by ID.
 * @middleware hasAuthentication - Requires authentication for access.
 * @description Partially updates a note with the specified ID, allowing modifications to its title, content, or user.
 * @param {Request} req - The request object containing the updated note details in the request body 
 * and the note ID in the route parameters.
 * @param {Response} res - The response object.
 * @returns {void} If the note does not exist, returns HTTP 404 Not Found. Otherwise, returns HTTP 204 No Content on successful update.
 */
notesRouter.patch('/:id', hasAuthentication, (req: Request, res: Response) => {

  const id: number = parseInt(req.params.id)
  const oldNote: Note | undefined = getNoteById(id)

  if (oldNote === undefined) {
    res.status(404).send(`Die Notiz mit ID ${id} wurde nicht gefunden.`)
    return
  }

  const title: string = req.body.title ?? oldNote.title
  const content: string = req.body.content ?? oldNote.content
  const user: string = req.body.user ?? oldNote.user
  const categories: string[] = req.body.categories ?? oldNote.categories

  updateNote(id, title, content, user, categories)

  res.status(204).send()
 });

/**
 * @route DELETE /notes/:id
 * @middleware hasAuthentication
 * @description Deletes a note by ID provided as a route parameter.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {void} If the note does not exist, returns HTTP 404 Not Found. Otherwise, returns HTTP 204 No Content on successful deletion.
 */
notesRouter.delete('/:id', hasAuthentication, (req: Request, res: Response) => { 
  const authorizedUser = req.headers.authorization!;

  const noteId = parseInt(req.params.id);
  const noteToDelete = getNoteById(noteId);
  
  if (!noteToDelete) {
    res.status(404).send('Notiz nicht gefunden.');
  } else if (authorizedUser !== noteToDelete.user) {
    res.status(403).send('Forbidden');
  } else {
    deleteNoteById(noteId); // Funktion zum Löschen der Notiz
    res.status(200).send('Die Notiz wurde erfolgreich gelöscht.');
  }
});



