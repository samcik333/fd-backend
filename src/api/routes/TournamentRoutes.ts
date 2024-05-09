import { FastifyInstance } from "fastify"
import {
    addTeamToTournament,
    createTournament,
    getAllTournaments,
    getLatestMatchesOfTournament,
    getMatchesOfTournament,
    getOwnerTournaments,
    getPlayerStats,
    getStandingsForTournament,
    getTeamPlayers,
    getTournament,
    getTournamentTeams,
    getTurnamentPlayerStats,
    getUpcomingMatchesOfTournament, removeTeamFromTournament, startTournament
} from "../controllers/TournamentController"
import { authorization } from "../middleware/authorization"

export default async (fastify: FastifyInstance) => {
    fastify.get('/', async (request, reply) => {
        return await getAllTournaments(request)
    })
    fastify.get('/own', {
        preHandler: authorization,
        handler: async (request, reply) => {
            return await getOwnerTournaments(request)
        }
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
    fastify.post('/create', {
        preHandler: authorization,
        handler: async (request, reply) => {
            return await createTournament(request, reply)
        }
    })
    fastify.get('/:id/teams', async (request, reply) => {
        return await getTournamentTeams(request)
    })
    fastify.get('/teams/:teamId/players', async (request, reply) => {
        return await getTeamPlayers(request)
    })
    fastify.get('/:id/stats', async (request, reply) => {
        return await getPlayerStats(request)
    })
    fastify.post('/:id/teams/:teamId', {
        preHandler: authorization,
        handler: async (request, reply) => {
            return await addTeamToTournament(request, reply)
        }
    })
    fastify.delete('/:id/teams/:teamId', {
        preHandler: authorization,
        handler: async (request, reply) => {
            return await removeTeamFromTournament(request, reply)
        }
    })
    fastify.post('/:id/startTournament', {
        preHandler: authorization,
        handler: async (request, reply) => {
            return await startTournament(request, reply)
        }
    })
}
