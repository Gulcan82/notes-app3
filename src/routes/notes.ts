import { Request, Response, Router } from 'express'
import { getNotes, getNoteById, addNote, updateNote, deleteNoteById } from '../services/data'
import { Note } from '../types/notes'
import {hasAuthentication } from '../middleware/auth'


export const notesRouter = Router()
/**
 * @route POST /notes - Endpoint to add a new note. 
 * @middleware hasAuthentication - The method requires authentication.
 * @description Creates a new note with the given title, content, and user from the request body.
 * @param {Request} req - The request object containing title, content, and user.
 * @param {Response} res - The resonse object.
 * @return {void} Responds with a HTTP 204 No Content status upon successful addition of the note.
 *   - title: string - The title of the note.
 *   - content: string - The content of the note.
 *   - user: string - The user associated with the note.
 */
notesRouter.post('/', hasAuthentication, (req: Request, res: Response) => {
  
  const title: string = req.body.title
  const content: string = req.body.content
  const user: string = req.body.user
  addNote(title, content, user)
  

  res.status(204).send()
})


/**
 * @route GET /notes - Endpoint to retrieve notes associated with the authenticated user.
 * @description Retrieves notes belonging to the authenticated user.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {void} Responds with a HTTP 200 OK status and an array of notes belonging to the user.
 */
notesRouter.get('/', hasAuthentication, (req: Request, res: Response) => {
  const user = req.headers.authorization!

  const notes: Note[] = getNotes().filter(note => note.user === user)


  res.status(200).send(notes)


})

/**
 * @route GET /notes/:id - Endpoint to retrieve a specific note by ID associated with the authenticated user.
 * @middleware hasAuthentication - The method requires authentication.
 * @description Retrieves a note by its ID belonging to the authenticated user.
 * @param {Request} req - The request object containing the note ID as a parameter.
 * @param {Response} res - The response object.
 * @return {void} Responds with a HTTP 200 OK status and the requested note if found, or a HTTP 404 Not Found status if the note does not exist.
 */
notesRouter.get('/:id', hasAuthentication, (req: Request, res: Response) => {

  const id: number = parseInt(req.params.id)
  const note: Note | undefined = getNoteById(id)
 
  if (note === undefined) {
    
    res.status(404).send(`Note with ID ${id} was not found.`)
  } else {
   
    res.status(200).send(note)
  }

 })

/**
 * @route PUT /notes/:id - Endpoint to update a specific note by ID associated with the authenticated user.
 * @middleware hasAuthentication - The method requires authentication.
 * @description Updates a note by its ID with the provided title, content, and user, belonging to the authenticated user.
 * @param {Request} req - The request object containing the updated note data and the note ID as a parameter.
 * @param {Response} res - The response object.
 * @return {void} Responds with a HTTP 204 No Content status upon successful update of the note, or a HTTP 404 Not Found status if the note does not exist.
 */
notesRouter.put('/:id', hasAuthentication, (req: Request, res: Response) => { 
  const title: string = req.body.title
  const content: string = req.body.content
  const user: string = req.body.user
  const id: number = parseInt(req.params.id)

  const oldNote: Note | undefined = getNoteById(id)

  if (oldNote === undefined) {
    res.status(404).send(`Die Notiz mit ID ${id} wurde nicht gefunden.`)
    return
  }
  updateNote(id, title, content, user)

 
  res.status(204).send()


})

/**
 * @route PATCH /notes/:id - Endpoint to partially update a specific note by ID associated with the authenticated user.
 * @middleware hasAuthentication - The method requires authentication.
 * @description Partially updates a note by its ID with the provided title, content, and user, belonging to the authenticated user.
 * @param {Request} req - The request object containing the updated note data and the note ID as a parameter.
 * @param {Response} res - The response object.
 * @return {void} Responds with a HTTP 204 No Content status upon successful partial update of the note, or a HTTP 404 Not Found status if the note does not exist.
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

 
  updateNote(id, title, content, user)


  res.status(204).send()

 })

/**
 * @route DELETE /notes/:id - Endpoint to delete a specific note by ID associated with the authenticated user.
 * @middleware hasAuthentication - The method requires authentication.
 * @description Deletes a note by its ID belonging to the authenticated user.
 * @param {Request} req - The request object containing the note ID as a parameter.
 * @param {Response} res - The response object.
 * @return {void} Responds with a HTTP 204 No Content status upon successful deletion of the note, or a HTTP 404 Not Found status if the note does not exist.
 */
notesRouter.delete('/:id',  hasAuthentication,(req: Request, res: Response) => { 

  const id: number = parseInt(req.params.id)

  const oldNote: Note | undefined = getNoteById(id)

  if (oldNote === undefined) {
    res.status(404).send(`Die Notiz mit ID ${id} wurde nicht gefunden.`)
    return
  }

  
  deleteNoteById(id)



  res.status(204).send()

})