import { Router } from 'express'
import { User } from '../entity/User'
import 'dotenv/config'
import { myDataSource } from '../app-data-source'

const router = Router()

router.post('/create-request', async (req, res) => {
  const { requests, userId } = req.body

  console.log('req.body', req.body)

  const userRepository = myDataSource.getRepository(User)

  try {
    const user = await userRepository.findOne({ where: { id: Number(userId) } })

    if (!user || !requests || !Array.isArray(requests)) {
      return res.status(400).json({ error: 'User not found or invalid productId' })
    }

    if (user.requests) {
      user.requests.push(...requests)
    } else {
      user.requests = [...requests]
    }

    await userRepository.save(user)

    res.json({ message: 'Products added successfully', user })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
