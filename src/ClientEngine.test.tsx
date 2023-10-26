import EventEmitter from "events"
import * as CONSTANTS from "./CONSTANTS";
import ClientEngine from "./ClientEngine";

describe('ClientEngine', () => {
    let clientEngine: ClientEngine
    let eventEmitter: EventEmitter
    beforeEach(() => {
        eventEmitter = new EventEmitter()
        const canvas = document.createElement('canvas');
        const getCanvas = () => { return canvas; };
        clientEngine = new ClientEngine(eventEmitter, getCanvas)
    })

    describe('Events', () => {
        test('should test something ', () => {
            eventEmitter.emit(CONSTANTS.CREATE_CHARACTER)
            eventEmitter.emit(CONSTANTS.CREATE_CHARACTER)
            eventEmitter.emit(CONSTANTS.CREATE_CHARACTER)
            expect(clientEngine.gameEngine.gameWorld.characters.length).toBe(3)
        }) 
    })
})