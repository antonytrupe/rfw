import EventEmitter from "events"
import ClientEngine from "./ClientEngine";
import ClientUI from "./app/ClientUI";
import { render, screen, } from '@testing-library/react'
import userEvent, { UserEvent } from '@testing-library/user-event'
import NextAuthSessionProvider from "./app/providers/SessionProvider";

//jest.mock("./app/providers/SessionProvider")

jest.mock("next-auth/react", () => {
    const originalModule = jest.requireActual('next-auth/react');
    const mockSession = {
      expires: new Date(Date.now() + 2 * 86400).toISOString(),
      user: { username: "admin" }
    };
    return {
      __esModule: true,
      ...originalModule,
      useSession: jest.fn(() => {
        return {data: mockSession, status: 'authenticated'}  // return type is [] in v3 but changed to {} in v4
      }),
    };
  });

global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}))

describe('ClientUI', () => {
    let clientEngine: ClientEngine
    let eventEmitter: EventEmitter
    let user:UserEvent

    beforeEach(() => {
        user = userEvent.setup()
        //render(<NextAuthSessionProvider><ClientUI /></NextAuthSessionProvider>)
       // render(<ClientUI />)
    })

    test.skip("typing into chat", async () => {
        //todo()
        await user.click(screen.getByRole("textbox"))
    })

    test("spawning some characters", () => {
        //todo()
    })
    test("claiming a character", () => {
        //todo()
    })
    test("accelerating a character", () => {
        //todo()
    })

    describe('Initial Conditions', () => {
        test.skip('should have the right size canvas', async () => {
            render(<NextAuthSessionProvider><ClientUI /></NextAuthSessionProvider>)
            const canvas: HTMLCanvasElement = screen.getByTestId('canvas')
            const rect = canvas.getBoundingClientRect()

            expect(rect.width).toBe(400)
            expect(rect.height).toBe(400)
            // expect(canvas).toBeInTheDocument()
        })
        test.skip('should have the origin in the middle of the canvas', () => { })
    })

    describe('Scrolling', () => {
        user
        test.skip('something', () => { })
    })
})