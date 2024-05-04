import { Like } from "typeorm"
import { AppDataSource } from "../dataSource"
import { Match } from "../entities/Match"
import { MatchFilterParams } from "../utils/interfaces"

export const getMatches = async (matchFilterParams: MatchFilterParams) => {
    return await AppDataSource.getRepository(Match).find({
        where: {
            ...(matchFilterParams.tournament && { tournament: { name: Like(`%${matchFilterParams.tournament}%`) } }),
            ...({ firstTeam: { name: Like(`%${matchFilterParams.team}%`) } } || { secondTeam: { name: Like(`%${matchFilterParams.team}%`) } }),
            ...(matchFilterParams.status && { status: matchFilterParams.status }),

        },
        relations: ["firstTeam", "secondTeam", "tournament"]
    })

}

export const getMatch = async (id: number) => {
    return await AppDataSource.getRepository(Match).find({
        where: {
            matchId: id
        },
        relations: ["matchStatFirstTeam.team.players.user", "matchStatSecondTeam.team.players.user", "tournament", "events.player.user", "events.player.teams"]
    })
}
