import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { Request } from './Request'

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

  @OneToMany(() => Request, (request) => request.user)
  requests: Request[]
}
