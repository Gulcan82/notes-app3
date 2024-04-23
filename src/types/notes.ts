export class Note {
  id: number;
  title: string;
  content: string;
  user: string;

  constructor(id: number, title: string, content: string, user: string) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.user = user;
  }
}

  
/**
 * Represents the raw data structure of notes data, containing an array of notes,
 * to extract the notes from the raw JSON object.
 */
export type NotesRaw = {
  notes: Note[]
}
