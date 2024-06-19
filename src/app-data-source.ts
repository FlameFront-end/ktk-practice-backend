import { DataSource } from 'typeorm'
import { User } from './entity/User'

export const myDataSource = new DataSource({
  type: 'postgres',
  host: 'balarama.db.elephantsql.com',
  port: 5432,
  username: 'oliajtnw',
  password: 'BTo8_06FztkKtTsZRoYHJBXtue-cMQe_',
  database: 'oliajtnw',
  entities: [User],
  synchronize: true,
})
