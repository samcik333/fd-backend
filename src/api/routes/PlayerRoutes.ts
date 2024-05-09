import {FastifyInstance} from "fastify";
import {authorization} from "../middleware/authorization";
import {addPlayer} from "../controllers/PlayerController";

export default async (fastify: FastifyInstance) => {
    fastify.post('/', {
        preHandler: authorization,
        handler: async (request, reply) => {
            return await addPlayer(request, reply)
        }
    })
}
