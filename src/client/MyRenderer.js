import { Renderer } from 'lance-gg';
import Character from '../common/Character';
import Utils from '../common/Utils';

/**
 * Renderer for the Spaaace client - based on Pixi.js
 */
export default class MyRenderer extends Renderer {

    // TODO: document
    constructor(gameEngine, clientEngine) {
        super(gameEngine, clientEngine);
    }

    init() {
        console.log('MyRenderer.init')
        return super.init().then(() => {
            
            this.viewportWidth = window.innerWidth;
            this.viewportHeight = window.innerHeight;

            if (document.readyState === 'complete' || document.readyState === 'loaded' || document.readyState === 'interactive') {
                this.onDOMLoaded();
            } else {
                document.addEventListener('DOMContentLoaded', () => {
                    this.onDOMLoaded();
                });
            }

        })
    }

    onDOMLoaded() {
        console.log('MyRenderer.onDOMLoaded')
        console.log('emitting client__rendererReady')

        this.gameEngine.emit('client__rendererReady');

    }

    draw(t, dt) {
        //console.log('MyRenderer.draw')
        super.draw(t, dt);

        function updateEl(el, obj) {
            let health = obj.health > 0 ? obj.health : 15;
            el.style.top = obj.position.y + 10 + 'px';
            el.style.left = obj.position.x + 'px';
            el.style.background = `#ff${health.toString(16)}f${health.toString(16)}f`;
        }

        let characters = this.gameEngine.world.queryObjects({ instanceType: Character });
        if (characters.length !== 2) return;
        updateEl(document.querySelector('.paddle1'), characters[0]);
        updateEl(document.querySelector('.paddle2'), characters[1]);
    }
}