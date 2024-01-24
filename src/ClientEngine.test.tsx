import EventEmitter from "events"
import * as CONSTANTS from "./types/CONSTANTS";
import ClientEngine from "./ClientEngine";
import ClientUI from "./app/ClientUI";
import { render, screen, } from '@testing-library/react'

describe('ClientEngine', () => {
    let clientEngine: ClientEngine
    let eventEmitter: EventEmitter
    beforeEach(() => {
        eventEmitter = new EventEmitter()
        const canvas = document.createElement('canvas');
        const getCanvas = () => { return canvas; };
        clientEngine = new ClientEngine( getCanvas,()=>{})
    })

    describe('Initial Conditions', () => {
        test.skip('should have the right size canvas', async () => {
            render(<ClientUI />)
            const canvas: HTMLCanvasElement = screen.getByTestId('canvas')
            //const rect = canvas.getBoundingClientRect()

            // expect(rect.width).toBe(400) 
            // expect(rect.height).toBe(400)
            //  expect(canvas).toBeInTheDocument()
        })
        test.skip('should have the origin in the middle of the canvas', () => { })
    })

    describe('Scrolling', () => {
        test.skip('something', () => { })
    })
})