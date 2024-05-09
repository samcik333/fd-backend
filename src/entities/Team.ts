import {Column, Entity, ManyToOne, ManyToMany, OneToMany, PrimaryGeneratedColumn, JoinTable, JoinColumn} from "typeorm"
import { User } from "./User"
import { Match } from "./Match"
import { Standing } from "./Standing"
import { Player } from "./Player"
import {Group} from "./Group";
import {MatchStat} from "./MatchStat";

@Entity()
export class Team {
    @PrimaryGeneratedColumn()
    teamId!: number

    @ManyToOne(() => User, (user) => user.teams)
    owner!: User // Changed to relation field

    @Column()
    name!: string

    @Column({
        default: new Date(),
    })
    dateCreated!: Date

    @Column({ nullable: true })
    logo!: string

    @Column({ default: 0 })
    wins!: number

    @Column({ default: 0 })
    draws!: number

    @Column({ default: 0 })
    loses!: number

    @Column({ nullable: true })
    location!: string

    @OneToMany(() => Player, (player) => player.team)
    @JoinTable()
    players!: Player[]

    @OneToMany(() => Match, (match) => match.firstTeam)
    homeMatches!: Match[]

    @OneToMany(() => Match, (match) => match.secondTeam)
    awayMatches!: Match[]

    @OneToMany(() => Standing, (standing) => standing.team)
    standings!: Standing[]

    @ManyToMany(() => Group, (group) => group.teams)
    groups!: Group[]

    @OneToMany(() => MatchStat, (matchStat) => matchStat.team)
    @JoinColumn()
    matchStats!: MatchStat[]
}
