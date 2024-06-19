import * as express from 'express'
import { myDataSource } from './app-data-source'
import authRoutes from './modules/auth'
import requestsRoutes from './modules/requests'
const cors = require('cors')

myDataSource.initialize().catch((err) => {
  console.error('Error during Data Source initialization:', err)
})

const app = express()
app.use(cors())

app.use(express.json())

app.use('/auth', authRoutes)
app.use('/requests', requestsRoutes)

app.listen(3001)
