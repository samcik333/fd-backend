import { FastifyReply, FastifyRequest } from "fastify"
import { TournamentFilterParams } from "../../utils/interfaces"
import {
    create,
    getLatestMatches,
    getOneTournamentOverview,
    getPlayers,
    getStats,
    getStatsOfPlayers,
    getTeams,
    getTournamentById,
    getTournamentMatches,
    getTournaments,
    getTournamentsByOwner,
    getTournamentStandings,
    getUpcomingMatches
} from "../../services/TournamentService"
import { Tournament } from "../../entities/Tournament"
import { getUser } from "../../services/userService"
import { getTeamById } from "../../services/TeamService"
import { Group } from "../../entities/Group"
import { getGroupById, insertGroup, saveGroup } from "../../services/GroupService"
import { Match } from "../../entities/Match"
import { saveMatch } from "../../services/MatchService"
import { MatchStat } from "../../entities/MatchStat"
import { saveMatchStat } from "../../services/MatchStatService"
import { Standing } from "../../entities/Standing"
import { saveStanding } from "../../services/StandingService"
import { addMinutes } from "date-fns"
import {MultipartFile, MultipartValue} from "@fastify/multipart";
import {uploadTournamentLogo} from "../../uploadHandler";

interface TournamentParams {
    id: number
    type: string
    teamId: number
}

interface CreateTournamentFormData {
    name: MultipartValue<string>
    startDate: MultipartValue<string>
    endDate: MultipartValue<string>
    location: MultipartValue<string> | undefined
    format: MultipartValue<"Group" | "Play-off" | "Group+Play-off">
    type: MultipartValue<"2v2" | "3v3" | "4v4" | "5v5" | "6v6" | "7v7" | "8v8" | "9v9" | "10v10" | "11v11">
    numOfGroups: MultipartValue<string>
    numOfTeams: MultipartValue<string>
    numOfAdvanced: MultipartValue<string>
    numOfPlayOffTeams: MultipartValue<'32' | '16' | '8' | '4' | '2'>
    logo: MultipartFile
}

export const getAllTournaments = async (request: FastifyRequest) => {
    const filterParams = request.query as TournamentFilterParams
    return await getTournaments(filterParams)
}

export const getOwnerTournaments = async (request: FastifyRequest) => {
    const filterParams = request.query as TournamentFilterParams
    return await getTournamentsByOwner(filterParams, request.body["userId"] as number)
}

export const getTournament = async (request: FastifyRequest) => {
    const { id } = request.params as TournamentParams
    return await getOneTournamentOverview(id)
}

export const getLatestMatchesOfTournament = async (request: FastifyRequest) => {
    const { id } = request.params as TournamentParams
    return await getLatestMatches(id)
}

export const getUpcomingMatchesOfTournament = async (request: FastifyRequest) => {
    const { id } = request.params as TournamentParams
    return await getUpcomingMatches(id)
}

export const getStandingsForTournament = async (request: FastifyRequest) => {
    const { id } = request.params as TournamentParams
    return await getTournamentStandings(id)
}

export const getMatchesOfTournament = async (request: FastifyRequest) => {
    const { id } = request.params as TournamentParams
    const { type } = request.query as TournamentParams
    return await getTournamentMatches(id, type)
}

export const getTurnamentPlayerStats = async (request: FastifyRequest) => {
    const { id } = request.params as TournamentParams
    return await getStatsOfPlayers(id)
}

export const createTournament = async (request: FastifyRequest, reply: FastifyReply) => {
    const user = await getUser(request.body["userId"])
    if (!user) {
        return reply.code(404).send({ message: 'User not found' })
    }

    const { name, startDate, endDate, location, format, type, numOfGroups, numOfTeams, numOfAdvanced, numOfPlayOffTeams, logo} = request.body as CreateTournamentFormData
    const tournament = new Tournament()
    tournament.name = name.value
    tournament.startDate = new Date(startDate.value)
    tournament.endDate = new Date(endDate.value)
    tournament.location = location?.value
    tournament.format = format.value
    tournament.type = type.value
    tournament.organizer = user
    tournament.groups = []

    const _numOfTeams = numOfTeams ? parseInt(numOfTeams.value) : undefined
    const _numOfGroups = numOfGroups ? parseInt(numOfGroups.value) : undefined
    const _numOfAdvanced = numOfAdvanced ? parseInt(numOfAdvanced.value) : undefined
    const _numOfPlayOffTeams = numOfPlayOffTeams ? parseInt(numOfPlayOffTeams.value) as 32 | 16 | 8 | 4 | 2 : undefined

    if (format.value === "Group") {
        tournament.numOfTeams = _numOfTeams
        tournament.numOfGroups = _numOfGroups
        if (_numOfTeams % _numOfGroups !== 0) {
            return reply.code(400).send({ message: 'Number of teams must be divisible by number of groups' })
        }
        tournament.numOfTeamsInGroup = _numOfTeams / _numOfGroups
    } else if (format.value === "Play-off") {
        tournament.numberOfPlayOffTeams = _numOfPlayOffTeams
    } else if (format.value === "Group+Play-off") {
        tournament.numOfTeams = _numOfTeams
        tournament.numOfGroups = _numOfGroups
        if (_numOfTeams % _numOfGroups !== 0) {
            return reply.code(400).send({ message: 'Number of teams must be divisible by number of groups' })
        }
        tournament.numOfTeamsInGroup = _numOfTeams / _numOfGroups
        tournament.numOfAdvanced = _numOfAdvanced
    } else {
        return reply.code(400).send({ message: 'Invalid format' })
    }

    if (logo) {
        try {
            tournament.logo = await uploadTournamentLogo(logo, name.value as string)
        } catch (error) {
            console.error('Error during file upload:', error)
            return reply.code(500).send({ error: 'Error during file upload' })
        }
    }

    const tournamentNew = await create(tournament)

    if (format.value === "Group") {
        for (let i = 0; i < _numOfGroups; i++) {
            const group = new Group()
            group.name = `Group ${i + 1}`
            group.round = 1
            group.teams = []
            group.matches = []
            group.tournament = tournamentNew
            await insertGroup(group)
        }
    }

    if (tournament.format === "Play-off") {
        // Generate spider bracket
        let genNumOfGroups = tournament.numberOfPlayOffTeams
        let colIndex = 0
        while (genNumOfGroups > 1) {
            for (let i = 1; i < genNumOfGroups + 1; i++) {
                const homeTeamIndex = genNumOfGroups - i
                const awayTeamIndex = i - 1
                if (awayTeamIndex > homeTeamIndex) {
                    break
                }

                const group = new Group()
                group.name = `Group ${colIndex}|${awayTeamIndex}|${homeTeamIndex}`
                group.homeTeamIndex = homeTeamIndex
                group.awayTeamIndex = awayTeamIndex
                group.tournament = tournament
                group.colIndex = colIndex
                await insertGroup(group)
            }

            colIndex++
            genNumOfGroups /= 2
        }
    }

    return tournamentNew
}

export const getTournamentTeams = async (request: FastifyRequest) => {
    const { id } = request.params as TournamentParams
    return await getTeams(id)
}

export const getTeamPlayers = async (request: FastifyRequest) => {
    const { teamId } = request.params as TournamentParams
    return await getPlayers(teamId)
}

export const getPlayerStats = async (request: FastifyRequest) => {
    const { id } = request.params as TournamentParams
    return await getStats(id)
}


interface TeamTournament {
    teamId: string
    id: string
}

interface TeamBody {
    groupId: number
    homeAwayTeamIndex: number | undefined
}

export const addTeamToTournament = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id, teamId } = request.params as TeamTournament
    const { groupId, homeAwayTeamIndex } = request.body as TeamBody

    const tournamentId = parseInt(id)
    const _teamId = parseInt(teamId)

    const tournament = await getTournamentById(tournamentId)
    if (!tournament) {
        return reply.code(404).send({ message: 'Tournament not found' })
    }

    if (tournament.status !== "upcoming") {
        return reply.code(400).send({ message: 'Tournament is ongoing' })
    }

    const team = await getTeamById(_teamId)
    if (!team) {
        return reply.code(404).send({ message: 'Team not found' })
    }

    const group = await getGroupById(groupId)
    if (!group || group.tournament.tournamentId !== tournamentId) {
        return reply.code(404).send({ message: 'Group not found' })
    }

    if (tournament.format === "Play-off") {
        if (homeAwayTeamIndex === group.homeTeamIndex) {
            if (group.homeTeam != null) {
                return reply.code(400).send({ message: 'Home team already exists in group' })
            }
            if (group.awayTeam && group.awayTeam.teamId === _teamId) {
                return reply.code(400).send({ message: 'Team already exists in group' })
            }
            group.homeTeam = team
            await saveGroup(group)
        } else if (homeAwayTeamIndex === group.awayTeamIndex) {
            if (group.awayTeam != null) {
                return reply.code(400).send({ message: 'Away team already exists in group' })
            }
            if (group.homeTeam && group.homeTeam.teamId === _teamId) {
                return reply.code(400).send({ message: 'Team already exists in group' })
            }
            group.awayTeam = team
            await saveGroup(group)
        } else {
            return reply.code(400).send({ message: 'Invalid home/away index' })
        }
        return getTournamentById(tournamentId)
    }

    if (group.teams.length >= tournament.numOfTeamsInGroup) {
        return reply.code(400).send({ message: 'Group is full' })
    }

    const teamIndex = group.teams.findIndex(t => t.teamId === _teamId)
    if (teamIndex !== -1) {
        return reply.code(400).send({ message: 'Team already exists in group' })
    }

    group.teams.push(team)
    await saveGroup(group)
    return getTournamentById(tournamentId)
}

export const removeTeamFromTournament = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id, teamId } = request.params as TeamTournament
    const { groupId, homeAwayTeamIndex } = request.body as TeamBody

    const tournamentId = parseInt(id)
    const _teamId = parseInt(teamId)

    const tournament = await getTournamentById(tournamentId)
    if (!tournament) {
        return reply.code(404).send({ message: 'Tournament not found' })
    }

    if (tournament.status !== "upcoming") {
        return reply.code(400).send({ message: 'Tournament is ongoing' })
    }

    const team = await getTeamById(_teamId)
    if (!team) {
        return reply.code(404).send({ message: 'Team not found' })
    }

    const group = await getGroupById(groupId)
    if (!group || group.tournament.tournamentId !== tournamentId) {
        return reply.code(404).send({ message: 'Group not found' })
    }

    if (tournament.format === "Play-off") {
        if (homeAwayTeamIndex === group.homeTeamIndex) {
            if (group.homeTeam == null) {
                return reply.code(400).send({ message: 'Home team does not exist in group' })
            }
            group.homeTeam = null
            await saveGroup(group)
        } else if (homeAwayTeamIndex === group.awayTeamIndex) {
            if (group.awayTeam == null) {
                return reply.code(400).send({ message: 'Away team does not exist in group' })
            }
            group.awayTeam = null
            await saveGroup(group)
        } else {
            return reply.code(400).send({ message: 'Invalid home/away index' })
        }
        return getTournamentById(tournamentId)
    }

    const teamIndex = group.teams.findIndex(t => t.teamId === _teamId)
    if (teamIndex === -1) {
        return reply.code(400).send({ message: 'Team does not exist in group' })
    }

    group.teams.splice(teamIndex, 1)
    await saveGroup(group)
    return getTournamentById(tournamentId)
}

export const startTournament = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as TeamTournament
    const tournamentId = parseInt(id)

    const tournament = await getTournamentById(tournamentId)
    if (!tournament) {
        return reply.code(404).send({ message: 'Tournament not found' })
    }

    if (tournament.status !== "upcoming") {
        return reply.code(400).send({ message: 'Cant start tournament' })
    }

    if (tournament.format === "Group") {
        const teamsFilledIn = tournament.groups.every((g) => g.teams.length === tournament.numOfTeamsInGroup)
        if (!teamsFilledIn) {
            return reply.code(400).send({ message: 'Not all groups are filled in' })
        }

        tournament.status = "ongoing"

        const matchDuration = 90 // match duration in minutes
        const halftimeBreak = 15 // halftime break in minutes
        const betweenMatchGap = 30 // gap between matches in minutes
        const totalMatchTime = matchDuration + halftimeBreak + betweenMatchGap

        let currentTime = new Date(tournament.startDate)

        // Generate matches
        for (const group of tournament.groups) {
            const teams = group.teams

            for (let i = 0; i < teams.length; i++) {
                const standing = new Standing()
                standing.tournament = tournament
                standing.group = group.name
                standing.position = i + 1 //TODO prepracovať, position sa bude iba na frontende vypisovať
                standing.team = teams[i]
                await saveStanding(standing)

                for (let j = i + 1; j < teams.length; j++) {
                    // Create match
                    const match = new Match()
                    match.datetime = new Date(currentTime)
                    match.location = tournament.location
                    match.firstTeam = teams[i]
                    match.secondTeam = teams[j]
                    match.type = `${j}.Round`

                    const statFirstTeam = new MatchStat()
                    statFirstTeam.team = teams[i]
                    match.matchStatFirstTeam = await saveMatchStat(statFirstTeam)
                    const statSecondTeam = new MatchStat()
                    statSecondTeam.team = teams[j]
                    match.matchStatSecondTeam = await saveMatchStat(statSecondTeam)
                    group.matches.push(await saveMatch(match))

                    currentTime = addMinutes(currentTime, totalMatchTime)
                }
            }
            await saveGroup(group)
        }
        return await create(tournament)
    }

    if (tournament.format === "Play-off") {
        // Check if all groups are filled in first column of spider
        const firstColGroups = tournament.groups.filter(g => g.colIndex === 0)
        const groupsFilled = firstColGroups.every((g) => g.homeTeam != null && g.awayTeam != null)
        if (!groupsFilled) {
            return reply.code(400).send({ message: 'Not all groups are filled in' })
        }

        const matchStartDiff = 125 // minutes
        let currentTime = new Date(tournament.startDate)

        for (const group of firstColGroups) {
            const match = new Match()
            match.datetime = currentTime
            match.firstTeam = group.homeTeam
            match.secondTeam = group.awayTeam
            match.location = tournament.location
            match.type = "Play-off"

            const statFirstTeam = new MatchStat()
            statFirstTeam.team = group.homeTeam
            match.matchStatFirstTeam = await saveMatchStat(statFirstTeam)
            const statSecondTeam = new MatchStat()
            statSecondTeam.team = group.awayTeam
            match.matchStatSecondTeam = await saveMatchStat(statSecondTeam)

            group.matches.push(await saveMatch(match))
            await saveGroup(group)

            currentTime = addMinutes(new Date(currentTime), matchStartDiff)
        }


        tournament.status = "ongoing"
        return await create(tournament)
    }
}
