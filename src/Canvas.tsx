"use client"
import styles from './Canvas.module.scss'
import { useCallback, useEffect, useRef, useState, } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { Player, addCurrentPlayer, addPlayer, moveCurrentPlayer, removePlayer, setCurrentPlayer, warpPlayer } from '../app/worldSlice';
import { Socket, io } from 'Socket.IO-client';
import { CONNECT, DISCONNECT, PC_CURRENT, PC_DISCONNECT, PC_JOIN, PC_LOCATION, PC_MOVE } from './CONSTANTS';
let socket: Socket;

function useReWrapper(fn: any) {
  const fnRef = useRef(fn);
  fnRef.current = fn;
  return fnRef;
}

export default function Canvas() {

  const canvasRef = useRef(null)
  const [socketid, setSocketId] = useState<string | undefined>()
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

      //console.log('world connected')
      console.log(CONNECT, socket.id)
      setSocketId(socket?.id)

      //disconnect handler
      socket.on(DISCONNECT, (reason) => {
        console.log('DISCONNECT', socket.id);
      });

      //pc disconnect
      socket.on(PC_DISCONNECT, (playerId) => {
        console.log('PC_DISCONNECT', playerId);
        dispatch(removePlayer(playerId))
      })

      //pc join
      socket.on(PC_JOIN, (player) => {
        console.log('PC_JOIN', player)
        dispatch(addPlayer(player))
      })

      //pc current
      socket.on(PC_CURRENT, (player) => {
        console.log('PC_CURRENT', player)
        dispatch(setCurrentPlayer(player))
      })

      //pc location data
      socket.on(PC_LOCATION, (player) => {
        //console.log('PC_LOCATION', player)
        //TODO 
        dispatch(warpPlayer(player))
      })
    })
  }

  const draw =  () => {
    console.log('draw')
    const canvas: HTMLCanvasElement | null = canvasRef.current
    // @ts-ignore
    const ctx: CanvasRenderingContext2D = canvas?.getContext('2d')
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;

    // Store the current transformation matrix
    ctx.save();

    // Use the identity matrix while clearing the canvas
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Restore the transform
    ctx.restore();


    players.forEach((player: Player) => {
      ctx.fillStyle = currentPlayer?.id == player.id ? '#009900' : '#000000'

      ctx.beginPath()
      ctx.arc(player.location.x, player.location.y, 10, 0, 2 * Math.PI)
      ctx.fill()
    })
  } 

  const drawRef = useRef(draw);


  const inputHandler3 = useCallback((e: any) => {
    const code = e.code
    //console.log('currentPlayer?.id', currentPlayer?.id);
    //console.log('socketid', socketid);
    if(!currentPlayer?.id)
    {
      console.log('no current player somehow')
      console.log('currentPlayer?.id',currentPlayer?.id)
    }
    if (code == 'KeyD') {
      dispatch(moveCurrentPlayer({ direction: { x: 1, y: 0 } }))
      socket.emit(PC_MOVE, { playerId: currentPlayer?.id, direction: { x: 1, y: 0 } })
    }
    else if (code == 'KeyA') {
      dispatch(moveCurrentPlayer({ direction: { x: -1, y: 0 } }))
      socket.emit(PC_MOVE, { playerId: currentPlayer?.id, direction: { x: -1, y: 0 } })
    }
    else if (code == 'KeyS') {
      dispatch(moveCurrentPlayer({ direction: { x: 0, y: 1 } }))
      socket.emit(PC_MOVE, { playerId: currentPlayer?.id, direction: { x: 0, y: 1 } })
    }
    else if (code == 'KeyW') {
      dispatch(moveCurrentPlayer({ direction: { x: 0, y: -1 } }))
      socket.emit(PC_MOVE, { playerId: currentPlayer?.id, direction: { x: 0, y: -1 } })
    }
  },[currentPlayer])

  //initial setup
  useEffect(() => {
    document.addEventListener('keydown', inputHandler3);
    //document.addEventListener('keyup', (e) => { }); 
    draw()
  }, [currentPlayer])

  useEffect(() => {
    draw()
  }, [players])

  return (<>
    <div>socket:{socketid}</div>
    <div>player:{currentPlayer?.id}</div>
    <div>player count:{players.length}</div>

    <canvas ref={canvasRef} className={styles.canvas} /></>)
}