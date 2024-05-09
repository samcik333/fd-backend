import { FastifyInstance } from "fastify"
import tournamentRoutes from "./TournamentRoutes"
import MatchRoutes from "./MatchRoutes"
import { getUser, loginRegister, logOut, registerUser } from "../controllers/Auth"
import TeamRoutes from "./TeamRoutes"
import { authorization } from "../middleware/authorization"
import MatchTypeRoutes from "./MatchTypeRoutes";
import PlayerRoutes from "./PlayerRoutes";
export default async (fastify: FastifyInstance) => {
    fastify.register(tournamentRoutes, { prefix: "/tournaments" })
    fastify.register(MatchRoutes, { prefix: "/matches" })
    fastify.register(MatchTypeRoutes, { prefix: "/matchTypes" })
    fastify.register(TeamRoutes, { prefix: "/teams" })
    fastify.register(PlayerRoutes, { prefix: "/teams/:teamId/players" })
    fastify.post('/register', async (request, reply) => {
        return await registerUser(request, reply)
    })
    fastify.post('/login', async (request, reply) => {
        return await loginRegister(request, reply)
    })

    fastify.get('/logout', {
        preHandler: authorization,
        handler: async (request, reply) => {
            return await logOut(request, reply)
        }
    })

    fastify.get('/me', {
        preHandler: authorization,
        handler: async (request, reply) => {
            return await getUser(request, reply)
        }
    })

}

