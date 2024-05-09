import {MatchEvent} from "../entities/MatchEvent";
import {AppDataSource} from "../dataSource";

export const saveMatchEvent = async (matchEvent: MatchEvent) => {
    return await AppDataSource.getRepository(MatchEvent).save(matchEvent)
}
