import { Router } from 'express'
const jwt = require('jsonwebtoken')
import { myDataSource } from '../app-data-source'
import { User } from '../entity/User'
import 'dotenv/config'

const router = Router()

router.post('/register', async (req, res) => {
  const { fullName, username, phone, password, login } = req.body

  if (!fullName || !username || !phone || !password) {
    return res.status(400).json({
      error: 'no required fields',
    })
  }

  const userRepository = myDataSource.getRepository(User)

  try {
    const user = new User()
    user.fullName = fullName
    user.username = username
    user.phone = phone
    user.password = password
    user.login = login

    await userRepository.save(user)

    res.status(201).json({ message: 'User registered successfully', user })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/login', async (req, res) => {
  const { username, password } = req.body
  const userRepository = myDataSource.getRepository(User)

  try {
    const user = await userRepository.findOne({ where: { username } })

    if (!user) {
      return res.status(400).json({ error: 'Invalid username or password' })
    }

    if (typeof user.password === 'string') {
      const isMatch = password === user.password
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid username or password' })
      }

      if (process.env.JWT_SECRET) {
        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
          expiresIn: '1h',
        })

        res.json({ message: 'Login successful', token, user })
      }
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']

  if (!token) {
    return res.status(403).json({ error: 'Token not provided' })
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('Failed to authenticate token', err)
      return res.status(401).json({ error: 'Failed to authenticate token' })
    }

    req.userId = decoded.id
    next()
  })
}

router.get('/me', verifyToken, async (req: any, res) => {
  const userId = req.userId

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const userRepository = myDataSource.getRepository(User)

  try {
    const user = await userRepository.findOne({
      where: { id: Number(userId) },
      relations: ['requests'],
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const responseUser = {
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      phone: user.phone,
      login: user.login,
      is_admin: user.is_admin,
      requests: user.requests.map((req) => ({
        id: req.id,
        productId: req.productId,
        status: req.status,
      })),
    }

    res.json({ user: responseUser })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
