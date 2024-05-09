import {MatchStat} from "../entities/MatchStat";
import {AppDataSource} from "../dataSource";

export const saveMatchStat = async (matchStat: MatchStat) => {
    return await AppDataSource.getRepository(MatchStat).save(matchStat)
}

export const insertMatchStat = async (matchStat: MatchStat) => {
    return await AppDataSource.getRepository(MatchStat).insert(matchStat)
}

export const updateMatchStat = async (matchStat: MatchStat) => {
    return await AppDataSource.getRepository(MatchStat).update(matchStat.matchStatId, matchStat)
}
