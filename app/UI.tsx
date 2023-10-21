"use client"
import styles from './UI.module.scss'
import { MutableRefObject, useEffect, useRef, useState, } from 'react'
import ClientEngine from '../src/ClientEngine';
import GameEngine from '../src/GameEngine';
import EventEmitter, { getEventListeners } from 'events';

export default function UI() {
  //@ts-ignore
  const canvasRef: MutableRefObject<HTMLCanvasElement> = useRef(null)

  const getCanvas: () => HTMLCanvasElement = () => {
    return canvasRef.current
  }

  const [clientEngine, setClientEngine] = useState<ClientEngine>()
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    let eventEmitter: EventEmitter = new EventEmitter()
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
      <div className={styles.hud}>
        {!connected && (<button onClick={connect}>connect</button>)}
        {connected && (<button onClick={createCharacter}>Create Character</button>)}
        {connected && (<button onClick={disconnect}>Disconnect</button>)}
      </div>
      <span>ids:{clientEngine?.selectedCharacters[0]?.id}</span>
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
    </>
  )
}