import {Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm"
import { Team } from "./Team"
import {Match} from "./Match";

@Entity()
export class MatchStat {
    @PrimaryGeneratedColumn()
    matchStatId!: number

    @ManyToOne(() => Team, (team) => team.matchStats)
    team!: Team

    @OneToOne(() => Match, (match) => match.matchStatFirstTeam)
    matchFirstTeam: Match

    @OneToOne(() => Match, (match) => match.matchStatSecondTeam)
    matchSecondTeam: Match

    @Column({
        default: 0
    })
    totalShots!: number

    @Column({
        default: 0
    })
    shotsOnGoal!: number

    @Column({
        default: 0
    })
    saves!: number

    @Column({
        default: 0
    })
    corners!: number

    @Column({
        default: 0
    })
    freeKicks!: number

    @Column({
        default: 0
    })
    fouls!: number

    @Column({
        default: 0
    })
    offsides!: number

    @Column({
        default: 0
    })
    redCards!: number

    @Column({
        default: 0
    })
    yellowCards!: number
}
