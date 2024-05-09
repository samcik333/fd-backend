import { Like } from "typeorm"
import { AppDataSource } from "../dataSource"
import { Match } from "../entities/Match"
import { MatchFilterParams } from "../utils/interfaces"

// TODO: Away matches filtering
export const getMatches = async (matchFilterParams: MatchFilterParams) => {
    return await AppDataSource.getRepository(Match).find({
        where: {
            ...(matchFilterParams.tournament && { group: { tournament: { name: Like(`%${matchFilterParams.tournament}%`) } } }),
            ...({ firstTeam: { name: Like(`%${matchFilterParams.team}%`) } } || { secondTeam: { name: Like(`%${matchFilterParams.team}%`) } }),
            ...(matchFilterParams.status && { status: matchFilterParams.status }),
        },
        relations: ["firstTeam", "secondTeam", "group", "group.tournament"]
    })
}

export const getMatchById = async (id: number) => {
    return await AppDataSource.getRepository(Match).findOne({
        where: {
            matchId: id
        },
        relations: [
            "firstTeam",
            "firstTeam.players",
            "secondTeam",
            "secondTeam.players",
            "group",
            "group.tournament",
            "group.tournament.scorers",
            "matchStatFirstTeam",
            "matchStatSecondTeam",
            "events",
            "events.player",
            "events.assist"
        ],
        order: {
            events: {
                matchEventId: "ASC"
            }
        }
    })
}

export const updateMatch = async (id: number, match: Match) => {
    return await AppDataSource.getRepository(Match).update(id, match)
}

export const saveMatch = async (match: Match) => {
    return await AppDataSource.getRepository(Match).save(match)
}

export const insertMatch = async (match: Match) => {
    return await AppDataSource.getRepository(Match).insert(match)
}
