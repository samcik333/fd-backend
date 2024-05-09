import {FastifyReply, FastifyRequest} from "fastify";
import {getTeamById} from "../../services/TeamService";
import {Player} from "../../entities/Player";
import {savePlayer} from "../../services/PlayerService";

interface PlayerTeamProps {
    teamId: string;
}

export const addPlayer = async (request: FastifyRequest, reply: FastifyReply) => {
    interface PlayerSaveProps {
        firstName: string;
        lastName: string;
        age: number;
        number: number;
    }

    const {firstName, lastName, age, number} = request.body as PlayerSaveProps
    const {teamId} = request.params as PlayerTeamProps

    const team = await getTeamById(Number(teamId))
    if (team === undefined) {
        return reply.code(404).send({message: 'Team not found'})
    }

    const player = new Player()
    player.firstName = firstName
    player.lastName = lastName
    player.age = age
    player.number = number
    player.team = team

    return await savePlayer(player)
}
