"use client"
import { DefaultEventsMap } from '@socket.io/component-emitter';
import { useEffect, useState } from 'react';
import io, { Socket } from 'Socket.IO-client';
let socket: Socket<DefaultEventsMap, DefaultEventsMap>;

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
    await fetch('/api/socket');
    socket = io()

    socket.on('connect', () => {
      console.log('connected')
    })

    socket.on('update-input', (msg: any) => {
      console.log('socket.on update-input',msg)

      setInput(msg)
    })
  }

  //client
  const onChangeHandler = (e: any) => {
    setInput(e.target.value)
    socket.emit('input-change', e.target.value)
    console.log('socket.emit input-change',e.target.value)
  }

  return (
    <input
      placeholder="Type something"
      value={input}
      onChange={onChangeHandler}
    />
  )
}
