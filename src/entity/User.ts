import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

type Request = {
  productId: number
  status: string
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  fullName: string

  @Column({ unique: true })
  username: string

  @Column()
  phone: string

  @Column()
  password: string

  @Column()
  login: string

  @Column({ default: false })
  is_admin: boolean

  @Column({ type: 'text', array: true, nullable: true })
  requests: Request[]
}
