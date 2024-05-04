import { TournamentFilterParams } from "../utils/interfaces"
import { AppDataSource } from "../dataSource"
import { Tournament } from "../entities/Tournament"
import { LessThanOrEqual, Like, MoreThanOrEqual } from "typeorm"
import { Match } from "../entities/Match"
import { Standing } from "../entities/Standing"
import { Scorer } from "../entities/Scorer"
import { Team } from "../entities/Team"
import { Player } from "../entities/Player"

export const getTournaments = async (tournamentFilterParams: TournamentFilterParams) => {
    const tournaments = await AppDataSource.getRepository(Tournament).find({
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

    switch (tournamentFilterParams.sortBy) {
        case "A-Z":
            tournaments.sort((a, b) => a.name.localeCompare(b.name))
            break
        case "Z-A":
            tournaments.sort((a, b) => b.name.localeCompare(a.name))
            break
        case "StartDate":
            tournaments.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
            break
        case "EndDate":
            tournaments.sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())
            break
        case "Type":
            tournaments.sort((a, b) => a.type.localeCompare(b.type))
            break
        case "Status":
            tournaments.sort((a, b) => a.status.localeCompare(b.status))
            break

        default:
            break
    }

    return tournaments

}

export const getTournamentsByOwner = async (tournamentFilterParams: TournamentFilterParams, id: number) => {
    const tournaments = await AppDataSource.getRepository(Tournament).find({
        where: {
            organizer: { userId: id },
            ...(tournamentFilterParams.name && { name: Like(`%${tournamentFilterParams.name}%`) }),
            ...(tournamentFilterParams.type && { type: tournamentFilterParams.type }),
            ...(tournamentFilterParams.status && { status: tournamentFilterParams.status }),
            ...(tournamentFilterParams.date && { startDate: LessThanOrEqual(tournamentFilterParams.date) }),
            ...(tournamentFilterParams.date && { endDate: MoreThanOrEqual(tournamentFilterParams.date) }),
            ...(tournamentFilterParams.format && { format: tournamentFilterParams.format }),
            ...(tournamentFilterParams.location && { location: Like(`%${tournamentFilterParams.location}%`) }),
        }
    })

    switch (tournamentFilterParams.sortBy) {
        case "A-Z":
            tournaments.sort((a, b) => a.name.localeCompare(b.name))
            break
        case "Z-A":
            tournaments.sort((a, b) => b.name.localeCompare(a.name))
            break
        case "StartDate":
            tournaments.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
            break
        case "EndDate":
            tournaments.sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())
            break
        case "Type":
            tournaments.sort((a, b) => a.type.localeCompare(b.type))
            break
        case "Status":
            tournaments.sort((a, b) => a.status.localeCompare(b.status))
            break

        default:
            break
    }

    return tournaments

}

export const getOneTournamentOverview = async (id: number) => {
    return await AppDataSource.getRepository(Tournament).find({
        where: {
            tournamentId: id
        }
    })
}

export const getLatestMatches = async (id: number) => {
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

export const getUpcomingMatches = async (id: number) => {
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

export const getTournamentStandings = async (id: number) => {
    return await AppDataSource.getRepository(Standing).find({
        where: {
            tournament: { tournamentId: id }
        },
        relations: ["team"]
    })
}

export const getTournamentMatches = async (id: number, type: string) => {
    return await AppDataSource.getRepository(Match).find({
        where: {
            tournament: { tournamentId: id },
            type
        },
        relations: ["firstTeam", "secondTeam", "tournament"]
    })
}

export const getStatsOfPlayers = async (id: number) => {
    return await AppDataSource.getRepository(Scorer).find({
        where: {
            tournament: { tournamentId: id }
        },
        relations: ["player.user"]
    })
}

export const create = async (tournament: Tournament) => {
    return await AppDataSource.getRepository(Tournament).save(tournament)
}

export const getTeams = async (tournamentId: number) => {
    return await AppDataSource.getRepository(Team).find({
        where: {
            tournaments: { tournamentId }
        }
    })
}

export const getPlayers = async (teamId: number) => {
    return await AppDataSource.getRepository(Player).find({
        where: {
            teams: { teamId }
        },
        relations: ["user"]
    })
}

export const getStats = async (tournamentId: number) => {
    return await AppDataSource.getRepository(Scorer).find({
        where: {
            tournament: { tournamentId }
        },
        relations: ["player.user", "player.teams"]
    })
}