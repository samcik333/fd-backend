import {Scorer} from "../entities/Scorer";
import {AppDataSource} from "../dataSource";

export const saveScorer = async (scorer: Scorer) => {
    return await AppDataSource.getRepository(Scorer).save(scorer)
}

export const updateScorer = async (scorer: Scorer) => {
    return await AppDataSource.getRepository(Scorer).update(scorer.scorerId, scorer)
}
