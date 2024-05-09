import {Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Team} from "./Team";
import {Match} from "./Match";
import {Tournament} from "./Tournament";


interface CreateTournament {
    name: string
    startDate: Date
    endDate: Date
    location: string
    format: "Group" | "Play-off" | "Group+Play-off"
    type: "2v2" | "3v3" | "4v4" | "5v5" | "6v6" | "7v7" | "8v8" | "9v9" | "10v10" | "11v11"
    numOfGroups: number
    numOfTeams: number
    numOfAdvanced: number
    numOfPlayOffTeams: 32 | 16 | 8 | 4 | 2
}

@Entity()
export class Group {
    @PrimaryGeneratedColumn()
    groupId!: number

    @Column()
    name!: string

    @Column({ default: 1 })
    round: number

    @Column({ nullable: true })
    homeTeamIndex!: number // used online in Play-off or Group+Play-off

    @Column({ nullable: true })
    awayTeamIndex!: number // used online in Play-off or Group+Play-off

    @Column({ nullable: true })
    colIndex: number // used online in Play-off or Group+Play-off

    @ManyToOne(() => Team, (team) => team.groups, { nullable: true })
    homeTeam: Team

    @ManyToOne(() => Team, (team) => team.groups, { nullable: true })
    awayTeam: Team

    @ManyToMany(() => Team, (team) => team.groups)
    @JoinTable()
    teams!: Team[]

    @OneToMany(() => Match, (match) => match.group)
    matches!: Match[]

    @ManyToOne(() => Tournament, (tournament) => tournament.groups)
    tournament!: Tournament
}
