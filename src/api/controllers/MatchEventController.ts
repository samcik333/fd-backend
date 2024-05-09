import {FastifyReply, FastifyRequest} from "fastify";
import {eventType, MatchEvent} from "../../entities/MatchEvent";
import {getMatchById, saveMatch} from "../../services/MatchService";
import {getPlayer} from "../../services/PlayerService";
import {Scorer} from "../../entities/Scorer";
import {Match, MatchStatus} from "../../entities/Match";
import {Player} from "../../entities/Player";
import {saveMatchEvent} from "../../services/MatchEventService";
import {saveMatchStat, updateMatchStat} from "../../services/MatchStatService";
import {saveScorer, updateScorer} from "../../services/ScorerService";
import {getStanding, saveStanding} from "../../services/StandingService";
import {create, getTournamentById} from "../../services/TournamentService";
import {saveGroup} from "../../services/GroupService";
import {addMinutes} from "date-fns";
import {MatchStat} from "../../entities/MatchStat";
import {Tournament} from "../../entities/Tournament";

export interface MatchEventSaveProps {
    matchId: number
    teamId?: number
    playerId?: number
    assistId?: number;
    type: eventType;
}

const liveMatchStatuses = [MatchStatus.firstHalf, MatchStatus.secondHalf, MatchStatus.firstExtraHalf, MatchStatus.secondExtraHalf, MatchStatus.penalty];
const liveMatchEvents = [eventType.Shot, eventType.ShotOnGoal, eventType.Goal, eventType.yellowCard, eventType.redCard, eventType.FreeKick, eventType.Foul, eventType.Offside, eventType.PenaltyGoal, eventType.PenaltyMiss];
const matchEventsPlayerRequired = [eventType.Goal, eventType.yellowCard, eventType.redCard, eventType.PenaltyGoal, eventType.PenaltyMiss];

export const addEvent = async (request: FastifyRequest, reply: FastifyReply) => {
    const {matchId, teamId, playerId, assistId, type} = request.body as MatchEventSaveProps
    const match = await getMatchById(matchId)

    if (!match) {
        return reply.code(404).send({message: 'Match not found'})
    }

    let player = undefined
    if (playerId !== undefined) {
        player = await getPlayer(playerId)
        if (player === undefined) {
            return reply.code(404).send({message: 'Player not found'})
        }

        const hasRedCard = match.events.filter(e => e.player).findIndex(e => e.player.playerId === playerId && e.type === eventType.redCard);
        if (hasRedCard !== -1) {
            return reply.code(400).send({message: 'Player has red card. Cannot play'})
        }
    }

    let assist = undefined
    if (assistId !== undefined) {
        assist = await getPlayer(assistId)
        if (assist === undefined) {
            return reply.code(404).send({message: 'Assist player not found'})
        }
        const hasRedCard = match.events.filter(e => e.player).findIndex(e => e.player.playerId === assistId && e.type === eventType.redCard);
        if (hasRedCard !== -1) {
            return reply.code(400).send({message: 'Assist player has red card. Cannot play'})
        }
    }

    if (match.status === MatchStatus.finished) {
        return reply.code(400).send({message: 'Match is already finished'})
    }

    if (match.events.length === 0 && type !== eventType.StartFirstHalf) {
        return reply.code(400).send({message: 'The first event need to be startFirstHalf.'})
    }

    if (liveMatchEvents.includes(type)) {
        if (!liveMatchStatuses.includes(match.status)) {
            return reply.code(400).send({message: 'Match is not live'})
        }

        if (teamId === undefined) {
            return reply.code(400).send({message: 'TeamId is required for this event type'})
        }
    }

    if (matchEventsPlayerRequired.includes(type)) {
        if (player === undefined) {
            return reply.code(400).send({message: 'Player is required for this event type'})
        }
        if (playerId === assistId) {
            return reply.code(400).send({message: 'Player cannot assist himself'})
        }
    }

    const event = new MatchEvent()
    event.player = player
    event.time = new Date()
    event.type = type
    event.assist = assist

    switch (type) {
        /**
         * Needs to be first event in the match
         */
        case eventType.StartFirstHalf:
            if (match.status !== MatchStatus.upcoming) {
                return reply.code(400).send({message: 'Match is not upcoming. Cannot start first half'})
            }

            match.status = MatchStatus.firstHalf
            break
        /**
         * Needs to be last event in the first half
         */
        case eventType.stopFirstHalf:
            if (match.status !== MatchStatus.firstHalf) {
                return reply.code(400).send({message: 'Match is not in first half. Cannot stop first half'})
            }
            match.status = MatchStatus.halfTime
            break
        case eventType.StartSecondHalf:
            if (match.status !== MatchStatus.halfTime) {
                return reply.code(400).send({message: 'Match is not in half time. Cannot start second half'})
            }
            match.status = MatchStatus.secondHalf
            break
        case eventType.stopSecondHalf:
            if (match.status !== MatchStatus.secondHalf) {
                return reply.code(400).send({message: 'Match is not in second half. Cannot stop second half'})
            }

            if (match.group.tournament.format === "Play-off") {
                if (match.scoreFirstTeam === match.scoreSecondTeam) {
                    match.status = MatchStatus.overTime
                } else {
                    // Finish the match
                    match.status = MatchStatus.finished
                    try {
                        await handleFinishGame(match)
                    } catch (e) {
                        console.error(e)
                        return reply.code(500).send({message: 'Error while finishing the game'})
                    }
                }
            } else if (match.group.tournament.format === "Group") {
                match.status = MatchStatus.finished
                try {
                    await handleFinishGame(match)
                } catch (e) {
                    console.error(e)
                    return reply.code(500).send({message: 'Error while finishing the game'})
                }
            } else if (match.group.tournament.format === "Group+Play-off") {
                throw new Error("Not implemented")
            }

            break

        case eventType.startFirstExtraHalf:
            if (match.status !== MatchStatus.overTime) {
                return reply.code(400).send({message: 'Match is not in overt time. Cannot start first extra half'})
            }
            match.status = MatchStatus.firstExtraHalf
            break
        case eventType.stopFirstExtraHalf:
            if (match.status !== MatchStatus.firstExtraHalf) {
                return reply.code(400).send({message: 'Match is not in first extra half. Cannot stop first extra half'})
            }
            match.status = MatchStatus.halfExtraTime
            break
        case eventType.StartSecondExtraHalf:
            if (match.status !== MatchStatus.halfExtraTime) {
                return reply.code(400).send({message: 'Match is not in half extra time. Cannot start second extra half'})
            }
            match.status = MatchStatus.secondExtraHalf
            break
        case eventType.StopSecondExtraHalf:
            if (match.status !== MatchStatus.secondExtraHalf) {
                return reply.code(400).send({message: 'Match is not in second extra half. Cannot stop second extra half'})
            }

            if (match.scoreFirstTeam === match.scoreSecondTeam) {
                match.status = MatchStatus.penalty
            } else {
                match.status = MatchStatus.finished
            }
            break

        case eventType.StopPenalty:
            if (match.status !== MatchStatus.penalty) {
                return reply.code(400).send({message: 'Match is not in penalty. Cannot stop penalty'})
            }

            if (match.scoreFirstTeam === match.scoreSecondTeam) {
                return reply.code(400).send({message: 'Match is still draw. Cannot stop penalty'})
            }

            match.status = MatchStatus.finished
            break

        case eventType.PenaltyMiss:
            if (match.status !== MatchStatus.penalty) {
                return reply.code(400).send({message: 'Match is not in penalty. Cannot miss penalty'})
            }
            break

        case eventType.PenaltyGoal:
            if (match.status !== MatchStatus.penalty) {
                return reply.code(400).send({message: 'Match is not in penalty. Cannot miss penalty'})
            }
            break

        case eventType.Shot:
            if (match.firstTeam.teamId === teamId) {
                match.matchStatFirstTeam.totalShots += 1
                await updateMatchStat(match.matchStatFirstTeam)
            } else if (match.secondTeam.teamId === teamId) {
                match.matchStatSecondTeam.totalShots += 1
                await updateMatchStat(match.matchStatSecondTeam)
            } else {
                return reply.code(404).send({message: 'Team not found in match'})
            }
            break
        case eventType.ShotOnGoal:
            if (match.firstTeam.teamId === teamId) {
                match.matchStatFirstTeam.shotsOnGoal += 1
                match.matchStatFirstTeam.totalShots += 1
                await updateMatchStat(match.matchStatFirstTeam)
            } else if (match.secondTeam.teamId === teamId) {
                match.matchStatSecondTeam.shotsOnGoal += 1
                match.matchStatSecondTeam.totalShots += 1
                await updateMatchStat(match.matchStatSecondTeam)
            } else {
                return reply.code(404).send({message: 'Team not found in match'})
            }
            break
        case eventType.Goal:
            if (match.firstTeam.teamId === teamId) {
                match.scoreFirstTeam += 1
            } else if (match.secondTeam.teamId === teamId) {
                match.scoreSecondTeam += 1
            } else {
                return reply.code(404).send({message: 'Team not found in match'})
            }
            await handleEventForScorer(match, player, assist, type)
            break
        /**
         * Yellow card event, when player gets second yellow card, it automatically adds red card event
         */
        case eventType.yellowCard:
            const hasYellowCard = match.events.filter(e => e.player).findIndex(e => e.player.playerId === playerId && e.type === eventType.yellowCard);

            if (match.firstTeam.teamId === teamId) {
                match.matchStatFirstTeam.yellowCards += 1
                match.matchStatFirstTeam.redCards += hasYellowCard === -1 ? 0 : 1
                await updateMatchStat(match.matchStatFirstTeam)
            } else if (match.secondTeam.teamId === teamId) {
                match.matchStatSecondTeam.yellowCards += 1
                match.matchStatSecondTeam.redCards += hasYellowCard === -1 ? 0 : 1
                await updateMatchStat(match.matchStatSecondTeam)
            } else {
                return reply.code(404).send({message: 'Team not found in match'})
            }
            await handleEventForScorer(match, player, undefined, type)
            if (hasYellowCard !== -1) {
                await handleEventForScorer(match, player, undefined, eventType.redCard)
            }
            break
        case eventType.redCard:
            if (match.firstTeam.teamId === teamId) {
                match.matchStatFirstTeam.redCards += 1
                await updateMatchStat(match.matchStatFirstTeam)
            } else if (match.secondTeam.teamId === teamId) {
                match.matchStatSecondTeam.redCards += 1
                await updateMatchStat(match.matchStatSecondTeam)
            } else {
                return reply.code(404).send({message: 'Team not found in match'})
            }
            break

        case eventType.FreeKick:
            if (match.firstTeam.teamId === teamId) {
                match.matchStatFirstTeam.freeKicks += 1
                await updateMatchStat(match.matchStatFirstTeam)
            } else if (match.secondTeam.teamId === teamId) {
                match.matchStatSecondTeam.freeKicks += 1
                await updateMatchStat(match.matchStatSecondTeam)
            } else {
                return reply.code(404).send({message: 'Team not found in match'})
            }
            break;
        case eventType.Foul:
            if (match.firstTeam.teamId === teamId) {
                match.matchStatFirstTeam.fouls += 1
                await updateMatchStat(match.matchStatFirstTeam)
            } else if (match.secondTeam.teamId === teamId) {
                match.matchStatSecondTeam.fouls += 1
                await updateMatchStat(match.matchStatSecondTeam)
            } else {
                return reply.code(404).send({message: 'Team not found in match'})
            }
            break;
        case eventType.Offside:
            if (match.firstTeam.teamId === teamId) {
                match.matchStatFirstTeam.offsides += 1
                await updateMatchStat(match.matchStatFirstTeam)
            } else if (match.secondTeam.teamId === teamId) {
                match.matchStatSecondTeam.offsides += 1
                await updateMatchStat(match.matchStatSecondTeam)
            } else {
                return reply.code(404).send({message: 'Team not found in match'})
            }
            break;
        default:
            // Do nothing
    }

    event.status = match.status

    /**
     * Yellow card event, when player gets second yellow card, it automatically adds red card event
     */
    if (type === eventType.yellowCard) {
        const hasYellowCard = match.events.filter(e => e.player).findIndex(e => e.player.playerId === playerId && e.type === eventType.yellowCard);
        if (hasYellowCard !== -1) {
            const redCardEvent = new MatchEvent()
            redCardEvent.player = player
            redCardEvent.time = new Date()
            redCardEvent.type = eventType.redCard
            redCardEvent.assist = assist
            redCardEvent.status = match.status
            match.events.push(await saveMatchEvent(event))
            match.events.push(await saveMatchEvent(redCardEvent))
            return await saveMatch(match)
        }
    }

    match.events.push(await saveMatchEvent(event))
    return await saveMatch(match)
}

async function handleEventForScorer(match: Match, player: Player, assister: Player | undefined, type: eventType) {
    const tournament = await getTournamentById(match.group.tournament.tournamentId)
    if (!tournament) {
        throw new Error("Tournament not found")
    }

    const scorer = tournament.scorers.find(s => s.player.playerId === player.playerId)

    switch (type) {
        case eventType.Goal:
            if (!scorer) {
                const newScorer = new Scorer()
                newScorer.player = player
                newScorer.goals = 1
                tournament.scorers.push(await saveScorer(newScorer))
                await create(tournament)
            } else {
                scorer.goals += 1
                await updateScorer(scorer)
            }

            if (assister) {
                const assistScorer = tournament.scorers.find(s => s.player.playerId === assister.playerId)
                if (!assistScorer) {
                    const newScorer = new Scorer()
                    newScorer.player = assister
                    newScorer.assists = 1
                    tournament.scorers.push(await saveScorer(newScorer))
                    await create(tournament)
                } else {
                    assistScorer.assists += 1
                    await updateScorer(assistScorer)
                }
            }
            break

        case eventType.redCard:
            if (!scorer) {
                const newScorer = new Scorer()
                newScorer.player = player
                newScorer.redCards = 1
                tournament.scorers.push(await saveScorer(newScorer))
                await create(tournament)
            } else {
                scorer.redCards += 1
                await updateScorer(scorer)
            }
            break

        case eventType.yellowCard:
            if (!scorer) {
                const newScorer = new Scorer()
                newScorer.player = player
                newScorer.yellowCars = 1
                tournament.scorers.push(await saveScorer(newScorer))
                await create(tournament)
            } else {
                scorer.yellowCars += 1
                await updateScorer(scorer)
            }
            break
    }
}

async function handleFinishGame(match: Match) {
    if (match.group.tournament.format === "Group") {
        const standingFirstTeam = await getStanding(match.firstTeam.teamId, match.group.tournament.tournamentId)
        if (!standingFirstTeam) {
            throw new Error("Standing not found for first team")
        }

        const standingSecondTeam = await getStanding(match.secondTeam.teamId, match.group.tournament.tournamentId)
        if (!standingSecondTeam) {
            throw new Error("Standing not found for second team")
        }

        standingFirstTeam.wins += match.scoreFirstTeam > match.scoreSecondTeam ? 1 : 0
        standingFirstTeam.draws += match.scoreFirstTeam === match.scoreSecondTeam ? 1 : 0
        standingFirstTeam.loses += match.scoreFirstTeam < match.scoreSecondTeam ? 1 : 0
        standingFirstTeam.goalsFor += match.scoreFirstTeam
        standingFirstTeam.goalsAgainst += match.scoreSecondTeam
        standingFirstTeam.goalDiff = standingFirstTeam.goalsFor - standingFirstTeam.goalsAgainst
        standingFirstTeam.points += match.scoreFirstTeam > match.scoreSecondTeam ? 3 : match.scoreFirstTeam === match.scoreSecondTeam ? 1 : 0
        await saveStanding(standingFirstTeam)

        standingSecondTeam.wins += match.scoreFirstTeam < match.scoreSecondTeam ? 1 : 0
        standingSecondTeam.draws += match.scoreFirstTeam === match.scoreSecondTeam ? 1 : 0
        standingSecondTeam.loses += match.scoreFirstTeam > match.scoreSecondTeam ? 1 : 0
        standingSecondTeam.goalsFor += match.scoreSecondTeam
        standingSecondTeam.goalsAgainst += match.scoreFirstTeam
        standingSecondTeam.goalDiff = standingSecondTeam.goalsFor - standingSecondTeam.goalsAgainst
        standingSecondTeam.points += match.scoreFirstTeam < match.scoreSecondTeam ? 3 : match.scoreFirstTeam === match.scoreSecondTeam ? 1 : 0
        await saveStanding(standingSecondTeam)

        // Check if we finished group tournament
        const tournament = await getTournamentById(match.group.tournament.tournamentId)
        if (!tournament) {
            throw new Error("Tournament not found")
        }

        // Check if every match is finished except the current one
        const everyMatchFinished = tournament.groups.every(g => g.matches.filter(m => m.matchId !== match.matchId).every(m => m.status === MatchStatus.finished))
        if (everyMatchFinished && match.status === MatchStatus.finished) {
            await finishTournament(tournament)
        }
    } else if (match.group.tournament.format === "Play-off") {
        const tournament = await getTournamentById(match.group.tournament.tournamentId)
        if (!tournament) {
            throw new Error("Tournament not found")
        }

        const nextColIndex = match.group.colIndex + 1
        const nextHomeTeamIndex = Math.floor(match.group.homeTeamIndex / 2)
        const nextAwayTeamIndex = Math.floor(match.group.awayTeamIndex / 2)
        if (nextHomeTeamIndex === nextAwayTeamIndex && nextHomeTeamIndex === 0) {
            await finishTournament(tournament)
            return;
        }

        const nextGroup = tournament.groups.find(g => g.colIndex === nextColIndex && g.homeTeamIndex === nextHomeTeamIndex && g.awayTeamIndex === nextAwayTeamIndex);
        if (!nextGroup) {
            throw new Error("Next group not found")
        }

        if (match.scoreFirstTeam > match.scoreSecondTeam) {
            if (match.group.homeTeamIndex % 2 === 0) {
                if (nextGroup.homeTeam) {
                    throw new Error("Home team already set")
                }
                nextGroup.homeTeam = match.firstTeam
            } else {
                if (nextGroup.awayTeam) {
                    throw new Error("Away team already set")
                }
                nextGroup.awayTeam = match.firstTeam
            }
        } else if (match.scoreFirstTeam < match.scoreSecondTeam) {
            if (match.group.homeTeamIndex % 2 === 0) {
                if (nextGroup.homeTeam) {
                    throw new Error("Home team already set")
                }
                nextGroup.homeTeam = match.secondTeam
            } else {
                if (nextGroup.awayTeam) {
                    throw new Error("Away team already set")
                }
                nextGroup.awayTeam = match.secondTeam
            }
        } else {
            throw new Error("Draw is not allowed in play-off")
        }

        await saveGroup(nextGroup)

        if (nextGroup.homeTeam && nextGroup.awayTeam) {
            const firstTeamMatchStat = new MatchStat()
            firstTeamMatchStat.team = nextGroup.homeTeam

            const secondTeamMatchStat = new MatchStat()
            secondTeamMatchStat.team = nextGroup.awayTeam

            const newMatch = new Match()
            newMatch.datetime = addMinutes(match.datetime, 125)
            newMatch.location = match.location
            newMatch.firstTeam = nextGroup.homeTeam
            newMatch.secondTeam = nextGroup.awayTeam
            newMatch.type = match.type
            newMatch.matchStatFirstTeam = await saveMatchStat(firstTeamMatchStat)
            newMatch.matchStatSecondTeam = await saveMatchStat(secondTeamMatchStat)

            await saveMatch(newMatch)

            nextGroup.matches.push(newMatch)
            await saveGroup(nextGroup)
            return
        }
    } else if (match.group.tournament.format === "Group+Play-off") {
        throw new Error("Not implemented")
    } else {
        throw new Error("Unknown format of tournament")
    }
}

const finishTournament = async (tournament: Tournament) => {
    tournament.status = "finished"
    await create(tournament)
}
