"use client"
import styles from './UI.module.scss'
import { MutableRefObject, useEffect, useRef, useState, } from 'react'
import ClientEngine from '../src/ClientEngine';
import GameEngine from '../src/GameEngine';
import EventEmitter, { getEventListeners } from 'events';
import GameWorld from '@/GameWorld';
import { CLIENT_UPDATE, WORLD_UPDATE } from '@/CONSTANTS';
import Character from './Character';

export default function UI() {
  //@ts-ignore
  const canvasRef: MutableRefObject<HTMLCanvasElement> = useRef(null)

  const getCanvas: () => HTMLCanvasElement = () => {
    return canvasRef.current
  }

  const [clientEngine, setClientEngine] = useState<ClientEngine>()
  const [connected, setConnected] = useState(false)
  const [world, setWorldState] = useState<GameWorld>()
  const [selectedCharacters, setSelectedCharacters] = useState<Character[]>([])

  useEffect(() => {
    let eventEmitter: EventEmitter = new EventEmitter()
    eventEmitter.on(WORLD_UPDATE, (world: GameWorld) => {
      setWorldState(world);
    })
    eventEmitter.on(CLIENT_UPDATE, (selectedCharacter: Character[]) => {
      setSelectedCharacters(selectedCharacter);
    })
    let gameEngine = new GameEngine(eventEmitter)
    setClientEngine(new ClientEngine(eventEmitter, gameEngine, getCanvas))
  }, [])

  const connect = async () => {
    clientEngine?.connect()
    setConnected(true)
  }

  const onClick = (event: any) => {
    clientEngine?.clickHandler(event)
  }

  const onKeyDown = (e: any) => {
    clientEngine?.keyDownHandler(e)
  }
  const onKeyUp = (e: any) => {
    clientEngine?.keyUpHandler(e)
  }
  const onWheel = (e: any) => {
    clientEngine?.wheelHandler(e)
  }

  const disconnect = async () => {
    clientEngine?.disconnect()
    setConnected(false)
  }

  const createCharacter = () => {
    clientEngine?.createCharacter()
  }

  return (
    <>
      <div className={`${styles.hud} ${styles.flexColumn} `}>
        {!connected && (<button onClick={connect}>connect</button>)}
        {connected && (<button onClick={createCharacter}>Create Character</button>)}
        {connected && (<button onClick={disconnect}>Disconnect</button>)}
      </div>

      <canvas ref={canvasRef}
        className={`${styles.canvas} canvas`}
        style={{ width: "800px", height: "800px" }}
        width="800px"
        height="800px"
        tabIndex={1}
        onWheel={onWheel}
        onClick={onClick}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp} />
      <div>
        {selectedCharacters.map((character: Character) => {
          return (<div key={character.id}>
            <div> id:{character.id}</div>
            <div> size:{character.size}</div>
            <div> speed:{character.speed}</div>
            <div> maxSpeed:{character.maxSpeed}</div>
            <div> x:{character.x}</div>
            <div> y:{character.y}</div>
          </div>)
        })}
      </div>
    </>
  )
}