import  { Request, Response, Router } from 'express'


export const defaultRouter = Router()

// http-request: method (GET, POST, ...), URL (path)
// this structure is used by express
defaultRouter.get('/', (req: Request, res: Response) => {
    res.send('Das ist die Hauptseite der Notiz-App.');
});
