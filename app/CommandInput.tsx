"use client"
import { MESSAGE_CLIENT_SEND, MESSAGE_SERVER_BROADCAST } from '@/CONSTANTS';
import styles from './CommandInput.module.scss'

//import { DefaultEventsMap } from '@socket.io/component-emitter';
import { useEffect, useState } from 'react';
import io, { Socket } from 'Socket.IO-client';
let socket: any;




export default function CommandInput({ msg }: { msg: string }) {

  //client
  const [input, setInput] = useState(msg)

  //client
  useEffect(() => {
    socketInitializer()
  }, [])

  //client
  const socketInitializer = async () => {

    await fetch('/api/chat');

    socket = io()
    /**/
    socket.on('connect', () => {
      if (socket.id) {
        //console.log('chat connected')
        //console.log('chat socket.id', socket.id)
      }
    })

    socket.on(MESSAGE_SERVER_BROADCAST, (msg: any) => {
      //console.log('socket.on update-input', msg)

      setInput(msg)
    })

  }

  //client
  const onChangeHandler = (e: any) => {
    setInput(e.target.value)
    socket.emit(MESSAGE_CLIENT_SEND, e.target.value)
    //console.log('socket.emit input-change', e.target.value)
  }

  return (
    <input className={styles.commandInput}
      placeholder="Type something"
      value={input}
      onChange={onChangeHandler}
    />
  )
}
