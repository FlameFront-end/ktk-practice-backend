import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

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
}
