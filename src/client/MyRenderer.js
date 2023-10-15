import { Renderer } from 'lance-gg';
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
        this.viewportWidth = window.innerWidth;
        this.viewportHeight = window.innerHeight; 

        if (document.readyState === 'complete' || document.readyState === 'loaded' || document.readyState === 'interactive') {
            this.onDOMLoaded();
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                this.onDOMLoaded();
            });
        }

        return new Promise((resolve, reject) => {
            this.gameEngine.emit('client__rendererReady');
        });
    }

    onDOMLoaded() {
        console.log('MyRenderer.onDOMLoaded')
        this.gameEngine.emit('client__rendererReady');

    }

    setupStage() {


    }

    setRendererSize() {
        this.viewportWidth = window.innerWidth;
        this.viewportHeight = window.innerHeight;

        this.bg1.width = this.viewportWidth;
        this.bg1.height = this.viewportHeight;
        this.bg2.width = this.viewportWidth;
        this.bg2.height = this.viewportHeight;
        this.bg3.width = this.viewportWidth;
        this.bg3.height = this.viewportHeight;
        this.bg4.width = this.viewportWidth;
        this.bg4.height = this.viewportHeight;

        this.renderer.resize(this.viewportWidth, this.viewportHeight);
    }

    draw(t, dt) {
        console.log('MyRenderer.draw')
        super.draw(t, dt);
    }
}