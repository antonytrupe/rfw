"use client"
import { useEffect, useRef, useState } from 'react'
//import io, { Socket } from 'Socket.IO-client';

import styles from './Canvas.module.scss'
//import { DefaultEventsMap } from '@socket.io/component-emitter';
import { PC_LOCATION } from '../pages/api/world';
import { Socket } from 'Socket.IO';
let socket:Socket;

//{ inputHandler, }: { inputHandler?: any, }
export default function Canvas({ inputHandler, }: { inputHandler?: any, }) {

  const canvasRef = useRef(null)

  //client
  const [worldData, setWorldData] = useState({})


  //client
  useEffect(() => {
    console.log('useEffect')
    socketInitializer()
  }, [])

  //client
  const socketInitializer = async () => {
    /*
    await fetch('/api/world');
    socket = io()

    socket.on('connect', () => {
      console.log('world connected')
      console.log('world socket.id', socket.id)
    })

    socket.on(PC_LOCATION, (newData: any) => {
      console.log('world socket.on pc_location', newData)

      setWorldData({ ...worldData, newData })
    })
    */
  }


  const draw = () => {
    const canvas: HTMLCanvasElement | null = canvasRef.current
    // @ts-ignore
    const ctx: CanvasRenderingContext2D = canvas?.getContext('2d')
    //Our first draw
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    ctx.fillStyle = '#000000'
    ctx.beginPath()
    ctx.arc(55, 66, 10, 0, 2 * Math.PI)
    ctx.fill()
  }



  //initial setup
  useEffect(() => {
    document.addEventListener('keydown', (e) => { !!inputHandler && inputHandler(e.code) });
    //document.addEventListener('keyup', (e) => { }); 
    draw()
  }, [])



  return <canvas ref={canvasRef} className={styles.canvas} />
}