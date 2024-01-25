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
import Emulator from 'google-datastore-emulator';
import Player from "./types/Player";
//const Emulator = require('google-datastore-emulator');


describe('datastore basics', () => {
    let emulator: Emulator
    beforeEach(async () => {
        process.env.GCLOUD_PROJECT = 'rfw2-403802';
        const options = {
            useDocker: false // if you need docker image
        }
        emulator = new Emulator(options)
        await emulator.start()

        const io = new Server()
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
        console.log(`Saved ${task.key.name}: ${task.data.description}`);
    })
})

describe.skip('ServerEngine', () => {
    let serverEngine: ServerEngine
    let emulator: Emulator
    beforeEach(async () => {
        process.env.GCLOUD_PROJECT = 'rfw2-403802';
        const options = {

        }
        emulator = new Emulator(options)
        await emulator.start()

        const io = new Server()
        serverEngine = new ServerEngine(io)
    })

    afterEach(async () => {
        serverEngine.stop()
        await emulator.stop();
    })

    test('savePlayer', async () => {
        let player: Player | undefined = await serverEngine.savePlayer(new Player({ id: 'one', email: "one@two.three" }))
        expect(player?.email).toBe("one@two.three")
        expect(player?.id).toBe("one")

        player = await serverEngine.getPlayerByEmail("one@two.three")
        expect(player?.email).toBe("one@two.three")
        expect(player?.id).toBe("one")
    })

    test('saveCharacter', async () => {
        let c: Character | undefined = await serverEngine.saveCharacter(new Character({ id: '0' }))
        expect(c?.id).toBe("0")

        c = await serverEngine.loadCharacter('0')
        console.log('c', c)
        expect(c?.id).toBe("0")

    })

    describe('claim/control', () => {
        let character1: Character
        let player2: Player | undefined
        let player3: Player | undefined

        beforeEach(async () => {
            //create a character to use
            character1 = serverEngine.createCharacter(new Character({ id: 'character1' }))
            //create a player to use
            player2 = await serverEngine.savePlayer({ id: "player2id", email: "player2email" })

            //create another player
            player3 = await serverEngine.savePlayer({ id: "player3id", email: "player3email" })

        })

        test('claim an unclaimed character', async () => {
            expect(character1.id).toBe("character1")
            expect(player2?.email).toBe("player2email")
            expect(player2?.id).toBe("player2id")

            const [player, character] = await serverEngine.claimCharacter(character1.id, player2?.email!)
            expect(player?.id).toEqual("player2id")
            expect(player?.email).toEqual("player2email")
            expect(player?.claimedCharacters).toEqual(["character1"])
            expect(player?.controlledCharacter).toBe("")
            expect(character?.playerId).toBe("player2id")

        })

        test('claim a character we already claimed', async () => {
            expect(character1.id).toBe("character1")
            expect(player2?.email).toBe("player2email")
            expect(player2?.id).toBe("player2id")

            let [player, character] = await serverEngine.claimCharacter(character1.id, player2?.email!)
            expect(player?.claimedCharacters).toEqual(["character1"])
            expect(player?.controlledCharacter).toBe("")
            expect(character?.playerId).toBe("player2id");

            [player, character] = await serverEngine.claimCharacter(character1.id, player2?.email!)
            expect(player?.claimedCharacters).toEqual(["character1"])
            expect(player?.controlledCharacter).toBe("")
            expect(character?.playerId).toBe("player2id")

        })

        test('claim a character someone else already claimed', async () => {
            expect(character1.id).toBe("character1")
            expect(player2?.email).toBe("player2email")
            expect(player2?.id).toBe("player2id")

            let [player, character] = await serverEngine.claimCharacter(character1.id, player2?.email!)
            expect(player?.claimedCharacters).toEqual(["character1"])
            expect(player?.controlledCharacter).toBe("")
            expect(character?.playerId).toBe("player2id");

            [player, character] = await serverEngine.claimCharacter(character1.id, player3?.email!)
            expect(player?.claimedCharacters).toEqual([])
            expect(player?.controlledCharacter).toBe("")
            expect(character?.playerId).toBe("player2id")
        })

        test('control an unclaimed character', async () => {
            expect(character1.id).toBe("character1")
            expect(player2?.email).toBe("player2email")
            expect(player2?.id).toBe("player2id")

            let [player, character] = await serverEngine.controlCharacter(character1.id, player2?.email!)
            expect(player?.claimedCharacters).toEqual(["character1"])
            expect(player?.controlledCharacter).toBe("character1")
            expect(character?.playerId).toBe("player2id")
        })

        test('control a character we already claimed', async () => {
            expect(character1.id).toBe("character1")
            expect(player2?.email).toBe("player2email")
            expect(player2?.id).toBe("player2id")

            let [player, character] = await serverEngine.claimCharacter(character1.id, player2?.email!)
            expect(player?.id).toBe("player2id")
            expect(character?.playerId).toBe("player2id");
            expect(player?.claimedCharacters).toEqual(["character1"])
            expect(player?.controlledCharacter).toBe("");

            [player, character] = await serverEngine.controlCharacter(character1.id, player2?.email!)
            expect(player?.id).toBe("player2id");
            expect(character?.playerId).toBe("player2id")
            expect(player?.claimedCharacters).toEqual(["character1"])
            expect(player?.controlledCharacter).toBe("character1")
        })

        test('control a character someone else already claimed', async () => {
            expect(character1.id).toBe("character1")
            expect(player2?.email).toBe("player2email")
            expect(player2?.id).toBe("player2id")

            let [player, character] = await serverEngine.claimCharacter(character1.id, player2?.email!)
            expect(player?.claimedCharacters).toEqual(["character1"])
            expect(player?.controlledCharacter).toBe("")
            expect(character?.playerId).toBe("player2id");

            [player, character] = await serverEngine.controlCharacter(character1.id, player3?.email!)
            expect(player?.claimedCharacters).toEqual([])
            expect(player?.controlledCharacter).toBe("")
            expect(character?.playerId).toBe("player2id")
        })
    })
})