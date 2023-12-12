"use client"
import './ClientUI.scss'

import styles from './UI.module.scss'
import { MutableRefObject, useEffect, useRef, useState, } from 'react'
import ClientEngine from '@/ClientEngine'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Clock from './components/clock/clock'
import Draggable from 'react-draggable';

//import steamworks from 'steamworks.js'

//steamworks.electronEnableSteamOverlay()
//const client = steamworks.init()

export default function ClientUI() {
  //@ts-ignore
  const canvasRef: MutableRefObject<HTMLCanvasElement> = useRef(null)

  const getCanvas: () => HTMLCanvasElement = () => {
    return canvasRef.current
  }

  useEffect(() => {
    clientEngine?.stop()
    clientEngine?.start()

  }, [canvasRef]);

  const [clientEngine, setClientEngine] = useState<ClientEngine>()
  //const [connected, setConnected] = useState(false)
  //const [player, setPlayer] = useState<Player>()
  //const [hoveredCharacter, setHoveredCharacter] = useState<Character>()
  const [chatMode, setChatMode] = useState<boolean>(false)
  const [chat, setChat] = useState<string>('')
  const { data: session } = useSession()

  /**
   * set up the event emitter and client engine
   */
  useEffect(() => {
    //let eventEmitter: EventEmitter = new EventEmitter()



    const ce = new ClientEngine(getCanvas)
    setClientEngine(ce)

    return () => {
      //eventEmitter.removeAllListeners()
      ce.disconnect()
      //setConnected(false)
      //stop the current client engine's draw loop/flag
      ce.stop()
    }
  }, [])

  /**
   * connect the client engine to the server/socket
   */
  useEffect(() => {
    //connect automatically once the clientengine is setup
    if (!clientEngine?.connected) {
      //setConnecting(true)
      clientEngine?.connect()
    }
  }, [clientEngine])

  const onClick = (event: any) => {
    clientEngine?.clickHandler(event)
  }

  const onDoubleClick = (event: any) => {
    clientEngine?.doubleClickHandler(event)
  }

  function onRightClick(event: any): void {
    event.stopPropagation()
    event.preventDefault()
    //console.log('right click')
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

  const onMouseMove = (e: React.MouseEvent) => {
    clientEngine?.onMouseMove(clientEngine.getMousePosition(e.nativeEvent))
  }

  const onKeyUp = (e: any) => {
    if (!chatMode) {
      clientEngine?.keyUpHandler(e)
    }
  }

  const onWheel = (e: any) => {
    clientEngine?.wheelHandler(e)
  }

  const containerRef = useRef<HTMLDivElement>(null)
  const clockRef = useRef(null);

  return (

    <div
      autoFocus
      ref={containerRef}
      tabIndex={chatMode ? 1 : 1}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      style={{ height: '100%' }}>

      <Draggable nodeRef={clockRef}><div ref={clockRef}><Clock /></div></Draggable>

      {!session?.user && <Link href={'/api/auth/signin'} className='session action signin'>Sign In</Link>}
      {!!session?.user && <Link href={'/api/auth/signout'} className='signOut session action' >
        <div>Sign Out</div>
        <div style={{ fontSize: "x-small" }}>{session.user.email?.slice(0, session.user.email.indexOf('@'))}</div>
      </Link>}

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

      {chatMode && (<div
        className={`${styles.chatContainer} chatContainer`}>
        <input autoFocus value={chat} onChange={e => setChat(e.target.value)}></input>
      </div>)}
    </div>

  )
}