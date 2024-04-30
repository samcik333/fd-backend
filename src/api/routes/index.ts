import { FastifyInstance } from "fastify"
import tournamentRoutes from "./TournamentRoutes"
import MatchRoutes from "./MatchRoutes"
import { registerUser } from "../controllers/Auth"
import TeamRoutes from "./TeamRoutes"
export default async (fastify: FastifyInstance) => {
    fastify.register(tournamentRoutes, { prefix: "/tournaments" })
    fastify.register(MatchRoutes, { prefix: "/matches" })
    fastify.register(TeamRoutes, { prefix: "/teams" })
    fastify.post('/register', async (request, reply) => {
        return await registerUser(request, reply)
    })

}

