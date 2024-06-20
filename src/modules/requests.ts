import { Router } from 'express'
import { User } from '../entity/User'
import { Request } from '../entity/Request'
import 'dotenv/config'
import { myDataSource } from '../app-data-source'

const router = Router()

router.post('/create-request', async (req, res) => {
  const { userId, requests } = req.body

  const userRepository = myDataSource.getRepository(User)
  const requestRepository = myDataSource.getRepository(Request)

  try {
    const user = await userRepository.findOne({ where: { id: Number(userId) }, relations: ['requests'] })

    if (!user || !requests || !Array.isArray(requests)) {
      return res.status(400).json({ error: 'User not found or invalid requests' })
    }

    const savedRequests = []

    for (const req of requests) {
      const newRequest = requestRepository.create({
        productId: req.productId,
        status: req.status,
        user: user,
      })

      const savedRequest = await requestRepository.save(newRequest)
      savedRequests.push(savedRequest)
    }

    user.requests = [...user.requests, ...savedRequests]
    await userRepository.save(user)

    const responseUser = {
      ...user,
      requests: user.requests.map((req) => ({
        id: req.id,
        productId: req.productId,
        status: req.status,
      })),
    }

    res.json({ message: 'Requests added successfully', user: responseUser })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.patch('/update-request-status', async (req, res) => {
  const { requestId, status } = req.body

  console.log('req.body', req.body)

  const requestRepository = myDataSource.getRepository(Request)

  try {
    const request = await requestRepository.findOne({ where: { id: Number(requestId) } })

    if (!request) {
      return res.status(404).json({ error: 'Request not found' })
    }

    request.status = status
    const updatedRequest = await requestRepository.save(request)

    res.json({ message: 'Request status updated successfully', request: updatedRequest })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/all-requests', async (_, res) => {
  const requestRepository = myDataSource.getRepository(Request)

  try {
    const requests = await requestRepository.find({ relations: ['user'] })

    const responseRequests = requests.map((req) => ({
      id: req.id,
      user: {
        id: req.user.id,
        fullName: req.user.fullName,
        username: req.user.username,
        phone: req.user.phone,
        login: req.user.login,
        is_admin: req.user.is_admin,
      },
      productId: req.productId,
      status: req.status,
    }))

    res.json({ requests: responseRequests })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
