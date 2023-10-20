"use client"
import styles from './UI.module.scss'
import { useRef, } from 'react'
import ClientEngine from '../src/ClientEngine';
import GameEngine from '../src/GameEngine';
import EventEmitter from 'events';
import { Player } from './worldSlice';

let eventEmitter = new EventEmitter()
let gameEngine = new GameEngine(eventEmitter)
let clientEngine = new ClientEngine(eventEmitter)


export default function UI() {

  const canvasRef = useRef(null)

  const draw = () => {
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


    gameEngine.characters.forEach((player: Player) => {
      ctx.fillStyle = gameEngine.currentPlayer?.id == player.id ? '#009900' : '#000000'

      ctx.beginPath()
      ctx.arc(player.location.x, player.location.y, 10, 0, 2 * Math.PI)
      ctx.fill()
    })



  }

  const connect = () => {
    clientEngine.connect()
  }

  const createPC = () => {
    clientEngine.createPC()
  }

  return (
    <>
      <button onClick={connect}>connect</button>
      <button onClick={createPC}>Create PC</button>
      <canvas ref={canvasRef} className={styles.canvas} />
    </>
  )
}