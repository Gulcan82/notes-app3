import { Request, Response, Router } from 'express'
import { getNotes, getNoteById, addNote, updateNote, deleteNoteById } from '../services/data'
import { Note } from '../types/notes'


export const notesRouter = Router()

notesRouter.post('/', (req: Request, res: Response) => {
  const title: string = req.body.title
  const content: string = req.body.content
  const user: string = req.body.user
  addNote(title, content, user)
  

  res.status(204).send()
})


notesRouter.get('/', (req: Request, res: Response) => {

  const notes: Note[] = getNotes()


  res.status(200).send(notes)


})


notesRouter.get('/:id', (req: Request, res: Response) => {

  const id: number = parseInt(req.params.id)
  const note: Note | undefined = getNoteById(id)
 
  if (note === undefined) {
    
    res.status(404).send(`Note with ID ${id} was not found.`)
  } else {
   
    res.status(200).send(note)
  }

 })


notesRouter.put('/:id', (req: Request, res: Response) => { 
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


notesRouter.patch('/:id', (req: Request, res: Response) => {

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


notesRouter.delete('/:id', (req: Request, res: Response) => { 

  const id: number = parseInt(req.params.id)

  const oldNote: Note | undefined = getNoteById(id)

  if (oldNote === undefined) {
    res.status(404).send(`Die Notiz mit ID ${id} wurde nicht gefunden.`)
    return
  }

  
  deleteNoteById(id)



  res.status(204).send()

})