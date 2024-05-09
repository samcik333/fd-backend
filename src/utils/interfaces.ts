import {MatchStatus} from "../entities/Match";

export interface MatchFilterParams {
    tournament: string
    team: string
    status: MatchStatus
    date: Date
}

export interface TournamentFilterParams {
    sortBy: string
    name: string
    type: "2v2" | "3v3" | "4v4" | "5v5" | "6v6" | "7v7" | "8v8" | "9v9" | "10v10" | "11v11"
    status: "finished" | "ongoing" | "upcoming"
    date: Date
    format: "Group" | "Play-off" | "Group+Play-off"
    location: string
}
