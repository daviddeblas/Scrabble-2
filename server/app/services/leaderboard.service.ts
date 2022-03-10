import { Collection } from 'mongodb';
import { Player } from "../classes/game/player";
import { HttpException } from '../classes/http.exception';
import { DatabaseService } from './database.service';

const DATABASE_COLLECTION= "highScores_coll";

export class LeaderboardService{
    constructor(){
        private databaseService: DatabaseService;
    }

    get collection(): Collection<Player>{
        return this.databaseService.database.collection(DATABASE_COLLECTION);
    }

    async getAllScores(): Promise<highScores[]>{
        return this.collection
            .find({})
            .toArray()
            .then((scores: Scores[])=>{
                return scores;
            });
    }

    async AddScore(score: Score): Promise<void>{
        if(this.GameFinishStatus.toEndGameFinish()){
                await this.collection.insertOne(score).catch((error:Error)=>{
                    throw new HttpException(500, "failed to insert score");
                });
        }
        else{
            throw new Error("invalid score");
        }
    }
}