import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Tournament } from "./Tournament"
import { Player } from "./Player"

@Entity()
export class Scorer {
    @PrimaryGeneratedColumn()
    scorerId: number

    @ManyToOne(() => Tournament, (tournament) => tournament.scorers)
    tournament: Tournament

    @ManyToOne(() => Player)
    player: Player

    @Column({ default: 0 })
    goals: number

    @Column({ default: 0 })
    assists: number // Typo fixed from "asists" to "assists"
}
