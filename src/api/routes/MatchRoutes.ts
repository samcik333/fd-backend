import { FastifyInstance } from "fastify"
import {createMatch, getAllMatches, getMatchOverview} from "../controllers/MatchController"
import {authorization} from "../middleware/authorization";

export default async (fastify: FastifyInstance) => {
    fastify.get('/', async (request, reply) => {
        return await getAllMatches(request)
    })
    fastify.get('/:id', async (request, reply) => {
        return await getMatchOverview(request)
    })
    fastify.post('/', {
        preHandler: authorization,
        handler: async (request, reply) => {
            return await createMatch(request, reply)
        }
    })
}
