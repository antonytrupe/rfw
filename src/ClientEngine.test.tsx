import EventEmitter from "events"
import * as CONSTANTS from "./CONSTANTS";
import ClientEngine from "./ClientEngine";
import UI from "../app/UI";
import { render, screen,   } from '@testing-library/react'

describe('ClientEngine', () => {
    let clientEngine: ClientEngine
    let eventEmitter: EventEmitter
    beforeEach(() => {
        eventEmitter = new EventEmitter()
        const canvas = document.createElement('canvas');
        const getCanvas = () => { return canvas; };
        clientEngine = new ClientEngine(eventEmitter, getCanvas)
    })

    describe('Initial Conditions', () => {
        test('should have the right size canvas', async () => {
            render(<UI />)
            const canvas: HTMLCanvasElement = screen.getByTestId('canvas')
            //const rect = canvas.getBoundingClientRect()

           // expect(rect.width).toBe(400) 
           // expect(rect.height).toBe(400)
         //  expect(canvas).toBeInTheDocument()
        })
        test('should have the origin in the middle of the canvas', () => { })
    })

    describe('Scrolling', () => {
        test('', () => { })
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