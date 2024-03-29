import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    userId: number;

    @Column({
        unique: true
    })
    username: string;

    @Column({
        unique: true
    })
    email: string;

    @Column()
    password: string;

    @Column({
        nullable: true
    })
    role: "player" | "organizer" | "owner" | "timeTracker";

    @Column({
        nullable: true
    })
    logo: string;

    @Column({
        nullable: true
    })
    teams: string;//Team

    @Column({
        nullable: true
    })
    tournaments: string; //Tournament
}