import { FastifyInstance } from "fastify"
import { getAllTournaments, getLatestMatchesOfTournament, getMatchesOfTournament, getStandingsForTournament, getTournament, getTurnamentPlayerStats, getUpcomingMatchesOfTournament } from "../controllers/TournamentController"

export default async (fastify: FastifyInstance) => {
    fastify.get('/', async (request, reply) => {
        return await getAllTournaments(request)
    })
    fastify.get('/:id', async (request, reply) => {
        return await getTournament(request)
    })
    fastify.get('/:id/matches/results', async (request, reply) => {
        return await getLatestMatchesOfTournament(request)
    })
    fastify.get('/:id/matches/upcoming', async (request, reply) => {
        return await getUpcomingMatchesOfTournament(request)
    })
    fastify.get('/:id/standings', async (request, reply) => {
        return await getStandingsForTournament(request)
    })
    fastify.get('/:id/matches', async (request, reply) => {
        return await getMatchesOfTournament(request)
    })
    fastify.get('/:id/playerStats', async (request, reply) => {
        return await getTurnamentPlayerStats(request)
    })

    //post 

    fastify.post('/', async (request, reply) => {

    })
}