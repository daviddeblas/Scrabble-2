import { DatabaseService } from '@app/services/database.service';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('Database service', ()=>{
    let databaseService: DatabaseService;
    let mongoServer: MongoMemoryServer;
    const player1= {name: 'player1' score:100};
    const player2= {name: 'player2' score:10};

    beforeEach(async()=>{
        databaseService= new DatabaseService();

        mongoServer=await MongoMemoryServer.create();
        
    });

    afterEach(async()=>{
        if(databaseService['client']){
            await databaseService['client'].close();
        }
    });

})