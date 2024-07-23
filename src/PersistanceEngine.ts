import { Datastore, PropertyFilter } from '@google-cloud/datastore'
import WorldObject from './types/WorldObject'
import { CHARACTER_KIND, OBJECT_KIND, PLAYER_KIND, TEMPLATE_KIND, WORLD_KIND } from './types/CONSTANTS'
import { v4 as uuidv4 } from 'uuid'
import Player from './types/Player'
import Character from './types/Character'
import GameEngine from './GameEngine'


export default class PersistanceEngine {


    private datastore: Datastore
    world: string

    constructor(world: string) {
        this.world = world
    }

    public async persistGameWorld(engine: GameEngine) {
        // The Cloud Datastore key for the new entity
        const key = this.datastore.key([WORLD_KIND, this.world])
        console.log(key)
        // Prepares the new entity

        // Saves the entity
        await this.datastore.save({
            key: key,
            data: { createTime: engine.createTime }
        })
    }

    async loadGameWorld(): Promise<any> {
        const key = this.datastore.key([WORLD_KIND, this.world])
        this.datastore.get(key)
        const [world] = await this.datastore.get(key)
        //console.log(world)
        return world
    }

    async persistCharacters(characters: Map<string, Character>) {
        const saves = []
        characters.forEach((character) => {
            saves.push(this.persistCharacter(character))
        })
        await Promise.all(saves)
    }

    async loadCharacter(id: string): Promise<Character> {
        const key = this.datastore.key([WORLD_KIND, this.world, CHARACTER_KIND, id])
        this.datastore.get(key)
        const [character] = await this.datastore.get(key)
        return character
    }

    async persistCharacter(character: Character) {
        const kind = CHARACTER_KIND
        // The Cloud Datastore key for the new entity
        const key = this.datastore.key([WORLD_KIND, this.world, kind, character.id])
        // Prepares the new entity

        //console.log(character.dehyrate() )

        // Saves the entity
        await this.datastore.save({
            key: key,
            data: character.dehyrate()
        })
        return character
    }
    loadAllCharacters() {
        console.log('loading characters...')
        const characterQuery = this.datastore.createQuery(CHARACTER_KIND)
        //[WORLD_KIND, this.world,
        characterQuery.hasAncestor(this.datastore.key([WORLD_KIND, this.world]))
        console.log('...finished loading characters')

        return this.datastore.runQuery(characterQuery)
    }
    loadTemplates() {
        const templateQuery = this.datastore.createQuery([WORLD_KIND, this.world, TEMPLATE_KIND])
        return this.datastore.runQuery(templateQuery)
    }
    async loadObjects() {
        const objectQuery = this.datastore.createQuery([WORLD_KIND, this.world, OBJECT_KIND])
        return this.datastore.runQuery(objectQuery)
    }
    async deleteCharacter(characterId: string) {
        await this.datastore.delete(this.datastore.key([WORLD_KIND, this.world, CHARACTER_KIND, characterId]))
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
        const taskKey = this.datastore.key([WORLD_KIND, this.world, kind, name])
        // Prepares the new entity
        const task = {
            key: taskKey,
            data: newObject,
        }
        // Saves the entity
        this.datastore.save(task)
    }

    connect() {
        this.datastore = new Datastore({ projectId: 'rfw2-403802' })
    }
}