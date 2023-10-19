"use client"
import { MESSAGE_CLIENT_SEND, MESSAGE_SERVER_BROADCAST } from '@/CONSTANTS';
import styles from './CommandInput.module.scss'
import { useEffect, useState } from 'react';
import io, { Socket } from 'Socket.IO-client';
let socket: any;

export default function CommandInput({ msg }: { msg: string }) {

  //client
  const [input, setInput] = useState(msg)
  const [socketid, setSocketid] = useState(msg)

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
      setSocketid(socket.id)
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

  return (<>
    <div>socket:{socketid}</div>
    <input className={styles.commandInput}
      placeholder="Type something"
      value={input}
      onChange={onChangeHandler} />
  </>
  )
}
