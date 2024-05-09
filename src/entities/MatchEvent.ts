import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm"
import {Match, MatchStatus} from "./Match" // Fixed typo here
import { Player } from "./Player"

export enum eventType {
    StartFirstHalf = "startFirstHalf",
    stopFirstHalf = "stopFirstHalf",
    StartSecondHalf = "startSecondHalf",
    stopSecondHalf = "stopSecondHalf",

    startFirstExtraHalf = "startFirstExtraHalf",
    stopFirstExtraHalf = "stopFirstExtraHalf",
    StartSecondExtraHalf = "startSecondExtraHalf",
    StopSecondExtraHalf = "stopSecondExtraHalf",
    StopPenalty = "stopPenalty",

    PenaltyMiss = "penaltyMiss",
    PenaltyGoal = "penaltyGoal",

    // Types allowed during the match
    Shot = "shot",
    ShotOnGoal = "shotOnGoal",
    FreeKick = "freeKick",
    Foul = "foul",
    Offside = "offside",
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
    @JoinColumn()
    match!: Match // Relation field, not column

    @Column()
    time!: Date // Changed to Date type for simplicity

    @Column()
    type!: eventType

    @ManyToOne(() => Player)
    assist!: Player

    @Column()
    status!: MatchStatus
}
