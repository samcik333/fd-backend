import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Match } from "./Match" // Fixed typo here
import { Player } from "./Player"

export enum eventType {
    Goal = "goal",
    yellowCard = "yellowCard",
    redCard = "redCard",
}

@Entity()
export class MatchEvent {
    @PrimaryGeneratedColumn()
    matchEventId!: number

    @ManyToOne(() => Player)
    player!: Player // Changed to relation field

    @ManyToOne(() => Match, (match) => match.events)
    match!: Match // Relation field, not column

    @Column()
    time!: number // Changed to Date type for simplicity

    @Column()
    type!: eventType

    @ManyToOne(() => Player)
    assist!: Player

    @Column()
    half!: "first" | "second" | "extra1" | "extra2" | "penalty"
}
