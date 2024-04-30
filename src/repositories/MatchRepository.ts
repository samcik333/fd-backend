import { Like } from "typeorm"
import { AppDataSource } from "../dataSource"
import { MatchFilterParams } from "../utils/interfaces"
import { Match } from "../entities/Match"
import { Team } from "../entities/Team"

export async function getAllMatchesByFilter(matchFilterParams: MatchFilterParams) {

    return await AppDataSource.getRepository(Match).find({
        where: {
            ...(matchFilterParams.tournament && { tournament: { name: Like(`%${matchFilterParams.tournament}%`) } }),
            ...(matchFilterParams.team && { firstTeam: { name: matchFilterParams.team } }),
            ...(matchFilterParams.team && { secondTeam: { name: matchFilterParams.team } }),
            ...(matchFilterParams.status && { status: matchFilterParams.status }),
            ...(matchFilterParams.date && { datetime: matchFilterParams.date })
        },
        relations: ["firstTeam", "secondTeam", "tournament"]
    })
}

export async function getMatchById(id: number) {

    return await AppDataSource.getRepository(Match).find({
        where: {
            matchId: id
        },
        relations: ["matchStatFirstTeam", "matchStatFirstTeam.team", "matchStatSecondTeam", "matchStatSecondTeam.team", "tournament", "events", "events.player.user"]
    })
}