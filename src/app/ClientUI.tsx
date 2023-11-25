"use client"
import './ClientUI.scss'

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
  const [player, setPlayer] = useState<Player>()
  const [hoveredCharacter, setHoveredCharacter] = useState<Character>()
  const [chatMode, setChatMode] = useState<boolean>(false)
  const [chat, setChat] = useState<string>('')
  const { data: session } = useSession()

  /**
   * set up the event emitter and client engine
   */
  useEffect(() => {
    let eventEmitter: EventEmitter = new EventEmitter()

    eventEmitter.on(CONSTANTS.CURRENT_PLAYER, (player: Player) => {
      setPlayer(player)
    })

    eventEmitter.on(CONSTANTS.DISCONNECT, () => {
      setConnected(false)
    })

    eventEmitter.on(CONSTANTS.CONNECT, () => {
      setConnected(true)
    })

    const ce = new ClientEngine(eventEmitter, getCanvas)
    setClientEngine(ce)

    return () => {
      eventEmitter.removeAllListeners()
      ce.disconnect()
      setConnected(false)
      //stop the current client engine's draw loop/flag
      ce.stop()
    }
  }, [])

  /**
   * connect the client engine to the server/socket
   */
  useEffect(() => {
    //connect automatically once the clientengine is setup
    connect()
  }, [clientEngine])

  function connect() {
    //setConnecting(true)
    clientEngine?.connect()
  }

  const onClick = (event: any) => {
    clientEngine?.clickHandler(event)
  }

  const onDoubleClick = (event: any) => {
    clientEngine?.doubleClickHandler(event)
  }

  function onRightClick(event: any): void {
    console.log('right click')
    clientEngine?.rightClickHandler(event)
  }

  function onKeyDown(e: any) {

    if (e.code == 'Enter') {

      if (chatMode) {
        //console.log('sending', chat)
        clientEngine?.chat(chat)
        setChat('')
        if (containerRef.current) {
          containerRef.current.focus()
        }
      }
      //toggle chat mode
      setChatMode(!chatMode)
    }
    else if (e.code == "Slash") {
      setChatMode(true)
    }
    else if (e.code == 'Escape') {
      //close chat mode
      setChatMode(false)
      if (containerRef.current) {
        containerRef.current.focus()
      }
    }
    if (!chatMode) {
      clientEngine?.keyDownHandler(e)
    }
  }

  const onMouseMove = (e: any) => {
    const c = clientEngine?.getCharacterAt(clientEngine.getMousePosition(e))
    if (c) {
      setHoveredCharacter(c)
    }
  }

  const onKeyUp = (e: any) => {
    if (!chatMode) {
      clientEngine?.keyUpHandler(e)
    }
  }

  const onWheel = (e: any) => {
    clientEngine?.wheelHandler(e)
  }

  const createCharacter = () => {
    clientEngine?.createCharacter()
  }

  const createObject = () => {
    clientEngine?.createObject()
  }

  const createCommunity = (options: { size: string, race: string }) => {
    clientEngine?.createCommunity(options)
  }

  const unClaim = (characterId: string) => {
    //unclaim
    clientEngine?.unClaim(characterId)
  }

  function controlCharacter(characterId: string) {
    clientEngine?.control(characterId)
  }

  function patrol() {
    //TODO clientui patrol
    //clientEngine?.patrol()
  }

  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <>
      <CharacterUI character={hoveredCharacter} position={clientEngine?.getScreenPosition({ x: hoveredCharacter?.location.x || 0, y: hoveredCharacter?.location.y || 0 })} />
      <div
        autoFocus
        ref={containerRef}
        tabIndex={chatMode ? 1 : 1}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}>
        <div
          style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', height: '128px', }}>
          <div className={`${styles.hud} ${styles.flexRow} `}>
            <Clock />
            {session?.user?.email == 'antony.trupe@gmail.com' && (<>
              <div>
                <button onClick={createCharacter}>Create Character</button>
                <button onClick={createObject}>Create Object</button>
              </div>
              <div>
                <CommunityCreation action={createCommunity}>
                </CommunityCreation>
              </div>
            </>
            )}
          </div>
          {
            //the right side header stuff
          }
          <div className='actions'>
            {!session?.user && <Link href={'/api/auth/signin'}>Sign In</Link>}
            {!!session?.user &&
              <Link href={'/api/auth/signout'}  >
                <div>Sign Out</div>
                <div style={{ fontSize: "x-small" }}>{session.user.email?.slice(0, session.user.email.indexOf('@'))}</div>
              </Link>}

            {connected && player?.controlledCharacter && (<button onClick={() => { patrol() }}>Patrol</button>)}
            {connected && player?.controlledCharacter && (<button onClick={() => { controlCharacter("") }}>Un Control</button>)}
            {connected && player?.controlledCharacter && (<button onClick={() => { unClaim(player.controlledCharacter) }}>Abandon</button>)}
          </div>
        </div>

        {
          //middle row
        }
        <div

          style={{ display: 'flex', flexDirection: 'row', flexGrow: '1' }}>
          <canvas ref={canvasRef}
            className={`${styles.canvas} canvas`}
            width="800px"
            height="800px"
            //tabIndex={1}
            onWheel={onWheel}
            onClick={onClick}
            onContextMenu={onRightClick}
            onDoubleClick={onDoubleClick}

            onMouseMove={onMouseMove}
            data-testid="canvas" />
        </div >
        {chatMode && (<div
          className={`${styles.chatContainer} chatContainer`}>
          <input autoFocus value={chat} onChange={e => setChat(e.target.value)}></input>
        </div>)}
      </div>
    </>
  )
}