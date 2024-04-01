import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Tournament } from "./Tournament"
import { Team } from "./Team"

@Entity()
export class Standing {
    @PrimaryGeneratedColumn()
    standingId: number

    @ManyToOne(() => Tournament, tournament => tournament.standings)
    tournamentId: Tournament

    @ManyToOne(() => Team, team => team.standings)
    team: Team

    @Column({
        default: 0
    })
    position: number

    @Column({
        default: 0
    })
    wins: number

    @Column({
        default: 0
    })
    draws: number

    @Column({
        default: 0
    })
    loses: number

    @Column({
        default: 0
    })
    goalsFor: number

    @Column({
        default: 0
    })
    goalsAgainst: number

    @Column({
        default: 0
    })
    goalDiff: number

    @Column({
        default: 0
    })
    points: number

    @Column()
    group: string
}