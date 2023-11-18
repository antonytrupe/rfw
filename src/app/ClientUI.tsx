"use client"
import styles from './UI.module.scss'
import { MutableRefObject, useEffect, useRef, useState, } from 'react'
import ClientEngine from '@/ClientEngine'
import EventEmitter from 'events'
import * as CONSTANTS from '@/types/CONSTANTS'
import Character from '@/types/Character'
import CharacterUI from './CharacterUI'
import CommunityCreation from './CommunityCreation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Clock from './components/clock/clock'
import Player from '@/types/Player'
//import steamworks from 'steamworks.js'

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
  const [player, setPlayer] = useState<Player>()
  const [hoveredCharacter, setHoveredCharacter] = useState<Character>()

  useEffect(() => {
    let eventEmitter: EventEmitter = new EventEmitter()


    eventEmitter.on(CONSTANTS.CURRENT_PLAYER, (player: Player) => {
      setPlayer(player)
    })

    eventEmitter.on(CONSTANTS.DISCONNECT, () => {
      setConnected(false)
      setConnecting(false)
    })

    eventEmitter.on(CONSTANTS.CONNECT, () => {
      setConnected(true)
      setConnecting(false)
    })

    const ce = new ClientEngine(eventEmitter, getCanvas)
    setClientEngine(ce)

    return () => {
      disconnect()

      //stop the current client engine's draw loop/flag
      //ce.stopped = true
      ce.stop()
    }
  }, [])

  useEffect(() => {
    //connect automatically once the clientengine is setup
    connect()
  }, [clientEngine])

  function connect() {
    setConnecting(true)
    clientEngine?.connect()
  }

  const onClick = (event: any) => {
    clientEngine?.clickHandler(event)
  }

  const onDoubleClick = (event: any) => {
    clientEngine?.doubleClickHandler(event)
  } 
  
  function onRightClick(event: any ): void {
    clientEngine?.rightClickHandler(event)
  }

  const onKeyDown = (e: any) => {
    clientEngine?.keyDownHandler(e)
  }

  const onMouseMove = (e: any) => {
    const c = clientEngine?.getCharacterAt(clientEngine.getMousePosition(e))
    if (c) {
      setHoveredCharacter(c)
    }
  }

  const onKeyUp = (e: any) => {
    clientEngine?.keyUpHandler(e)
  }

  const onWheel = (e: any) => {
    clientEngine?.wheelHandler(e)
  }

  function disconnect() {
    clientEngine?.disconnect()
    setConnected(false)
  }

  const createCharacter = () => {
    clientEngine?.createCharacter()
  }

  const createCommunity = (options: { size: string, race: string }) => {
    clientEngine?.createCommunity(options)
  }

  const unClaim = (characterId: string) => {
    // unclaim
    clientEngine?.unClaim(characterId)
  }

  function controlCharacter(characterId: string) {
    clientEngine?.control(characterId)
  }

  const { data: session } = useSession()

  return (
    <>
      <CharacterUI character={hoveredCharacter} position={clientEngine?.getScreenPosition({ x: hoveredCharacter?.x || 0, y: hoveredCharacter?.y || 0 })} />
      {
        //header row
      }
      <div style={{}}>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', height: '128px', }}>
          <div className={`${styles.hud} ${styles.flexRow} `}>
            <div>
              {connected && (<button onClick={createCharacter}>Create Character</button>)}
            </div>
            <div>
              {connected && (
                <CommunityCreation action={createCommunity}>
                </CommunityCreation>
              )}
            </div>
            <Clock />
          </div>
          {
            //the right side header stuff
          }
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', padding: '4px' }}>
            {!session?.user && <Link href={'/api/auth/signin'}>Sign In</Link>}
            {!!session?.user && <><span style={{}}>{session.user.email}</span>
              <Link href={'/api/auth/signout'} style={{ border: ' thin black solid', borderRadius: '6px' }}>Sign Out</Link></>}
            {!connected && (<button disabled={connecting} onClick={connect}>connect</button>)}
            {
              /*
              connected && (<button onClick={disconnect}>Disconnect</button>)
              */
            }
            {connected && player?.controlledCharacter && (<button onClick={() => { controlCharacter("") }}>Uncontrol</button>)}
            {connected && player?.controlledCharacter && (<button onClick={() => { unClaim(player.controlledCharacter) }}>Unclaim</button>)}
          </div>
        </div>
      </div>
      {
        //middle row
      }
      <div style={{ display: 'flex', flexDirection: 'row', flexGrow: '1' }}>
        <canvas ref={canvasRef}
          className={`${styles.canvas} canvas`}
          width="800px"
          height="800px"
          tabIndex={1}
          onWheel={onWheel}
          onClick={onClick}
          onContextMenu={onRightClick}
          onDoubleClick={onDoubleClick}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          onMouseMove={onMouseMove}
          data-testid="canvas" />
      </div >
    </>
  )
}