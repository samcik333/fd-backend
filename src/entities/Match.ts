import {Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm"
import { Team } from "./Team"
import { MatchStat } from "./MatchStat"
import { MatchEvent } from "./MatchEvent"
import {Group} from "./Group";
import {Player} from "./Player";

export enum MatchStatus {
    upcoming = "upcoming",
    firstHalf = "firstHalf",
    halfTime = "halfTime",
    secondHalf = "secondHalf",
    overTime = "overTime",
    firstExtraHalf = "firstExtraHalf",
    halfExtraTime = "halfExtraTime",
    secondExtraHalf = "secondExtraHalf",
    penalty = "penalty",
    finished = "finished",
}

@Entity()
export class Match {
    @PrimaryGeneratedColumn()
    matchId!: number

    @Column({ type: "timestamp", nullable: true })
    datetime!: Date // StartTime

    @Column({ nullable: true })
    location!: string

    @Column({ default: MatchStatus.upcoming })
    status!: MatchStatus

    @ManyToOne(() => Team, (team) => team.homeMatches)
    firstTeam!: Team

    @OneToMany(() => Player, (player) => player.team)
    firstTeamPlayers!: Player[]

    @ManyToOne(() => Team, (team) => team.awayMatches)
    secondTeam!: Team

    @OneToMany(() => Player, (player) => player.team)
    secondTeamPlayers!: Player[]

    @Column({ default: 0})
    scoreFirstTeam!: number

    @Column({ default: 0})
    scoreSecondTeam!: number

    @Column()
    type!: string

    @ManyToOne(() => Group, (group) => group.matches)
    group!: Group

    @OneToOne(() => MatchStat)
    @JoinColumn()
    matchStatFirstTeam!: MatchStat

    @OneToOne(() => MatchStat)
    @JoinColumn()
    matchStatSecondTeam!: MatchStat

    @OneToMany(() => MatchEvent, (event) => event.match)
    events!: MatchEvent[]
}
