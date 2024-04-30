import { FastifyInstance } from "fastify"
import { getAllMatches } from "../controllers/MatchController"

export default async (fastify: FastifyInstance) => {
    fastify.get('/', async (request, reply) => {
        return await getAllMatches(request)

    })
}