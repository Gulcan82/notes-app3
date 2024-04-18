import * as fs from 'node:fs'
import { Note } from '../types/notes'

type NotesRaw = {
  notes: Note[]
}

export function getNotes(): Note[] {
  const notesRaw = fs.readFileSync('data/notes.json', 'utf8')
  const notizen = JSON.parse(notesRaw) as NotesRaw
  const array = notizen.notes
  return array
}

export function getNoteById(id: number): Note | undefined {

  const notes = getNotes() 
  
  const note = notes.find(note => note.id === id)
  return note
}

export function writeNotesToFile(oldNotes: Note[]): void { 
  const newNotes: NotesRaw = { notes: oldNotes }
  fs.writeFileSync('data/notes.json', JSON.stringify(newNotes))
}

export function addNote(title: string, content: string, user: string): void {

  const oldNotes = getNotes()
  const id = oldNotes.length + 1 

  
  const newNote: Note = new Note(id, title, content, user)

  oldNotes.push(newNote)

  

  writeNotesToFile(oldNotes)

}

export function updateNote(id: number, title: string, content: string, user: string): void {
 
  const oldNotes = getNotes()
  const filteredNotes = oldNotes.filter(note => note.id !== id)

  const newNote: Note = new Note(id, title, content, user)

  filteredNotes.push(newNote)

  

  writeNotesToFile(filteredNotes)
}

export function deleteNoteById(id: number): void {

  const oldNotes = getNotes()
  const filteredNotes = oldNotes.filter(note => note.id !== id)

  
  writeNotesToFile(filteredNotes)
}