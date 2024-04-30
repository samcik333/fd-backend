import { FastifyRequest } from "fastify"
import { TournamentFilterParams } from "../../utils/interfaces"
import { getLatestMatches, getOneTournamentOverview, getStatsOfPlayers, getTournamentMatches, getTournaments, getTournamentStandings, getUpcomingMatches } from "../../services/TournamentService"

interface Params {
    id: number
    type: string
}

export const getAllTournaments = async (request: FastifyRequest) => {
    const filterParams = request.query as TournamentFilterParams
    return await getTournaments(filterParams)

}

export const getTournament = async (request: FastifyRequest) => {
    const { id } = request.params as Params
    return await getOneTournamentOverview(id)
}

export const getLatestMatchesOfTournament = async (request: FastifyRequest) => {
    const { id } = request.params as Params
    return await getLatestMatches(id)
}

export const getUpcomingMatchesOfTournament = async (request: FastifyRequest) => {
    const { id } = request.params as Params
    return await getUpcomingMatches(id)
}

export const getStandingsForTournament = async (request: FastifyRequest) => {
    const { id } = request.params as Params
    return await getTournamentStandings(id)
}

export const getMatchesOfTournament = async (request: FastifyRequest) => {
    const { id } = request.params as Params
    const { type } = request.query as Params
    return await getTournamentMatches(id, type)
}

export const getTurnamentPlayerStats = async (request: FastifyRequest) => {
    const { id } = request.params as Params
    return await getStatsOfPlayers(id)
}

