/**
 * @jest-environment node
 */

//gcloud beta emulators datastore env-init > set_vars.cmd && set_vars.cmd
//gcloud beta emulators datastore start --project=rfw2-403802 --no-store-on-disk 
//--no-store-on-disk 

import Character from "./types/Character"
import { Datastore } from '@google-cloud/datastore'
import Emulator from 'google-datastore-emulator';
import Player from "./types/Player";
import { exec } from "child_process";
import PersistanceEngine from "./PersistanceEngine";
import { assert } from "console";


describe.skip('datastore basics', () => {
    let emulator: Emulator

    beforeAll(() => {
        const { stdout, stderr } = exec('ls');
        console.log('stdout:', stdout);
        console.log('stderr:', stderr);

    })
    beforeEach(async () => {
        process.env.GCLOUD_PROJECT = 'rfw2-403802';
        const options = {
            useDocker: false // if you need docker image
        }
        emulator = new Emulator(options)
        await emulator.start()

    })

    afterEach(async () => {
        await emulator.stop()
    })
    test('true', async () => {
        expect(true)
    })
    test('example datastore save', async () => {
        const datastore = new Datastore({ projectId: 'rfw2-403802' })

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
        //console.log(`Saved ${task.key.name}: ${task.data.description}`)

        const [r] = await datastore.get(taskKey)
        //console.log('r',r)
        expect(r.description).toBe('Buy milk')
    })
})

describe.skip('PersistanceEngine', () => {
    let p: PersistanceEngine
    let emulator: Emulator
    beforeEach(async () => {
        process.env.GCLOUD_PROJECT = 'rfw2-403802';
        const options = {

        }
        emulator = new Emulator(options)
        await emulator.start()

        p = new PersistanceEngine()
        p.connect()
    })

    afterEach(async () => {
        await emulator.stop()
    })

    test('savePlayer', async () => {
        let player: Player | undefined = await p.persistPlayer(new Player({ id: 'one', email: "one@two.three" }))
        expect(player?.email).toBe("one@two.three")
        expect(player?.id).toBe("one")

        player = await p.getPlayerByEmail("one@two.three")
        expect(player?.email).toBe("one@two.three")
        expect(player?.id).toBe("one")
    })

    test('saveCharacter', async () => {
        let c: Character | undefined = await p.persistCharacter(new Character({ id: '0' }))
        expect(c?.id).toBe("0")

        c = await p.loadCharacter('0')
        console.log('c', c)
        expect(c?.id).toBe("0")

    })
})