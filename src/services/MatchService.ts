import { getAllMatchesByFilter, getMatchById } from "../repositories/MatchRepository"
import { MatchFilterParams } from "../utils/interfaces"

export const getMatches = async (matchFilterParams: MatchFilterParams) => {
    const matches = await getAllMatchesByFilter(matchFilterParams)

    switch (matchFilterParams.sortBy) {
        case "Status":
            matches.sort((a, b) => a.status.localeCompare(b.status))
            break
        default:
            break
    }

    return matches

}

export const getMatch = async (id: number) => {
    return await getMatchById(id)
}
