import * as express from 'express'
import { myDataSource } from './app-data-source'
import authRoutes from './auth'

myDataSource.initialize().catch((err) => {
  console.error('Error during Data Source initialization:', err)
})

const app = express()
app.use(express.json())

app.use('/auth', authRoutes)

app.listen(3000)
