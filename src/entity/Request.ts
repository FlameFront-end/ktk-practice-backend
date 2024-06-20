import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { User } from './User'

@Entity()
export class Request {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  productId: number

  @Column()
  status: string

  @ManyToOne(() => User, (user) => user.requests, { nullable: false })
  user: User
}
