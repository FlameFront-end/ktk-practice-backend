import { DataSource } from 'typeorm'

export const myDataSource = new DataSource({
  type: 'postgres',
  host: 'balarama.db.elephantsql.com',
  port: 5432,
  username: 'oliajtnw',
  password: 'BTo8_06FztkKtTsZRoYHJBXtue-cMQe_',
  database: 'oliajtnw',
  entities: ['src/entity/*.ts'],
  synchronize: true,
})
