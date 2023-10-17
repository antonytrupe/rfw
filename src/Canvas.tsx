"use client"
import styles from './Canvas.module.scss'
import { useEffect, useRef, } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { Player, addCurrentPlayer, moveCurrentPlayer } from '../app/worldSlice';
import { Socket, io } from 'Socket.IO-client';
import { CONNECT, DISCONNECT } from './CONSTANTS';
let socket: Socket;

export default function Canvas({ inputHandler, }: { inputHandler?: any, }) {

  const canvasRef = useRef(null)
  const players = useSelector((state: RootState) => state.world.players)
  const currentPlayer = useSelector((state: RootState) => state.world.currentPlayer)

  const dispatch = useDispatch()

  //client
  useEffect(() => {
    socketInitializer()
  }, [])

  //client
  const socketInitializer = async () => {

    await fetch('/api/world');

    socket = io()

    socket.on(CONNECT, () => {

      socket.on(DISCONNECT, (reason) => {
        // ...
      });

      if (socket.id) {
        //console.log('world connected')
        //console.log('world socket.id', socket.id)
        let x = Math.random() * 400
        let y = Math.random() * 400
        let p: Player = { id: socket.id, location: { x: x, y: y } }
        dispatch(addCurrentPlayer(p))

      }
    })

    socket.on("disconnect", () => {
      console.log('disconnect', socket.id);
    });
    /*
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
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    players.forEach((player: Player) => {
      ctx.fillStyle = currentPlayer?.id == player.id ? '#009900' : '#000000'

      ctx.beginPath()
      ctx.arc(player.location.x, player.location.y, 10, 0, 2 * Math.PI)
      ctx.fill()
    })

  }



  const inputHandler3 = (e: any) => {
    const code = e.code
    console.log('document keydown even handler', code);
    if (code == 'KeyD') {
      dispatch(moveCurrentPlayer({ direction: { x: 1, y: 0 } }))
      socket.emit('client_pc_move', { direction: { x: 1, y: 0 } })
    }
    else if (code == 'KeyA') {
      dispatch(moveCurrentPlayer({ direction: { x: -1, y: 0 } }))
    }
    else if (code == 'KeyS') {
      dispatch(moveCurrentPlayer({ direction: { x: 0, y: 1 } }))
    }
    else if (code == 'KeyW') {
      dispatch(moveCurrentPlayer({ direction: { x: 0, y: -1 } }))
    }
  }

  //initial setup
  useEffect(() => {
    document.addEventListener('keydown', inputHandler3);
    //document.addEventListener('keyup', (e) => { }); 
    draw()
  }, [])

  useEffect(() => {
    draw()
  }, [players])

  return <canvas ref={canvasRef} className={styles.canvas} />
}