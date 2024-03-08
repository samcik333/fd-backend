import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Tournament {
    @PrimaryGeneratedColumn()
    tournamentId: number;

    @Column()
    organizerId: number;

    @Column()
    name: string;
}