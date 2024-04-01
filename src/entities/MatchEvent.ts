import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Match } from "./Match" // Fixed typo here
import { Player } from "./Player"

@Entity()
export class MatchEvent {
    @PrimaryGeneratedColumn()
    matchEventId: number

    @ManyToOne(() => Player)
    player: Player // Changed to relation field

    @ManyToOne(() => Match, (match) => match.events)
    match: Match // Relation field, not column

    @Column("timestamp")
    time: Date // Changed to Date type for simplicity

    @Column()
    type: "goal" | "assist" | "yellowCard" | "redCard"
}
