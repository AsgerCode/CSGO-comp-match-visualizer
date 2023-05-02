import React from "react";
import { parseLog } from '@/lib/parseLog';
import { GetServerSideProps } from "next";
import { updateTimeline } from "@/lib/updateTimeline";

export type ServerSideProps = {
    logInfo: {
        matchStartTime: string,
        averageRoundTime: string,
        playerScores: [{
            name: string,
            kills: number,
            deaths: number
        }],
        nemesis: [{
            name: string,
            kills: number,
            target: string
        }],
        highestHeadshot: [{
            name: string,
            kills: number,
            headshots: number,
            percentage: string
        }],
        matchDuration: number,
        error: string,
        timelineData: [{
            timestamp: string,
            killer: string,
            killed: string
        }];
    };
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const logId = context.query.logId;
    if (logId && typeof logId === "string") {
        const logInfo = parseLog(logId);
        return {
            props: {
                logInfo
            },
        };
    } else {
        return {
            notFound: true,
        };
    };
};

const Analyze = ({ logInfo }: ServerSideProps) => {
    if (logInfo.error === undefined) {
        const [timelineLabel, setTimelineLabel] = React.useState("00:00");
        const initialTimeline = () => {
            const startTimeline: { name: string, kills: number, deaths: number }[] = [];
            logInfo.playerScores.forEach(element => {
                startTimeline.push({ name: element.name, kills: 0, deaths: 0 });
            });
            return startTimeline;
        };
        const [timeline, setTimeline] = React.useState(initialTimeline);
        const handleTimelineChange = (event: any) => {
            let newTime = (event.target.value * logInfo.matchDuration) / 100;
            var hh = Math.floor(newTime / 1000 / 60 / 60);
            newTime -= hh * 1000 * 60 * 60;
            var mm = Math.floor(newTime / 1000 / 60);
            newTime -= mm * 1000 * 60;
            var ss = Math.floor(newTime / 1000);
            newTime -= ss * 1000;
            setTimelineLabel((hh < 1 ? "" : hh + ":") + (mm < 10 ? "0" + mm : mm) + ":" + (ss < 10 ? "0" + ss : ss));
            setTimeline(updateTimeline(logInfo.matchStartTime, logInfo.timelineData, timeline, (hh < 1 ? "00:" : hh + ":") + mm + ":" + ss));
        };
        return (
            <div className="grid grid-rows-2 grid-cols-3 gap-10">
                <div className="card">
                    <div className="absolute inset-x-0 top-0 h-64 mt-8">Total Kill/Deaths</div>
                    <table className="table-auto text-base mt-10">
                        <thead>
                            <tr>
                                <th>Player</th>
                                <th>Kills</th>
                                <th>Deaths</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                React.Children.toArray(
                                    logInfo.playerScores.map(({ name, kills, deaths }) => {
                                        return (
                                            <tr>
                                                <td>{name}</td>
                                                <td>{kills}</td>
                                                <td>{deaths}</td>
                                            </tr>
                                        )
                                    })
                                )
                            }
                        </tbody>
                    </table>
                </div>
                <div className="card">
                    <div className="absolute inset-x-0 top-0 h-64 mt-8">Average Round Time</div>
                    <div className="inset-0 text-8xl">{logInfo.averageRoundTime}</div>
                </div>
                <div className="card">
                    <div className="absolute inset-x-0 top-0 h-64 mt-8 ml-3 mr-3">Highest Player on Player Kills</div>
                    <table className="table-auto text-base mt-10">
                        <thead>
                            <tr>
                                <th>Player</th>
                                <th>Killed</th>
                                <th>Times</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                React.Children.toArray(
                                    logInfo.nemesis.map(({ name, target, kills }) => {
                                        return (
                                            <tr>
                                                <td>{name}</td>
                                                <td>{target}</td>
                                                <td>{kills}</td>
                                            </tr>
                                        )
                                    })
                                )
                            }
                        </tbody>
                    </table>
                </div>
                <div className=" relative card">
                    <div className="absolute inset-x-0 top-0 h-64 mt-8">Highest Headshot %</div>
                    <div className="inset-0 text-6xl">{logInfo.highestHeadshot[0].percentage}%</div>
                    <div className="absolute inset-x-0 bottom-0 mb-20">By
                        {
                            /* This code does conditional rendering to account for the fact that
                            there might be more than one player with the highest headshot % */
                            logInfo.highestHeadshot.map((e, i) => {
                                if (i + 1 < logInfo.highestHeadshot.length) {
                                    return " " + e.name + ",";
                                } else {
                                    return " " + e.name;
                                };
                            })
                        }
                    </div>
                </div>
                <div className="relative card cardwide col-span-2">
                    <div className="absolute inset-x-0 top-0 h-64 mt-8 ml-6 mr-6">
                        <label id="timelineLabel" htmlFor="default-range" className="block mb-2 text-sm font-medium text-2xl text-gray-900 dark:text-white">Scoreboard at {timelineLabel}</label>
                        <input id="default-range" type="range" defaultValue={0} min={0} max={100} step={0.1}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" onChange={handleTimelineChange}></input>
                        <table className="border-separate border-spacing-x-20 text-sm ml-6 mt-5">
                            <thead>
                                <tr>
                                    <th>Player</th>
                                    <th>Kills</th>
                                    <th>Deaths</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    React.Children.toArray(
                                        timeline.map(({ name, kills, deaths }) => {
                                            return (
                                                <tr>
                                                    <td>{name}</td>
                                                    <td>{kills}</td>
                                                    <td>{deaths}</td>
                                                </tr>
                                            )
                                        })
                                    )
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className="flex flex-row items-center justify-center h-screen">
                {`Error: ` + logInfo.error}
            </div>
        )
    };
};

export default Analyze;