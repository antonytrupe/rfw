"use client"
import './ClientUI.scss'

import styles from './UI.module.scss'
import { MutableRefObject, useEffect, useRef, useState, WheelEvent } from 'react'
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
    const observer = new ResizeObserver(() => {
      const canvas = getCanvas()
      canvas.width = canvas.clientWidth
      canvas.height = canvas.clientHeight
      console.log('resize')
    })
    observer.observe(canvasRef.current)

  },[])

  useEffect(() => {
    clientEngine?.stop()
    clientEngine?.start()

  }, [canvasRef]);

  const [chatHistory, setChatHistory] = useState<string>('')

  const [clientEngine, setClientEngine] = useState<ClientEngine>()
  const [chatMode, setChatMode] = useState<boolean>(false)
  const [chat, setChat] = useState<string>('')
  const { data: session } = useSession()

  /**
   * set up the client engine
   */
  useEffect(() => {
    const ce = new ClientEngine(getCanvas, updateChat)
    setClientEngine(ce)
    ce.start()

    return () => {
      ce.disconnect()
      //stop the current client engine's draw loop/flag
      ce.stop()
    }
  }, [])

  function updateChat(message: string): void {
    //console.log('chatHistory', chatHistory)
    setChatHistory((chatHistory + '\n' + message).trim())
  }

  //console.log('chatHistory', chatHistory)

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

  const onMouseDown = (event: any) => {
    event.stopPropagation()
    event.preventDefault()
  }

  const onDoubleClick = (event: any) => {
    event.stopPropagation()
    event.preventDefault()
    event.nativeEvent.stopImmediatePropagation()
    event.nativeEvent.stopPropagation()
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
    if (clientEngine) {
      const newLocal = clientEngine.getGamePosition(e.nativeEvent)
      const movement = { x: e.movementX, y: e.movementY }
      clientEngine.onMouseMove(newLocal, movement, e.buttons)
    }
  }

  const onKeyUp = (e: any) => {
    if (!chatMode) {
      clientEngine?.keyUpHandler(e)
    }
  }

  const onWheel = (e: WheelEvent) => {
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

      <Draggable nodeRef={clockRef}><div ref={clockRef}><Clock initialTime={clientEngine?.getCreateTime()}/></div></Draggable>

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
        onMouseDown={onMouseDown}
        onContextMenu={onRightClick}
        onDoubleClick={onDoubleClick}

        onMouseMove={onMouseMove}
        data-testid="canvas" />
      <div className='chatContainer'>
        <div tabIndex={0} className='chatHistoryContainer'>
          <textarea disabled value={chatHistory}>
          </textarea>
        </div>

        {chatMode && (<div
          className={`${styles.chatInputContainer} chatInputContainer`}>
          <input autoFocus value={chat} onChange={e => setChat(e.target.value)}></input>
        </div>)}
      </div>
    </div>

  )
}