import {FastifyReply, FastifyRequest} from "fastify"
import { MatchFilterParams } from "../../utils/interfaces"
import { getMatchById, getMatches, saveMatch} from "../../services/MatchService"
import {Match} from "../../entities/Match";
import {getTournamentById} from "../../services/TournamentService";
import {getTeamById} from "../../services/TeamService";
import {MatchStat} from "../../entities/MatchStat";

interface MatchParams {
    id: number
}

export const createMatch = async (request: FastifyRequest, reply: FastifyReply) => {
    interface MatchCreateProps {
        tournamentId: number
        datetime: Date // Datetime of the match
        location: string
        firstTeamId: number
        secondTeamId: number
        type: string; // Used spider render
        group: string;
    }

    const { tournamentId, datetime, location, firstTeamId, secondTeamId, type, group } = request.body as MatchCreateProps

    const tournament = await getTournamentById(tournamentId)
    if (!tournament) {
        return reply.code(404).send({ message: "Tournament not found" })
    }

    const firstTeam = await getTeamById(firstTeamId)
    if (!firstTeam) {
        return reply.code(404).send({ message: "First team not found" })
    }

    const secondTeam = await getTeamById(secondTeamId)
    if (!secondTeam) {
        return reply.code(404).send({ message: "Second team not found" })
    }

    const firstTeamMatchStat = new MatchStat()
    firstTeamMatchStat.team = firstTeam

    const secondTeamMatchStat = new MatchStat()
    secondTeamMatchStat.team = secondTeam

    const match = new Match()
    match.datetime = datetime
    match.location = location
    match.firstTeam = firstTeam
    match.secondTeam = secondTeam
    match.type = type
    match.matchStatFirstTeam = firstTeamMatchStat
    match.matchStatSecondTeam = secondTeamMatchStat

    return await saveMatch(match)
}

export const getAllMatches = async (request: FastifyRequest) => {
    const matchFilterParams = request.query as MatchFilterParams
    return await getMatches(matchFilterParams)
}

export const getMatchOverview = async (request: FastifyRequest) => {
    const { id } = request.params as MatchParams
    return await getMatchById(id)
}

