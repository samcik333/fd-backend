import { getAllMatchesByFilter, getMatchById } from "../repositories/MatchRepository"
import { getPlayers } from "../repositories/TeamRepository"

export const getPlayersByTeam = async (homeId: number, awayId: number) => {
    return await getPlayers(homeId, awayId)
}