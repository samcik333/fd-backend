import { FastifyInstance } from "fastify"
import { getAllMatches, getMatchOverview } from "../controllers/MatchController"

export default async (fastify: FastifyInstance) => {
    fastify.get('/', async (request, reply) => {
        return await getAllMatches(request)

    })
    fastify.get('/:id', async (request, reply) => {
        return await getMatchOverview(request)
    })
}