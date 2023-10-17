import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface Player { id: string, location: { x: number, y: number } }

export interface WorldState {
    currentPlayer: Player | undefined,
    players: Player[]
}

const initialState: WorldState = {
    currentPlayer: undefined,
    players: []
}

export const worldSlice = createSlice({
    name: 'world',
    initialState,
    reducers: {
        addPlayer: (state, action: PayloadAction<Player>) => {
            state.players = [...state.players, action.payload]
        },
        addCurrentPlayer: (state, action: PayloadAction<Player>) => {
            state.players = [...state.players, action.payload]
            state.currentPlayer = action.payload
        },

        movePlayer: (state, action: PayloadAction<{ playerId: string, direction: { x: number, y: number } }>) => {
            state.players = state.players.map(player => {
                return player.id === action.payload.playerId ?
                    { ...player, x: player.location.x + action.payload.direction.x, y: player.location.y + action.payload.direction.y } : player
            })
        },
        moveCurrentPlayer: (state, action: PayloadAction<{ direction: { x: number, y: number } }>) => {
            state.players = state.players.map(player => {
                return state.currentPlayer?.id == player.id ?
                    { ...player, location: { x: player.location.x + action.payload.direction.x, y: player.location.y + action.payload.direction.y } } : player
            })
        },

        setPlayers: ((state, action: PayloadAction<Player[]>) => {
            state.players = action.payload
        }),

        removePlayer: (state, action: PayloadAction<Player>) => {
            // state.players.splice(action.payload.id)
        },
    },
})

// Action creators are generated for each case reducer function
export const { addPlayer, movePlayer, removePlayer, addCurrentPlayer, moveCurrentPlayer } = worldSlice.actions

export default worldSlice.reducer

