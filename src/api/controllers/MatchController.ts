import { FastifyRequest } from "fastify"
import { MatchFilterParams } from "../../utils/interfaces"
import { getMatch, getMatches } from "../../services/MatchService"

interface MatchParams {
    id: number
}

export const getAllMatches = async (request: FastifyRequest) => {
    const matchFilterParams = request.query as MatchFilterParams
    return await getMatches(matchFilterParams)
}

export const getMatchOverview = async (request: FastifyRequest) => {
    const { id } = request.params as MatchParams
    return await getMatch(id)
}

