import { GameEngine, TwoVector, KeyboardControls, SimplePhysicsEngine } from 'lance-gg';
import Character from './Character'

const PADDING = 20;
const WIDTH = 400;
const HEIGHT = 400;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 50;

export default class Game extends GameEngine {

    constructor(options) {
        console.log('Game.constructor')
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
        this.on('client__draw', this.clientSideDraw.bind(this));
    }

    registerClasses(serializer) {
        serializer.registerClass(Character);
    }

    gameLogic() {
        //console.log('Game.gameLogic')

        let characters = this.world.queryObjects({ instanceType: Character });



    }

    processInput(inputData, playerId) {
        console.log('Game.processInput hot reloadddd')

        super.processInput(inputData, playerId);

        // get the player paddle tied to the player socket
        let playerCharacter = this.world.queryObject({ playerId });
        if (playerCharacter) {
            if (inputData.input === 'up') {
                playerCharacter.position.y -= 5;
            } else if (inputData.input === 'down') {
                console.log('down')

                playerCharacter.position.y += 5;
            }
            else if (inputData.input === 'left') {
                console.log('left')
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
        this.controls = new KeyboardControls(this.renderer.clientEngine);
        this.controls.bindKey('up', 'up', { repeat: true });
        this.controls.bindKey('down', 'down', { repeat: true });
        this.controls.bindKey('left', 'left', { repeat: true });
        this.controls.bindKey('right', 'right', { repeat: true });
    }

    clientSideDraw() {

        function updateEl(el, obj) {
            let health = obj.health > 0 ? obj.health : 15;
            el.style.top = obj.position.y + 10 + 'px';
            el.style.left = obj.position.x + 'px';
            el.style.background = `#ff${health.toString(16)}f${health.toString(16)}f`;
        }

        let characters = this.world.queryObjects({ instanceType: Character });
        if ( characters.length !== 2) return;
        updateEl(document.querySelector('.paddle1'), characters[0]);
        updateEl(document.querySelector('.paddle2'), characters[1]);
    }
}
