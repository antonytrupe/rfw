import { GameEngine, TwoVector, KeyboardControls, SimplePhysicsEngine } from 'lance-gg';
import Character from './Character'

const PADDING = 20;
const WIDTH = 400;
const HEIGHT = 400;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 50;

export default class MyGameEngine extends GameEngine {

    constructor(options) {
        console.log('Game.constructor')
        console.log('options',options)
        super(options);
        this.physicsEngine = new SimplePhysicsEngine({ gameEngine: this });

        // common code
        this.on('postStep', this.gameLogic.bind(this));

        // server-only code
        this.on('server__init', this.serverSideInit.bind(this));
        this.on('server__playerJoined', this.serverSidePlayerJoined.bind(this));
        this.on('server__playerDisconnected', this.serverSidePlayerDisconnected.bind(this));

        // client-only code
        this.on('client__rendererReady', this.clientSideInit.bind(this));
        //this.on('client__draw', this.clientSideDraw.bind(this));
    }

    registerClasses(serializer) {
        serializer.registerClass(Character);
    }

    gameLogic() {
        let characters = this.world.queryObjects({ instanceType: Character });
    }

    processInput(inputData, playerId) {
        super.processInput(inputData, playerId);

        console.log(inputData)

        // get the player paddle tied to the player socket
        let playerCharacter = this.world.queryObject({ playerId });
        if (playerCharacter) {
            if (inputData.input === 'up') {
                playerCharacter.position.y -= 5;
            }
            else if (inputData.input === 'down') {
                playerCharacter.position.y += 5;
            }
            else if (inputData.input === 'left') {
                playerCharacter.position.x -= 5;
            }
            else if (inputData.input === 'right') {
                playerCharacter.position.x += 5;
            }
        }
    }

    //
    // SERVER ONLY CODE
    //
    serverSideInit() {
        // create the paddles and the ball
        this.addObjectToWorld(new Character(this, null, { playerID: 0, position: new TwoVector(PADDING, 0) }));
        this.addObjectToWorld(new Character(this, null, { playerID: 0, position: new TwoVector(WIDTH - PADDING, 0) }));

    }

    // attach newly connected player to next available paddle
    serverSidePlayerJoined(ev) {
        console.log('player connected')
        let paddles = this.world.queryObjects({ instanceType: Character });
        if (paddles[0].playerId === 0) {
            paddles[0].playerId = ev.playerId;
        } else if (paddles[1].playerId === 0) {
            paddles[1].playerId = ev.playerId;
        }
    }

    serverSidePlayerDisconnected(ev) {
        let paddles = this.world.queryObjects({ instanceType: Character });
        if (paddles[0].playerId === ev.playerId) {
            paddles[0].playerId = 0;
        } else if (paddles[1].playerId === ev.playerId) {
            paddles[1].playerId = 0;
        }
    }

    //
    // CLIENT ONLY CODE
    //
    clientSideInit() {
        
      
    }

    clientSideDraw() {
        //console.log('MyGameEngine.clientSideDraw')

       
    }
}
