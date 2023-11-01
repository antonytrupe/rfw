"use client"
import styles from './UI.module.scss'
import { MutableRefObject, useEffect, useRef, useState, } from 'react'
import ClientEngine from '@/ClientEngine';
import EventEmitter from 'events';
import * as CONSTANTS from '@/CONSTANTS';
import Character from '@/Character';
import CharacterUI from './CharacterUI';
import CommunityCreation from './CommunityCreation';
import SignInOut from './SignInOut';
import { useSession } from 'next-auth/react';
//import steamworks from 'steamworks.js';

//steamworks.electronEnableSteamOverlay()
//const client = steamworks.init()
//console.log(client.localplayer.getName())

export default function ClientUI() {
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

  useEffect(() => {
    let eventEmitter: EventEmitter = new EventEmitter()

    eventEmitter.on(CONSTANTS.CLIENT_SELECTED_CHARACTERS, (s: Character[]) => {
      setSelectedCharacters(s);
    })
    eventEmitter.on(CONSTANTS.DISCONNECT, (s: Character[]) => {
      setConnected(false)
      setConnecting(false)
    })
    eventEmitter.on(CONSTANTS.CONNECT, (s: Character[]) => {
      setConnected(true)
      setConnecting(false)
    })

    const ce = new ClientEngine(eventEmitter, getCanvas);
    setClientEngine(ce)

    return () => {
      //stop the current client engine's draw loop/flag
      disconnect()
      ce.stopped = true
    }
  }, [])

  useEffect(() => {
    //connect automatically once the clientengine is setup
    connect()
  }, [clientEngine])

  const connect = async () => {
    setConnecting(true)
    clientEngine?.connect()
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

  const createCommunity = (options: { size: string, race: string }) => {
    clientEngine?.createCommunity(options)
  }

  const castSpell = (casterId: string, spellName: string, targets: string[]) => {
    clientEngine?.castSpell(casterId, spellName, targets)
  }

  const claim = (characterId: string) => {
    clientEngine?.claim(characterId)
  }

 // const session = useSession()
 const { data: session } = useSession();

  return (
    <>
      {
        //header row
      }
      <div style={{}}>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <SignInOut />



          <div className={`${styles.hud} ${styles.flexColumn} `}>
            {!connected && (<button disabled={connecting} onClick={connect}>connect</button>)}
            {connected && (<button onClick={createCharacter}>Create Character</button>)}
            {connected && (
              <CommunityCreation action={createCommunity}>
              </CommunityCreation>

            )}
            {connected && (<button onClick={disconnect}>Disconnect</button>)}
          </div>



          <div className={`${styles.characterList}`}>
            {selectedCharacters && selectedCharacters.map((character: Character) => {
              return <CharacterUI character={character} key={character.id} >
                <button className={`btn`} onClick={() => castSpell(character.id, 'DISINTEGRATE', [character.id])}>Disintegrate</button>
                <button className={`btn`} onClick={() => claim(character.id)}>Claim</button>
              </CharacterUI>
            })}
          </div>
        </div>
      </div>
      {
        //canvas row
      }

      <canvas ref={canvasRef}
        className={`${styles.canvas} canvas`}
        width="800px"
        height="800px"
        tabIndex={1}
        onWheel={onWheel}
        onClick={onClick}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        data-testid="canvas" />


    </>
  )
}