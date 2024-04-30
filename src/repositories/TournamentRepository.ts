import { LessThan, LessThanOrEqual, Like, MoreThanOrEqual } from "typeorm"
import { AppDataSource } from "../dataSource"
import { Tournament } from "../entities/Tournament"
import { TournamentFilterParams } from "../utils/interfaces"
import { Match } from "../entities/Match"
import { Standing } from "../entities/Standing"
import { Scorer } from "../entities/Scorer"

export async function getAllTournamentsByFilter(tournamentFilterParams: TournamentFilterParams) {

    return await AppDataSource.getRepository(Tournament).find({
        where: {
            ...(tournamentFilterParams.name && { name: Like(`%${tournamentFilterParams.name}%`) }),
            ...(tournamentFilterParams.type && { type: tournamentFilterParams.type }),
            ...(tournamentFilterParams.status && { status: tournamentFilterParams.status }),
            ...(tournamentFilterParams.date && { startDate: LessThanOrEqual(tournamentFilterParams.date) }),
            ...(tournamentFilterParams.date && { endDate: MoreThanOrEqual(tournamentFilterParams.date) }),
            ...(tournamentFilterParams.format && { format: tournamentFilterParams.format }),
            ...(tournamentFilterParams.location && { location: Like(`%${tournamentFilterParams.location}%`) }),
        }
    })
}

export async function getOneTournament(id: number) {
    return await AppDataSource.getRepository(Tournament).find({
        where: {
            tournamentId: id
        }
    })
}

export async function getResults(id: number) {

    const now = new Date()

    return await AppDataSource.getRepository(Match).find({
        where: {
            tournament: { tournamentId: id },
            datetime: LessThanOrEqual(now)
        },
        order: {
            datetime: "DESC"
        },
        take: 3,
        relations: ["firstTeam", "secondTeam", "tournament"]
    })
}

export async function getUpcoming(id: number) {

    const now = new Date()

    return await AppDataSource.getRepository(Match).find({
        where: {
            tournament: { tournamentId: id },
            datetime: MoreThanOrEqual(now)
        },
        order: {
            datetime: "ASC"
        },
        take: 3,
        relations: ["firstTeam", "secondTeam", "tournament"]
    })
}

export async function getStandings(id: number) {
    return await AppDataSource.getRepository(Standing).find({
        where: {
            tournament: { tournamentId: id }
        },
        relations: ["team"]
    })
}

export async function getMatches(id: number, type: string) {
    return await AppDataSource.getRepository(Match).find({
        where: {
            tournament: { tournamentId: id },
            type
        },
        relations: ["firstTeam", "secondTeam", "tournament"]
    })
}

export async function getPlayerStats(id: number) {
    return await AppDataSource.getRepository(Scorer).find({
        where: {
            tournament: { tournamentId: id }
        },
        relations: ["player.user"]
    })
}
