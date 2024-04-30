import { FastifyRequest } from "fastify"
import { MatchFilterParams } from "../../utils/interfaces"
import { getMatch, getMatches } from "../../services/MatchService"
import { getPlayersByTeam } from "../../services/TeamService"

interface TeamParams {
    homeId: number
    awayId: number
}

export const getTeamsPlayers = async (request: FastifyRequest) => {
    const { homeId, awayId } = request.params as TeamParams
    return await getPlayersByTeam(homeId, awayId)
}

