import { Datastore, PropertyFilter } from '@google-cloud/datastore'
import WorldObject from './types/WorldObject'
import { CHARACTER_KIND, OBJECT_KIND, PLAYER_KIND, TEMPLATE_KIND } from './types/CONSTANTS'
import { v4 as uuidv4 } from 'uuid'
import Player from './types/Player'
import Character from './types/Character'


export default class PersistanceEngine {

    // async persistWorld() {
    //     const kind = WORLD_KIND
    //     // The Cloud Datastore key for the new entity
    //     const key = this.datastore.key([kind, character.id])
    //     // Prepares the new entity

    //     // Saves the entity
    //     await this.datastore.save({
    //         key: key,
    //         data: character
    //     })
    // }

    async persistCharacters(characters: Map<string, Character>) {
        const saves = []
        characters.forEach((character) => {
            saves.push(this.persistCharacter(character))
        })
        await Promise.all(saves)
    }

    async loadCharacter(id: string): Promise<Character> {
        const key = this.datastore.key([CHARACTER_KIND, id])
        this.datastore.get(key)
        const [character] = await this.datastore.get(key)
        return character
    }

    async persistCharacter(character: Character) {
        const kind = CHARACTER_KIND
        // The Cloud Datastore key for the new entity
        const key = this.datastore.key([kind, character.id])
        // Prepares the new entity

        // Saves the entity
        await this.datastore.save({
            key: key,
            data: {...character}
        })
        return character
    }
    loadAllCharacters() {
        const characterQuery = this.datastore.createQuery(CHARACTER_KIND)
        return this.datastore.runQuery(characterQuery)
    }
    loadTemplates() {
        const templateQuery = this.datastore.createQuery(TEMPLATE_KIND)
        return this.datastore.runQuery(templateQuery)
    }
    async loadObjects() {
        const objectQuery = this.datastore.createQuery(OBJECT_KIND)
        return this.datastore.runQuery(objectQuery)
    }
    async deleteCharacter(characterId: string) {
        await this.datastore.delete(this.datastore.key([CHARACTER_KIND, characterId]))
    }

    async getPlayerByEmail(email: string) {
        const playerQuery = this.datastore.createQuery(PLAYER_KIND)
        playerQuery.filter(new PropertyFilter('email', '=', email))
        const [players]: [Player[], any] = await this.datastore.runQuery(playerQuery)

        return players[0]
    }

    deletePlayer(email: string) {
        this.datastore.delete(this.datastore.key([PLAYER_KIND, email]))
    }

    async persistPlayer(player: Partial<Player>) {
        // The name/ID for the new entity
        if (!player.email) {
            throw new Error('no email for player')
        }

        if (!player.id) {
            player.id = uuidv4()
        }

        console.log(1)

        // The Cloud Datastore key for the new entity
        const key = this.datastore.key([PLAYER_KIND, player.email])
        console.log(2)
        // Prepares the new entity
        const d = {
            key: key,
            data: new Player(player),
        }
        //console.log(2)

        // Saves the entity
        await this.datastore.save(d)
        //console.log(3)

        //console.log(d.data)

        return d.data
    }

    persistObject(newObject: WorldObject) {
        const kind = OBJECT_KIND
        // The name/ID for the new entity
        const name = newObject.id
        // The Cloud Datastore key for the new entity
        const taskKey = this.datastore.key([kind, name])
        // Prepares the new entity
        const task = {
            key: taskKey,
            data: newObject,
        }
        // Saves the entity
        this.datastore.save(task)
    }
    private datastore: Datastore


    connect() {
        this.datastore = new Datastore({ projectId: 'rfw2-403802' })
    }
}