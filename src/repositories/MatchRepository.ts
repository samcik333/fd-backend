import { Like } from "typeorm"
import { AppDataSource } from "../dataSource"
import { MatchFilterParams } from "../utils/interfaces"
import { Match } from "../entities/Match"

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