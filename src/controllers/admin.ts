import { Request, Response } from 'express'
import { Admin } from '../models/admin'
import { IAdmin } from '../interface/admin'
import config from '../config/config'

/**
 * Admin Sign in controller
 * @param req Node HTTP Request
 * @param res Node HTTP Response
 * @returns HTTP Response
 */
export const signIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    const admin = await Admin.findOne({ email })

    // Check if email registered
    if (!admin) {
      req.flash('notification', 'Akun tidak ditemukan.')
      console.log('[SERVER]: Akun not found')
      return res.redirect('back')
    }

    // Check if password match
    if (password !== admin.password) {
      req.flash('notification', 'Password salah.')
      console.log('[SERVER]: Incorrect password')
      return res.redirect('back')
    }

    const { id, name } = admin

    // Create session
    const adminSession: Pick<IAdmin, 'id' | 'name' | 'email'> = {
      id,
      name,
      email,
    }

    req.session.admin = adminSession

    // Sign in success
    req.flash('notification', `Selamat Datang ${name.split(' ')[0]}.`)
    console.log('[SERVER]: Admin logged in.')
    return res.redirect('back')
  } catch (error) {
    // Sign in error
    req.flash(
      'notification',
      'Terjadi kesalahan saat mencoba masuk, coba lagi.'
    )
    console.error('[SERVER]: Sign in error.', error)
    return res.redirect('back')
  }
}

/**
 * Admin Sign out controller
 * @param req Node HTTP Request
 * @param res Node HTTP Response
 * @returns HTTP Response
 */
export const signOut = async (req: Request, res: Response) => {
  try {
    // Check if session id provided
    if (!req.session.admin) {
      req.flash(
        'notification',
        'Terjadi kesalahan saat mencoba keluar, coba lagi.'
      )
      console.log('[SERVER]: No session id provided.')
      return res.redirect('back')
    }

    const { name } = req.session.admin

    req.session.destroy((error: Error) => {
      if (error) throw error

      res.clearCookie(config.SESSION_COLLECTION_NAME)

      // Sign out success
      console.log(`[SERVER]: ${name} signed out.`)
      return res.redirect('back')
    })
  } catch (error) {
    // Sign out error
    req.flash(
      'notification',
      'Terjadi kesalahan saat mencoba keluar, coba lagi.'
    )
    console.error('[SERVER]: Sign out error.', error)
    return res.redirect('back')
  }
}
