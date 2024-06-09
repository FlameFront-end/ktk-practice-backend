import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { getRepository } from 'typeorm'
import { User } from './entity/User'
import 'dotenv/config'

const router = Router()

router.post('/register', async (req: any, res: any) => {
  const { fullName, username, phone, password } = req.body

  if (!fullName || !username || !phone || !password) {
    return res.status(400).json({
      error: 'no required fields',
    })
  }

  const userRepository = getRepository(User)

  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new User()
    user.fullName = fullName
    user.username = username
    user.phone = phone
    user.password = hashedPassword

    await userRepository.save(user)

    res.status(201).json({ message: 'User registered successfully', user })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/login', async (req: any, res: any) => {
  const { username, password } = req.body
  const userRepository = getRepository(User)

  try {
    const user = await userRepository.findOne({ where: { username } })

    if (!user) {
      return res.status(400).json({ error: 'Invalid username or password' })
    }

    if (typeof user.password === 'string') {
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid username or password' })
      }

      if (process.env.JWT_SECRET) {
        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
          expiresIn: '1h',
        })

        res.json({ message: 'Login successful', token })
      }
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
