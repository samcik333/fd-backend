import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Tournament } from "./Tournament"
import { Team } from "./Team"
import { MatchStat } from "./MatchStat"
import { MatchEvent } from "./MatchEvent"

@Entity()
export class Match {
    @PrimaryGeneratedColumn()
    matchId!: number

    @ManyToOne(() => Tournament, (tournament) => tournament.matches)
    tournament!: Tournament

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    datetime!: Date

    @Column({ nullable: true })
    location!: string

    @Column({ default: "upcoming" })
    status!: "finished" | "live" | "upcoming"

    @ManyToOne(() => Team, (team) => team.homeMatches)
    firstTeam!: Team

    @ManyToOne(() => Team, (team) => team.awayMatches)
    secondTeam!: Team

    @Column({ nullable: true })
    scoreFirstTeam!: number

    @Column({ nullable: true })
    scoreSecondTeam!: number

    @Column()
    type!: string

    @Column({ nullable: true })
    group!: string

    @ManyToOne(() => MatchStat)
    matchStatFirstTeam!: MatchStat

    @ManyToOne(() => MatchStat)
    matchStatSecondTeam!: MatchStat

    @OneToMany(() => MatchEvent, (event) => event.match)
    events!: MatchEvent[]
}
