import { Column, Entity, OneToOne, PrimaryGeneratedColumn, JoinColumn, ManyToMany } from "typeorm"
import { User } from "./User"
import { Team } from "./Team"

@Entity()
export class Player {
    @PrimaryGeneratedColumn()
    playerId: number

    @OneToOne(() => User)
    @JoinColumn()
    user: User // Changed to relation field

    @ManyToMany(() => Team, (team) => team.players)
    teams: Team[]
}
