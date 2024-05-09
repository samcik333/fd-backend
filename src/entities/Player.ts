import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm"
import { Team } from "./Team"

@Entity()
export class Player {
    @PrimaryGeneratedColumn()
    playerId!: number

    @Column()
    firstName!: string

    @Column()
    lastName!: string

    @Column()
    age!: number

    @Column()
    number!: number

    @ManyToOne(() => Team, (team) => team.players)
    team!: Team
}
