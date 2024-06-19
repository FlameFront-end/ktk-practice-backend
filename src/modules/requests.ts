import { Router } from 'express'
import { User } from '../entity/User'
import 'dotenv/config'
import { myDataSource } from '../app-data-source'

const router = Router()

router.post('/create-request', async (req, res) => {
  const { productsIds, userId } = req.body

  console.log('req.body', req.body)

  const userRepository = myDataSource.getRepository(User)

  try {
    const user = await userRepository.findOne({ where: { id: Number(userId) } })

    if (!user || !productsIds || !Array.isArray(productsIds)) {
      return res.status(400).json({ error: 'User not found or invalid productId' })
    }

    if (user.productsId) {
      user.productsId.push(...productsIds)
    } else {
      user.productsId = [...productsIds]
    }

    await userRepository.save(user)

    res.json({ message: 'Products added successfully', user })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
