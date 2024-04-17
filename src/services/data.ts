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

  const notes = getNotes() // Liste von Notizen

  // nur die Notiz finden, die die verlangte ID hat
  const note = notes.find(note => note.id === id)
  return note
}

