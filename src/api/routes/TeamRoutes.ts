import { FastifyInstance } from "fastify"
import {addTeam, getAllTeams, getTeam, getTeamsPlayers, listMyTeams} from "../controllers/TeamController"
import {authorization} from "../middleware/authorization";

export default async (fastify: FastifyInstance) => {
    fastify.get('/home/:homeId/away/:awayId/players', async (request, reply) => {
        return await getTeamsPlayers(request)
    })
    fastify.post('/', {
        preHandler: authorization,
        handler: async (request, reply) => {
            return await addTeam(request, reply)
        }
    })
    fastify.get('/', async (request, reply) => {
        return await getAllTeams(request)
    })
    fastify.get('/my', {
        preHandler: authorization,
        handler: async (request, reply) => {
            return await listMyTeams(request)
        }
    })
    fastify.get('/:id', async (request, reply) => {
        return await getTeam(request)
    })
}
