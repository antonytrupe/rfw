import EventEmitter from "events"
import ClientEngine from "./ClientEngine";
import { COMMUNITY_SIZE } from "./types/CommunitySize";
import { Socket ,io} from "socket.io-client"

const eventHandlers = {};
jest.mock('socket.io-client', () => ({
    __esModule: true,
    io: () => ({
      connect: jest.fn(),
      disconnect: jest.fn(),
      emit: jest.fn(),
      on: (event, handler) => {
        eventHandlers[event] = handler;
      },
    }),
  }));

global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}))

describe('ClientEngine', () => {
    let clientEngine: ClientEngine
    //let eventEmitter: EventEmitter
    //let socketEmitSpy
    //let user
    beforeEach(() => {
        //user = userEvent.setup()
        //eventEmitter = new EventEmitter()

        //const spy = jest.spyOn(EventEmitter, 'emit')
        //@ts-ignore
        //socketEmitSpy = jest.spyOn(Socket, 'emit').getMockImplementation(()=>{})

        const canvas = document.createElement('canvas');
        const getCanvas = () => canvas;
        clientEngine = new ClientEngine(getCanvas, () => { })
    })

    test('start', () => {
        clientEngine.start()
        expect(clientEngine.connected).toBeFalsy();
    })

    test.skip('connect', async () => {
        //clientEngine.start()
        clientEngine.connect()
        await new Promise((r) => setTimeout(r, 10000));

        expect(clientEngine.connected).toBeTruthy();
    })

    test('spawn a thorp', () => {
        clientEngine.start()
        clientEngine.connect()
        //clientEngine.createCommunity({ size: COMMUNITY_SIZE.HAMLET, race: "Human" })
        //expect(socketEmitSpy).toHaveBeenCalledWith('ferret', 'tobi');
    })

    describe('Initial Conditions', () => {
        test.skip('test', () => { })
    })

    describe('Scrolling', () => {
        test.skip('something', () => { })
    })
})