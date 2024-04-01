import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Team } from "./Team"

@Entity()
export class MatchStat {
    @PrimaryGeneratedColumn()
    matchStatId: number

    @ManyToOne(() => Team)
    team: Team

    @Column({
        default: 0
    })
    totalShots: number

    @Column({
        default: 0
    })
    shotsOnGoal: number

    @Column({
        default: 0
    })
    saves: number

    @Column({
        default: 0
    })
    corners: number

    @Column({
        default: 0
    })
    offsides: number

    @Column({
        default: 0
    })
    redCards: number

    @Column({
        default: 0
    })
    yellowCards: number
}