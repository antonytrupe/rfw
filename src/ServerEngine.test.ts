/**
 * @jest-environment node
 */

//gcloud beta emulators datastore env-init > set_vars.cmd && set_vars.cmd
//gcloud beta emulators datastore start --project=rfw2-403802 --no-store-on-disk 
//--no-store-on-disk 

import { Server } from "socket.io"
import ServerEngine from "./ServerEngine"
import Character from "./types/Character"
import { Datastore } from '@google-cloud/datastore'

describe.skip('datastore basics', () => {
    test('example datastore save', async () => {
        const datastore = new Datastore({ projectId: 'rfw2-403802' , apiEndpoint: 'localhost:8081'  })
    
        // The kind for the new entity
        const kind = 'Task';
    
        // The name/ID for the new entity
        const name = 'sampletask1';
    
        // The Cloud Datastore key for the new entity
        const taskKey = datastore.key([kind, name]);
    
        // Prepares the new entity
        const task = {
            key: taskKey,
            data: {
                description: 'Buy milk',
            },
        };
    
        // Saves the entity
        await datastore.save(task);
        console.log(`Saved ${task.key.name}: ${task.data.description}`);
    })
})

describe.skip('ServerEngine', () => {
    let serverEngine: ServerEngine

    beforeEach(() => {
        const io = new Server()
        serverEngine = new ServerEngine(io)
    })

    test('saveCharacter', () => {
        serverEngine.saveCharacter(new Character({ id: '0' }))

    })
})