import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm"
import { User } from "./User"
import { Standing } from "./Standing"
import { Scorer } from "./Scorer"
import {Group} from "./Group";
import {JoinColumn} from "typeorm";

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
        default: "Group"
    })
    format!: "Group" | "Play-off" | "Group+Play-off"

    @Column({
        default: "11v11"
    }) // NumberOfPlayers in one match
    type!: "2v2" | "3v3" | "4v4" | "5v5" | "6v6" | "7v7" | "8v8" | "9v9" | "10v10" | "11v11"

    @Column({
        default: "Not Started"
    })
    stage!: string

    @Column({nullable: true})
    numOfTeams: number

    @Column({nullable: true})
    numOfGroups: number

    @Column({nullable: true})
    numOfAdvanced: number

    @Column({nullable: true})
    numOfTeamsInGroup: number

    @Column({nullable: true})
    numberOfPlayOffTeams:  32 | 16 | 8 | 4 | 2 | null

    @Column({
        nullable: true
    })
    logo!: string //photo

    @Column({
        default: "upcoming"
    })
    status!: "finished" | "ongoing" | "upcoming"

    @OneToMany(() => Group, group => group.tournament)
    @JoinColumn()
    groups!: Group[]

    @OneToMany(() => Standing, standing => standing.tournament)
    standings!: Standing[]

    @OneToMany(() => Scorer, scorer => scorer.tournament)
    scorers!: Scorer[]
}
