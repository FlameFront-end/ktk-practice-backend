import { Router } from 'express'
import { User } from '../entity/User'
import 'dotenv/config'
import { myDataSource } from '../app-data-source'

const router = Router()

router.post('/create-request', async (req, res) => {
  const { productId, userId } = req.body

  const userRepository = myDataSource.getRepository(User)

  try {
    const user = await userRepository.findOne({ where: { id: Number(userId) } })

    if (!user || !productId) {
      return res.status(400).json({ error: 'User or product not found' })
    }

    if (user.productsId) {
      user.productsId.push(productId)
    } else {
      user.productsId = [productId]
    }

    await userRepository.save(user)

    res.json({ message: 'Product added successfully', user })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
