import { FastifyRequest } from "fastify"
import { MatchFilterParams } from "../../utils/interfaces"
import { getMatches } from "../../services/MatchService"

export const getAllMatches = async (request: FastifyRequest) => {
    const matchFilterParams = request.query as MatchFilterParams
    return await getMatches(matchFilterParams)
}

