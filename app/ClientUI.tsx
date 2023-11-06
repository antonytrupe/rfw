"use client"
import styles from './UI.module.scss'
import { MutableRefObject, useEffect, useRef, useState, } from 'react'
import ClientEngine from '@/ClientEngine';
import EventEmitter from 'events';
import * as CONSTANTS from '@/CONSTANTS';
import Character from '@/Character';
import CharacterUI from './CharacterUI';
import CommunityCreation from './CommunityCreation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
//import steamworks from 'steamworks.js';

//steamworks.electronEnableSteamOverlay()
//const client = steamworks.init()
//console.log(client.localplayer.getName())

export default function ClientUI() {
  //@ts-ignore
  const canvasRef: MutableRefObject<HTMLCanvasElement> = useRef(null)

  const getCanvas: () => HTMLCanvasElement = () => {
    return canvasRef.current
  }

  const [clientEngine, setClientEngine] = useState<ClientEngine>()
  const [connected, setConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [controlledCharacter, setControlledCharacter] = useState<Character>()
  const [selectedCharacters, setSelectedCharacters] = useState<Character[]>([])
  const [claimedCharacters, setClaimedCharacters] = useState<Character[]>([])

  useEffect(() => {
    let eventEmitter: EventEmitter = new EventEmitter()

    eventEmitter.on(CONSTANTS.CLAIMED_CHARACTERS, (claimedCharacters: Character[]) => {
      setClaimedCharacters(claimedCharacters)
    })

    eventEmitter.on(CONSTANTS.SELECTED_CHARACTERS, (selectedCharacters: Character[]) => {
      setSelectedCharacters(selectedCharacters)
    })

    //CONSTANTS.CONTROL_CHARACTER
    eventEmitter.on(CONSTANTS.CONTROL_CHARACTER, (controlledCharacter: Character) => {
      setControlledCharacter(controlledCharacter)
    })

    eventEmitter.on(CONSTANTS.DISCONNECT, () => {
      setConnected(false)
      setConnecting(false)
    })

    eventEmitter.on(CONSTANTS.CONNECT, () => {
      setConnected(true)
      setConnecting(false)
    })

    const ce = new ClientEngine(eventEmitter, getCanvas);
    setClientEngine(ce)

    return () => {
      disconnect()

      //stop the current client engine's draw loop/flag
      ce.stopped = true
    }
  }, [])

  useEffect(() => {
    //connect automatically once the clientengine is setup
    connect()
  }, [clientEngine])

  function connect() {
    setConnecting(true)
    clientEngine?.connect()
  }

  const onClick = (event: any) => {
    clientEngine?.clickHandler(event)
  }

  const onKeyDown = (e: any) => {
    clientEngine?.keyDownHandler(e)
  }

  const onKeyUp = (e: any) => {
    clientEngine?.keyUpHandler(e)
  }

  const onWheel = (e: any) => {
    clientEngine?.wheelHandler(e)
  }

  function disconnect() {
    clientEngine?.disconnect()
    setConnected(false)
  }

  const createCharacter = () => {
    clientEngine?.createCharacter()
  }

  const createCommunity = (options: { size: string, race: string }) => {
    clientEngine?.createCommunity(options)
  }

  const castSpell = (casterId: string, spellName: string, targets: string[]) => {
    clientEngine?.castSpell(casterId, spellName, targets)
  }

  const claimCharacter = (characterId: string) => {

    clientEngine?.claim(characterId)
    const c = clientEngine?.getCharacter(characterId)
    if (c) {
      setClaimedCharacters([...claimedCharacters, c])
    }
  }

  const focusCharacter = (characterId: string) => {
    if (clientEngine) {
      const c = clientEngine.getCharacter(characterId)
      // clientEngine.gameEngine.gameWorld.getCharacter(characterId)
      if (c) {
        clientEngine.focus(characterId)
        //clientEngine.selectedCharacters = [c]
        //setSelectedCharacters([c])
      }
    }
  }

  function controlCharacter(characterId: string) {
    clientEngine?.control(characterId)
    setControlledCharacter(clientEngine?.getCharacter(characterId))
  }

  const { data: session } = useSession();

  return (
    <>
      {
        //header row
      }
      <div style={{}}>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', height: '128px', }}>
          <div className={`${styles.hud} ${styles.flexRow} `}>
            <div>
              {connected && (<button onClick={createCharacter}>Create Character</button>)}
            </div>
            <div>
              {connected && (
                <CommunityCreation action={createCommunity}>
                </CommunityCreation>
              )}
            </div>
          </div>
          {
            //the right side header stuff
          }
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', padding: '4px' }}>
            {!session?.user && <Link href={'/api/auth/signin'}>Sign In</Link>}
            {!!session?.user && <><span style={{}}>{session.user.email}</span>
              <Link href={'/api/auth/signout'} style={{ border: ' thin black solid', borderRadius: '6px' }}>Sign Out</Link></>}
            {!connected && (<button disabled={connecting} onClick={connect}>connect</button>)}
            {connected && (<button onClick={disconnect}>Disconnect</button>)}
          </div>
        </div>
      </div>
      {
        //middle row
      }
      <div style={{ display: 'flex', flexDirection: 'row', flexGrow: '1' }}>
        <canvas ref={canvasRef}
          className={`${styles.canvas} canvas`}
          width="800px"
          height="800px"
          tabIndex={1}
          onWheel={onWheel}
          onClick={onClick}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          data-testid="canvas" />
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: '200px' }}>
          {
            // characters
          }
          <div className={`${styles.characterList}`}>
            {
              // controlled character
              controlledCharacter &&
              <CharacterUI character={controlledCharacter} key={controlledCharacter.id}
                isControlled={true}
                isSelected={selectedCharacters.some(c => c.id == controlledCharacter.id)}
                isClaimed={claimedCharacters.some(c => c.id == controlledCharacter.id)} >
                {
                  //<button className={`btn`} onClick={() => castSpell(controlledCharacter.id, 'DISINTEGRATE', [controlledCharacter.id])}>Disintegrate</button>
                }
                {
                  //only show the claim button if the character isn't claimed
                  !controlledCharacter.playerId && session?.user?.email && <button className={`btn`} onClick={() => claimCharacter(controlledCharacter.id)}>Claim</button>}
                {
                  //only show the focus button if its not already selected
                  !selectedCharacters.some(c => c.id == controlledCharacter.id) && <button className={`btn`} onClick={() => focusCharacter(controlledCharacter.id)}>Focus</button>}
              </CharacterUI>
            }
            {
              // selected characters
              selectedCharacters && selectedCharacters.map((character: Character) => {
                if (character.id != controlledCharacter?.id) {
                  return <CharacterUI character={character} key={character.id}
                    isControlled={controlledCharacter?.id == character.id}
                    isSelected={selectedCharacters.some(c => c.id == character.id)}
                    isClaimed={claimedCharacters.some(c => c.id == character.id)}
                  >{
                      //<button className={`btn`} onClick={() => castSpell(character.id, 'DISINTEGRATE', [character.id])}>Disintegrate</button>
                    }
                    {
                      //only show the claim button if the character isn't claimed
                      !character.playerId && session?.user?.email && <button className={`btn`} onClick={() => claimCharacter(character.id)}>Claim</button>}
                    {
                      //show the focus button
                      <button className={`btn`} onClick={() => focusCharacter(character.id)}>Focus</button>
                    }
                    {
                      //  show the control button for claimed characters
                      claimedCharacters.some(c => c.id == character.id) &&
                      <button className={`btn`} onClick={() => controlCharacter(character.id)}>Control</button>} </CharacterUI>
                }
              })
            }
            {
              //my claimed characters
              claimedCharacters && claimedCharacters.map((character: Character) => {
                //make sure we didn't already show it as a controlled or selected character
                if (character.id != controlledCharacter?.id && !selectedCharacters.some((c) => { return c.id == character.id })) {
                  // console.log(character.id)
                  return <CharacterUI character={character} key={character.id}
                    isControlled={controlledCharacter?.id == character.id}
                    isSelected={selectedCharacters.some(c => c.id == character.id)}
                    isClaimed={claimedCharacters.some(c => c.id == character.id)}>
                    {
                      //<button className={`btn`} onClick={() => castSpell(character.id, 'DISINTEGRATE', [character.id])}>Disintegrate</button>
                    }
                    {
                      //only show the claim button if the character isn't claimed
                      !character.playerId && session?.user?.email && <button className={`btn`} onClick={() => claimCharacter(character.id)}>Claim</button>}
                    {
                      //only show the focus button if its not already selected
                      !selectedCharacters.some(c => c.id == character.id) && <button className={`btn`} onClick={() => focusCharacter(character.id)}>Focus</button>}
                    {
                      //always show the control button for claimed characters
                      <button className={`btn`} onClick={() => controlCharacter(character.id)}>Control</button>}
                  </CharacterUI>
                }
              })}
          </div>
        </div>
      </div>
    </>
  )
}