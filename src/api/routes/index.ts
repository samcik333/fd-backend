import { FastifyInstance } from "fastify"
import tournamentRoutes from "./TournamentRoutes"
import MatchRoutes from "./MatchRoutes"
import { registerUser } from "../controllers/Auth"
export default async (fastify: FastifyInstance) => {
    fastify.register(tournamentRoutes, { prefix: "/tournaments" })
    fastify.register(MatchRoutes, { prefix: "/matches" })
    fastify.post('/register', async (request, reply) => {
        return await registerUser(request, reply)
    })
}

