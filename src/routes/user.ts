import { Router } from 'express'
import * as user from '../controllers/user'

export const router = Router()

router.post('/', user.signIn)

router.put('/', user.signUp)

router.get('/signout', user.signOut)

router.patch('/', user.updatePassword)
