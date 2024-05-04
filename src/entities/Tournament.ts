import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { User } from "./User"
import { Match } from "./Match"
import { Standing } from "./Standing"
import { Scorer } from "./Scorer"
import { Team } from "./Team"

@Entity()
export class Tournament {
    @PrimaryGeneratedColumn()
    tournamentId!: number

    @ManyToOne(() => User, user => user.tournaments)
    organizer!: User

    @Column({
        nullable: true
    })
    name!: string

    @Column({
        default: new Date(),
    })
    startDate!: Date

    @Column({
        default: new Date()
    })
    endDate!: Date

    @Column({
        nullable: true
    })
    location!: string

    @Column({
        default: "League"
    })
    format!: "Group" | "Play-off" | "Group+Play-off"

    @Column({
        default: "11v11"
    })
    type!: "2v2" | "3v3" | "4v4" | "5v5" | "6v6" | "7v7" | "8v8" | "9v9" | "10v10" | "11v11"

    @Column({
        default: "Not Started"
    })
    stage!: string

    @Column({
        default: 0
    })
    numOfTeams!: number

    @Column({
        default: 0
    })
    numOfGroups!: number

    @Column({
        default: 0
    })
    numOfAdvanced!: number

    @Column({
        default: 0
    })
    numbOfTeamsInGroup!: number

    @Column({
        default: 0
    })
    numberOfPlayOffTeams!: 128 | 64 | 32 | 16 | 8 | 4 | 2 | 0

    @Column({
        nullable: true
    })
    logo!: string //photo

    @Column({
        default: "upcoming"
    })
    status!: "finished" | "ongoing" | "upcoming"

    @Column({
        default: "private"
    })
    visibility!: "public" | "private" //public,private

    @Column({
        nullable: true
    })
    description!: string

    @ManyToMany(() => Team, team => team.tournaments)
    @JoinTable()
    teams!: Team[]

    @OneToMany(() => Match, match => match.tournament)
    matches!: Match[]

    @OneToMany(() => Standing, standing => standing.tournament)
    standings!: Standing[]

    @OneToMany(() => Scorer, scorer => scorer.tournament)
    scorers!: Scorer[]
}