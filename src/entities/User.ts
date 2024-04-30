import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Team } from "./Team"
import { Tournament } from "./Tournament"

export enum Role {
    Player = "player",
    Organizer = "organizer",
    Owner = "owner",
    TimeTracker = "timeTracker",
    Admin = "Admin",
    User = "User"
}
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    userId!: number

    @Column({ unique: true })
    username!: string

    @Column({ unique: true })
    email!: string

    @Column()
    password!: string

    @Column("simple-array", { nullable: true })
    roles!: Role[]

    @Column({ nullable: true })
    logo!: string

    @Column()
    firstName!: string

    @Column()
    secondName!: string

    @OneToMany(() => Team, (team) => team.owner)
    teams!: Team[]

    @OneToMany(() => Tournament, (tournament) => tournament.organizer)
    tournaments!: Tournament[]
}
