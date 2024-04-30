import { FastifyRequest } from "fastify"
import { TournamentFilterParams } from "../utils/interfaces"
import { getAllTournamentsByFilter, getMatches, getOneTournament, getPlayerStats, getResults, getStandings, getUpcoming } from "../repositories/TournamentRepository"

export const getTournaments = async (tournamentFilterParams: TournamentFilterParams) => {
    const tournaments = await getAllTournamentsByFilter(tournamentFilterParams)

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
    return await getOneTournament(id)
}

export const getLatestMatches = async (id: number) => {
    return await getResults(id)
}

export const getUpcomingMatches = async (id: number) => {
    return await getUpcoming(id)
}

export const getTournamentStandings = async (id: number) => {
    return await getStandings(id)
}

export const getTournamentMatches = async (id: number, type: string) => {
    return await getMatches(id, type)
}

export const getStatsOfPlayers = async (id: number) => {
    return await getPlayerStats(id)
}