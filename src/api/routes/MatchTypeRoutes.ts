import {FastifyInstance} from "fastify";
import {addEvent} from "../controllers/MatchEventController";
import {authorization} from "../middleware/authorization";

export default async (fastify: FastifyInstance) => {
    fastify.post('/', {
        preHandler: authorization,
        handler: async (request, reply) => {
            return await addEvent(request, reply)
        }
    })
}
