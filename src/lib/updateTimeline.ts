import { PlayerScore, TimelineData } from "./parseLog";
import addTime from "./time";

export const updateTimeline = (matchStartTime: string, timeLineData: TimelineData[], playerScores: PlayerScore[], endTime: string): PlayerScore[] => {
    const timeLimit = addTime(new Date(2024, 4, 10, parseInt(matchStartTime.split(":")[0]), parseInt(matchStartTime.split(":")[1]), parseInt(matchStartTime.split(":")[2])),
        parseInt(endTime.split(":")[0]), parseInt(endTime.split(":")[1]), parseInt(endTime.split(":")[2]));

    playerScores.forEach(element => {
        element.deaths = 0;
        element.kills = 0;
    });
    timeLineData.forEach(data => {
        if (data.timestamp > timeLimit.toString().split(" ")[4]) {
            return playerScores;
        };

        const killer = data.killer;
        const killed = data.killed;
        const killerObject = playerScores.find(obj => obj.name === killer);
        const killedObject = playerScores.find(obj => obj.name === killed);

        if (killerObject !== undefined && killerObject.name === killer) {
            killerObject.kills++;
        };

        if (killedObject !== undefined && killedObject.name === killed) {
            killedObject.deaths++;
        };
    });
    return playerScores;
};