import { FastifyRequest } from "fastify"
import { TournamentFilterParams } from "../../utils/interfaces"
import { create, getLatestMatches, getOneTournamentOverview, getPlayers, getStats, getStatsOfPlayers, getTeams, getTournamentMatches, getTournaments, getTournamentsByOwner, getTournamentStandings, getUpcomingMatches } from "../../services/TournamentService"
import { Tournament } from "../../entities/Tournament"
import { getUser, getUserById } from "../../services/userService"
import { AppDataSource } from "../../dataSource"
import { User } from "../../entities/User"

interface TournamentParams {
    id: number
    type: string
    teamId: number
}

interface CreateTournament {
    name: string
    startDate: Date
    endDate: Date
    location: string
    format: "Group" | "Play-off" | "Group+Play-off"
    type: "2v2" | "3v3" | "4v4" | "5v5" | "6v6" | "7v7" | "8v8" | "9v9" | "10v10" | "11v11"
}


export const getAllTournaments = async (request: FastifyRequest) => {
    const filterParams = request.query as TournamentFilterParams
    return await getTournaments(filterParams)
}

export const getOwnerTournaments = async (request: FastifyRequest) => {
    const filterParams = request.query as TournamentFilterParams
    return await getTournamentsByOwner(filterParams, request.body["userId"] as number)
}

export const getTournament = async (request: FastifyRequest) => {
    const { id } = request.params as TournamentParams
    return await getOneTournamentOverview(id)
}

export const getLatestMatchesOfTournament = async (request: FastifyRequest) => {
    const { id } = request.params as TournamentParams
    return await getLatestMatches(id)
}

export const getUpcomingMatchesOfTournament = async (request: FastifyRequest) => {
    const { id } = request.params as TournamentParams
    return await getUpcomingMatches(id)
}

export const getStandingsForTournament = async (request: FastifyRequest) => {
    const { id } = request.params as TournamentParams
    return await getTournamentStandings(id)
}

export const getMatchesOfTournament = async (request: FastifyRequest) => {
    const { id } = request.params as TournamentParams
    const { type } = request.query as TournamentParams
    return await getTournamentMatches(id, type)
}

export const getTurnamentPlayerStats = async (request: FastifyRequest) => {
    const { id } = request.params as TournamentParams
    return await getStatsOfPlayers(id)
}

export const createTournament = async (request: FastifyRequest) => {
    const tournamentData = request.body as Tournament
    const userRepository = AppDataSource.getRepository(User)
    const user = await getUser(request.body["userId"])

    if (!user) {
        throw new Error('User not found')
    }

    tournamentData.organizer = user

    // Save the tournament
    return await create(tournamentData)
}

export const getTournamentTeams = async (request: FastifyRequest) => {
    const { id } = request.params as TournamentParams
    return await getTeams(id)
}

export const getTeamPlayers = async (request: FastifyRequest) => {
    const { teamId } = request.params as TournamentParams
    return await getPlayers(teamId)
}

export const getPlayerStats = async (request: FastifyRequest) => {
    const { id } = request.params as TournamentParams
    return await getStats(id)
}

