"use client"
import styles from './UI.module.scss'
import { MutableRefObject, useEffect, useRef, useState, } from 'react'
import ClientEngine from '@/ClientEngine';
import EventEmitter from 'events';
import * as CONSTANTS from '@/CONSTANTS';
import Character from '@/Character';
import CharacterUI from './CharacterUI';
//import steamworks from 'steamworks.js';

//steamworks.electronEnableSteamOverlay()
//const client = steamworks.init()
//console.log(client.localplayer.getName())

export default function UI() {
  //@ts-ignore
  const canvasRef: MutableRefObject<HTMLCanvasElement> = useRef(null)

  const getCanvas: () => HTMLCanvasElement = () => {
    return canvasRef.current
  }

  const [clientEngine, setClientEngine] = useState<ClientEngine>()
  const [connected, setConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)
  //const [world, setWorldState] = useState<GameWorld>()
  const [selectedCharacters, setSelectedCharacters] = useState<Character[]>([])
  const [communitySize, setCommunitySize] = useState('THORP');

  useEffect(() => {
    let eventEmitter: EventEmitter = new EventEmitter()

    eventEmitter.on(CONSTANTS.CLIENT_SELECTED_CHARACTERS, (s: Character[]) => {
      //  console.log(s)
      setSelectedCharacters(s);
    })
    //let gameEngine = new GameEngine(eventEmitter)
    setClientEngine(new ClientEngine(eventEmitter, getCanvas))

  }, [])

  useEffect(() => {
    //connect automatically once the clientengine is setup
    connect()
  }, [clientEngine])

  const connect = async () => {
    console.log('connecting')
    setConnecting(true)
    const connected = !!await clientEngine?.connect()
    console.log('connected', connected)
    setConnected(connected)
    setConnecting(false)
    console.log('connected')
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

  const createCommunity = () => {
    clientEngine?.createCommunity(communitySize)
  }

  const castSpell = (casterId: string, spellName: string, targets: string[]) => {
    clientEngine?.castSpell(casterId, spellName, targets)
  }

  return (
    <>
      <canvas ref={canvasRef}
        className={`${styles.canvas} canvas`}
        style={{ width: "800px", height: "800px" }}
        width="800px"
        height="800px"
        tabIndex={1}
        onWheel={onWheel}
        onClick={onClick}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        data-testid="canvas" />

      <div className={`${styles.hud} ${styles.flexColumn} `}>
        {!connected && (<button disabled={connecting} onClick={connect}>connect</button>)}
        {connected && (<button onClick={createCharacter}>Create Character</button>)}
        {connected && (<><button onClick={createCommunity}>Create Community</button>

          <select
            value={communitySize}
            onChange={e => setCommunitySize(e.target.value)}
          >
            <option value="THORP">Thorp</option>
            <option value="HAMLET">Hamlet</option>
            <option value="VILLAGE">Village</option>
            <option value="SMALL_TOWN">Small Town</option>
            <option value="LARGE_TOWN">Large Town</option>
            <option value="SMALL_CITY">Small City</option>
          </select>
        </>
        )}
        {connected && (<button onClick={disconnect}>Disconnect</button>)}
      </div>

      <div>
        {selectedCharacters && selectedCharacters.map((character: Character) => {
          return <CharacterUI character={character} key={character.id} >
            <button onClick={() => castSpell(character.id, 'DISINTEGRATE', [character.id])}>Disintegrate</button>
          </CharacterUI>
        })}
      </div>
    </>
  )
}