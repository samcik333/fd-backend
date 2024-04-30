import { Column, Entity, ManyToOne, ManyToMany, OneToMany, PrimaryGeneratedColumn, JoinColumn, JoinTable } from "typeorm"
import { User } from "./User"
import { Tournament } from "./Tournament"
import { Match } from "./Match"
import { Standing } from "./Standing"
import { Player } from "./Player"

@Entity()
export class Team {
    @PrimaryGeneratedColumn()
    teamId!: number

    @ManyToOne(() => User, (user) => user.teams)
    owner!: User // Changed to relation field

    @Column()
    name!: string

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

    @ManyToMany(() => Tournament, (tournament) => tournament.teams)
    tournaments!: Tournament[]

    @ManyToMany(() => Player, (player) => player.teams)
    @JoinTable()
    players!: Player[]

    @OneToMany(() => Match, (match) => match.firstTeam)
    homeMatches!: Match[]

    @OneToMany(() => Match, (match) => match.secondTeam)
    awayMatches!: Match[]

    @OneToMany(() => Standing, (standing) => standing.team)
    standings!: Standing[]
}
