import { Request, Response } from 'express'
import { User } from '../models/user'
import { IUser } from '../interface/user'
import config from '../config/config'

/**
 * User Sign in controller
 * @param req Node HTTP Request
 * @param res Node HTTP Response
 * @returns HTTP Response
 */
export const signIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    // Check if email registered
    if (!user) {
      req.flash('notification', 'Akun tidak ditemukan.')
      console.log('[SERVER]: Akun not found')
      return res.redirect('back')
    }

    // Check if password match
    if (password !== user.password) {
      req.flash('notification', 'Password salah.')
      console.log('[SERVER]: Incorrect password')
      return res.redirect('back')
    }

    const { id, name } = user

    // Create session
    const userSession: Pick<IUser, 'id' | 'name' | 'email'> = {
      id,
      name,
      email,
    }

    req.session.user = userSession

    // Sign in success
    req.flash('notification', `Selamat Datang ${name.split(' ')[0]}.`)
    console.log('[SERVER]: User logged in.')
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
 * User Sign up controller
 * @param req Node HTTP Request
 * @param res Node HTTP Response
 * @returns HTTP Response
 */
export const signUp = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    // Check if email registered
    if (!user) {
      req.flash('notification', 'Akun tidak ditemukan.')
      console.log('[SERVER]: Akun not found')
      return res.redirect('back')
    }

    // Check if password match
    if (password !== user.password) {
      req.flash('notification', 'Password salah.')
      console.log('[SERVER]: Incorrect password')
      return res.redirect('back')
    }

    const { id, name } = user

    // Create session
    const userSession: Pick<IUser, 'id' | 'name' | 'email'> = {
      id,
      name,
      email,
    }

    req.session.user = userSession

    // Sign in success
    req.flash('notification', `Selamat Datang ${name.split(' ')[0]}.`)
    console.log('[SERVER]: User logged in.')
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
 * User Sign out controller
 * @param req Node HTTP Request
 * @param res Node HTTP Response
 * @returns HTTP Response
 */
export const signOut = async (req: Request, res: Response) => {
  try {
    // Check if session id provided
    if (!req.session.user) {
      req.flash(
        'notification',
        'Terjadi kesalahan saat mencoba keluar, coba lagi.'
      )
      console.log('[SERVER]: No session id provided.')
      return res.redirect('back')
    }

    const { name } = req.session.user

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

/**
 * User Sign out controller
 * @param req Node HTTP Request
 * @param res Node HTTP Response
 * @returns HTTP Response
 */
export const updatePassword = async (req: Request, res: Response) => {
  try {
    const { password, passwordConfirmation, oldPassword } = req.body
    const { id } = req.session.user

    const user = await User.findById(id)

    if (!user) {
      req.flash('notification', `User tidak ditemukan.`)
      console.log(`[SERVER]: User not found, update password error.`)
      return res.redirect('/password')
    }

    if (user.password !== oldPassword) {
      req.flash('notification', `Gagal melakukan autentikasi, password salah.`)
      console.log(`[SERVER]: Update password failed, old password incorrect.`)
      return res.redirect('/password')
    }

    if (password !== passwordConfirmation) {
      req.flash('notification', `Konfirmasi password baru gagal.`)
      console.log(`[SERVER]: New Password confirmation failed.`)
      return res.redirect('/password')
    }

    await User.findByIdAndUpdate(id, { $set: { password } })

    req.flash('notification', `Password berhasil diperbarui.`)
    console.log(`[SERVER]: Update password success.`)
    return res.redirect('/')
  } catch (error) {
    req.flash(
      'notification',
      `Terjadi kesalahan saat mencoba memperbarui password, coba lagi.`
    )
    console.log(`[SERVER]: Update password error.`)
    return res.redirect('/password')
  }
}
