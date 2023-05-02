import fs from 'fs';
import path from 'path';

const calculateAverageRoundTime = (logContent: string[]) => {
    const roundStart: string[] = [];
    const roundEnd: string[] = [];
    logContent.forEach(line => {
        if (line.includes("Round_Start")) {
            roundStart.push(line.split(" ")[2].slice(0, -1));
        };

        if (line.includes("Round_End")) {
            roundEnd.push(line.split(" ")[2].slice(0, -1));
        };
    });

    const timeDifferences: number[] = [];
    for (let i = 0; i < roundEnd.length; i++) {
        const startTime = new Date(0, 0, 0, parseInt(roundStart[i].split(":")[0]), parseInt(roundStart[i].split(":")[1]), parseInt(roundStart[i].split(":")[2]));
        const endTime = new Date(0, 0, 0, parseInt(roundEnd[i].split(":")[0]), parseInt(roundEnd[i].split(":")[1]), parseInt(roundEnd[i].split(":")[2]));
        let diff = endTime.getTime() - startTime.getTime();
        timeDifferences.push(diff);
    };

    const timeDifferenceAvg = (): string => {
        let totalDiff = 0;
        timeDifferences.forEach(diff => {
            totalDiff += diff;
        });
        let averageDiff = totalDiff / roundEnd.length + 1;
        var mm = Math.floor(averageDiff / 1000 / 60);
        averageDiff -= mm * 1000 * 60;
        var ss = Math.floor(averageDiff / 1000);
        averageDiff -= ss * 1000;

        return mm + ":" + ss;
    };

    return timeDifferenceAvg();
};

const getPlayerNames = (logContent: string[]): string[] => {
    const players: string[] = [];

    logContent.forEach(line => {
        if (line.includes("money change")) {
            const playerName = line.split(`"`)[1].split("<")[0];
            if (!players.includes(playerName) && players.length < 10) {
                players.push(playerName);
            };
        };

        if (players.length >= 10) {
            return players;
        };
    });

    return players;
};

export type PlayerScore = {
    name: string,
    kills: number,
    deaths: number
};

const getPlayerScores = (logContent: string[]): PlayerScore[] => {
    const playerNames: string[] = getPlayerNames(logContent);
    const playerScores: PlayerScore[] = [];

    // populate playerScores with the players in the match
    playerNames.forEach(playerName => {
        playerScores.push({ name: playerName, kills: 0, deaths: 0 });
    });

    // parse the log content and increment kills and deaths per player
    logContent.forEach(line => {
        if (line.includes("killed") && !line.includes("other")) {
            const killer = line.split('"')[1].split('<')[0];
            const killed = line.split('"')[3].split('<')[0];
            const killerObject = playerScores.find(obj => obj.name === killer);
            const killedObject = playerScores.find(obj => obj.name === killed);

            if (killerObject !== undefined && killerObject.name === killer) {
                killerObject.kills++;
            };

            if (killedObject !== undefined && killedObject.name === killed) {
                killedObject.deaths++;
            };
        }
    });

    return playerScores;
};

export type NemesisScore = {
    name: string,
    kills: number,
    target: string
};

// calculates the highest player on player kill count
const getNemesis = (logContent: string[]): NemesisScore[] => {
    const playerNames: string[] = getPlayerNames(logContent);
    const playerOnPlayerKills: NemesisScore[] = [];

    playerNames.forEach(playerName => {
        playerNames.forEach(targetName => {
            playerOnPlayerKills.push({ name: playerName, kills: 0, target: targetName });
        });
    });

    logContent.forEach(line => {
        if (line.includes("killed") && !line.includes("other")) {
            const killer = line.split('"')[1].split('<')[0];
            const killed = line.split('"')[3].split('<')[0];
            const nemesisObject = playerOnPlayerKills.find(obj => obj.name === killer && obj.target === killed);

            if (nemesisObject !== undefined && nemesisObject.name === killer && nemesisObject.target === killed) {
                nemesisObject.kills++;
            };
        };
    });

    playerOnPlayerKills.sort((a, b) => a.kills > b.kills ? -1 : 1);
    const highestKills = playerOnPlayerKills[0].kills;

    const nemesis: NemesisScore[] = playerOnPlayerKills.filter(element => {
        return element.kills === highestKills;
    });

    return nemesis;
};

export type HeadshotScore = {
    name: string,
    kills: number,
    headshots: number,
    percentage: string
};

const getHighestHeadshot = (logContent: string[]): HeadshotScore[] => {
    const playerNames: string[] = getPlayerNames(logContent);
    const headshotScore: HeadshotScore[] = [];

    // populate headshotScores with the players in the match
    playerNames.forEach(playerName => {
        headshotScore.push({ name: playerName, kills: 0, headshots: 0, percentage: "" });
    });

    logContent.forEach(line => {
        if (line.includes("killed") && !line.includes("other")) {
            const killer = line.split('"')[1].split('<')[0];
            const killerObject = headshotScore.find(obj => obj.name === killer);

            if (killerObject !== undefined && killerObject.name === killer) {
                if (line.includes("headshot")) {
                    killerObject.kills++;
                    killerObject.headshots++;
                } else {
                    killerObject.kills++;
                };
            };
        };
    });

    headshotScore.forEach(player => {
        player.percentage = ((player.headshots / player.kills) * 100).toFixed(2);
    });

    headshotScore.sort((a, b) => a.percentage > b.percentage ? -1 : 1);

    const highestHeadshotPercent = headshotScore[0].percentage;
    const highestHeadshotScore: HeadshotScore[] = headshotScore.filter(element => {
        return element.percentage === highestHeadshotPercent;
    });

    return highestHeadshotScore;
};

const getMatchDuration = (logContent: string[]): number => {
    const matchStart = new Date(0, 0, 0, parseInt(logContent[0].split(" ")[2].slice(0, -1).split(":")[0]), parseInt(logContent[0].split(" ")[2].slice(0, -1).split(":")[1]), parseInt(logContent[0].split(" ")[2].slice(0, -1).split(":")[2]));
    const roundEnd: string[] = [];
    logContent.forEach(line => {
        if (line.includes("Round_End")) {
            roundEnd.push(line.split(" ")[2].slice(0, -1));
        };
    });
    const matchEnd = new Date(0, 0, 0, parseInt(roundEnd[roundEnd.length - 1].split(":")[0]), parseInt(roundEnd[roundEnd.length - 1].split(":")[1]), parseInt(roundEnd[roundEnd.length - 1].split(":")[2]));
    let diff = matchEnd.getTime() - matchStart.getTime();

    return diff;
};

export type TimelineData = {
    timestamp: string,
    killer: string,
    killed: string
}

const getTimelineData = (logContent: string[]): TimelineData[] => {
    const playerNames: string[] = getPlayerNames(logContent);
    const timelineData: TimelineData[] = [];

    // parse the log content and increment kills and deaths per player
    logContent.forEach(line => {
        if (line.includes("killed") && !line.includes("other")) {
            const killer = line.split('"')[1].split('<')[0];
            const killed = line.split('"')[3].split('<')[0];
            const timestamp = line.split(" ")[2].slice(0, -1);
            timelineData.push({ timestamp: timestamp, killer: killer, killed: killed });
        };
    });
    return timelineData;
}

export const parseLog = (logId: string) => {
    try {
        const logContent = fs.readFileSync(path.join(process.cwd(), `src/data/logs/${logId}.txt`), 'utf-8').split('\n');
        // getting relevant data after the last "Match_Start" broadcast
        let lastMatchStartIndex = 0;
        logContent.forEach(line => {
            if (line.includes("Match_Start")) {
                lastMatchStartIndex = logContent.indexOf(line);
            }
        });
        logContent.splice(0, lastMatchStartIndex);
        
        return { matchStartTime: logContent[0].split(" ")[2].slice(0, -1), averageRoundTime: calculateAverageRoundTime(logContent),
        playerScores: getPlayerScores(logContent), nemesis: getNemesis(logContent), highestHeadshot: getHighestHeadshot(logContent),
        matchDuration: getMatchDuration(logContent), timelineData: getTimelineData(logContent) };
    } catch (err) {
        return { error: "Error reading log. This might be because the log doesn't exist." };
    };
};