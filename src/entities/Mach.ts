import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Match {
    @PrimaryGeneratedColumn()
    matchId: number;

    @Column({
        nullable: true,
    })
    tournamentId: number; //Tournament

    @Column({
        default: new Date()
    })
    datetime: Date;

    @Column({
        nullable: true,
    })
    location: string;

    @Column({
        default: "upcoming",
    })
    status: "finished" | "live" | "upcoming";

    @Column()
    firstTeam: string; //Team

    @Column()
    secondTeam: string; //Team

    @Column({
        nullable: true,
    })
    scoreFirstTeam: number;

    @Column({
        nullable: true,
    })
    scoreSecondTeam: number;

    @Column()
    type: "League" | "Group" | "16-final" | "8-final" | "semi-final" | "final";

    @Column()
    group: string;

    @Column()
    matchStatFirstTeam: string; //MatchStat

    @Column()
    matchStatSecondTeam: string; //MatchStat

    @Column()
    events: string; //Event
}