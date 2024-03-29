import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Tournament {
    @PrimaryGeneratedColumn()
    tournamentId: number;

    @Column()
    organizerId: number; //User

    @Column({
        nullable: false
    })
    name: string;

    @Column({
        default: new Date(),
    })
    startDate: Date;

    @Column({
        default: new Date()
    })
    endDate: Date;

    @Column({
        nullable: true
    })
    location: string;

    @Column({
        default: "League"
    })
    type: "League" | "Play-Off" | "Group+Play-off";

    @Column({
        default: "11v11"
    })
    format: "2v2" | "3v3" | "4v4" | "5v5" | "6v6" | "7v7" | "8v8" | "9v9" | "10v10" | "11v11";

    @Column({
        default: 0
    })
    numOfTeams: number;

    @Column({
        default: 0
    })
    numOfGroups: number;

    @Column()
    logo: string; //photo

    @Column({
        default: "upcoming"
    })
    status: "finished" | "ongoing" | "upcoming";

    @Column({
        default: "private"
    })
    visibility: "public" | "private"; //public,private

    @Column({
        nullable: true
    })
    description: string;

    @Column()
    matches: string; //Match

    @Column()
    standings: string; //Standing

    @Column()
    scorers: string; //scorer
}