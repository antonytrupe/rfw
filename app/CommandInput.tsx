"use client"
import styles from './CommandInput.module.scss'

//import { DefaultEventsMap } from '@socket.io/component-emitter';
import { useEffect, useState } from 'react';
import io, { Socket } from 'Socket.IO-client';
let socket: any;

export const MESSAGE_CLIENT_SEND = "message.client.send"
export const MESSAGE_SERVER_BROADCAST = "message.server.broadcast"


export default function CommandInput({ msg }: { msg: string }) {

  //client
  const [input, setInput] = useState(msg)

  //client
  useEffect(() => {
    console.log('useEffect')
    socketInitializer()
  }, [])

  //client
  const socketInitializer = async () => {
    
    await fetch('/api/chat');
    
    socket = io()
/**/
    socket.on('connect', () => {
      console.log('connected')
    })

    socket.on(MESSAGE_SERVER_BROADCAST, (msg: any) => {
      console.log('socket.on update-input', msg)

      setInput(msg)
    })
    
  }

  //client
  const onChangeHandler = (e: any) => {
    setInput(e.target.value)
    socket.emit(MESSAGE_CLIENT_SEND, e.target.value)
    console.log('socket.emit input-change', e.target.value)
  }

  return (
    <input className={styles.commandInput}
      placeholder="Type something"
      value={input}
      onChange={onChangeHandler}
    />
  )
}
