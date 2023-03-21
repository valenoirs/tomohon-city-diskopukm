import { Request, Response, Router } from 'express'
import * as admin from '../controllers/admin'

export const router = Router()

// API
router.post('/', admin.signIn)

router.get('/signout', admin.signOut)

// GET
router.get('/masuk', async (req: Request, res: Response) => {
  if (req.session.admin) return res.redirect('/admin')

  return res.render('admin/signin', {
    layout: 'layout',
    notification: req.flash('notification'),
  })
})

router.get('/', async (req: Request, res: Response) => {
  if (!req.session.admin) return res.redirect('/admin/masuk')

  return res.render('admin/index', {
    layout: 'layout',
    notification: req.flash('notification'),
  })
})
