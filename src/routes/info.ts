import { Request, Response, Router } from 'express'

export const infoRouter = Router()

infoRouter.get('/', (req: Request, res: Response) => {
  res.send('GET - Wir haben heute viel über APIs und HTTP gelernt.')
})

infoRouter.post('/', (req: Request, res: Response) => {
  res.send('POST - Deine Post Anfrage ist angekommen!')
})