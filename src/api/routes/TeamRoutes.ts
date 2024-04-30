import { FastifyInstance } from "fastify"
import { getTeamsPlayers } from "../controllers/TeamController"

export default async (fastify: FastifyInstance) => {
    fastify.get('/home/:homeId/away/:awayId/players', async (request, reply) => {
        return await getTeamsPlayers(request)
    })
}