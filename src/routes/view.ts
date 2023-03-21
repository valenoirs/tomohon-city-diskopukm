import { Request, Response, Router } from 'express'

export const router = Router()

// Public
router.get('/', async (req: Request, res: Response) => {
  return res.render('index', {
    layout: 'layout',
    notification: req.flash('notification'),
  })
})

// User
router.get('/masuk', async (req: Request, res: Response) => {
  if (req.session.user) return res.redirect('/')

  return res.render('user/signin', {
    layout: 'layout',
    notification: req.flash('notification'),
  })
})

router.get('/daftar', async (req: Request, res: Response) => {
  if (req.session.user) return res.redirect('/')

  return res.render('user/signup', {
    layout: 'layout',
    notification: req.flash('notification'),
  })
})

router.get('/password', async (req: Request, res: Response) => {
  if (!req.session.user) return res.redirect('/masuk')

  return res.render('user/password', {
    layout: 'layout',
    notification: req.flash('notification'),
  })
})
