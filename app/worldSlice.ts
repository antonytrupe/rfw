import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface Player {
    id: string,
    location: {
        x: number,
        y: number
    },
    vector: {
        velocity: number,
        angle: number
    }
}

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
            console.log(action.payload)
            state.players = [...state.players, action.payload]
            state.currentPlayer = { ...action.payload }
        },

        setCurrentPlayer: (state, action: PayloadAction<Player>) => {
            console.log(action.payload)
            //make sure this player is in the list of players
            if (!state.players.some((it) => {
                return it.id == action.payload.id
            })) {
                state.players = [...state.players, action.payload]
            }
            state.currentPlayer = { ...action.payload }
            console.log(state.currentPlayer)
        },

        movePlayer: (state, action: PayloadAction<{ playerId: string, direction: { x: number, y: number } }>) => {
            state.players = state.players.map(player => {
                return player.id === action.payload.playerId ?
                    { ...player, x: player.location.x + action.payload.direction.x, y: player.location.y + action.payload.direction.y } : player
            })
        },

        warpPlayer: (state, action: PayloadAction<Player>) => {
            //make sure this player is in the list of players
            if (!state.players.some((it) => {
                return it.id == action.payload.id
            })) {
                console.log('adding the player')
                state.players = [...state.players, action.payload]
            }
            else {
                console.log('moving the player')
                //find the player and warp them
                state.players = state.players.map(player => {
                    return player.id == action.payload.id ?
                        { ...player, x: action.payload.location.x, y: action.payload.location.y } : player
                })
            }
        },
        moveCurrentPlayer: (state, action: PayloadAction<{ direction: { x: number, y: number } }>) => {
            state.players = state.players.map(player => {
                return state.currentPlayer?.id == player.id ?
                    { ...player, location: { x: player.location.x + action.payload.direction.x, y: player.location.y + action.payload.direction.y } } : player
            })
        },

        setPlayers: ((state, action: PayloadAction<Player[]>) => {
            state.players = [...action.payload]
        }),

        removePlayer: (state, action: PayloadAction<string>) => {
            // state.players.splice(action.payload.id)
            state.players = state.players.filter((player) => { return player.id != action.payload })
        },
    },
})

// Action creators are generated for each case reducer function
export const { addPlayer, movePlayer, removePlayer, addCurrentPlayer, moveCurrentPlayer, warpPlayer, setCurrentPlayer } = worldSlice.actions

export default worldSlice.reducer

