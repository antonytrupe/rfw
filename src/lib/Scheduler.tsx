import EventEmitter from 'events';

const SIXTY_PER_SEC = 1000 / 60;
const LOOP_SLOW_THRESH = 0.3;
const LOOP_SLOW_COUNT = 10;

/**
 * Scheduler class
 *
 */
export default class Scheduler extends EventEmitter{

    /**
     * schedule a function to be called
     *
     * @param {Object} options the options
     * @param {Function} options.tick the function to be called
     * @param {Number} options.period number of milliseconds between each invocation, not including the function's execution time
     * @param {Number} options.delay number of milliseconds to add when delaying or hurrying the execution
     */
    constructor(options) {
        super();
        this.options = Object.assign({
            tick: null,
            period: SIXTY_PER_SEC,
            delay: SIXTY_PER_SEC / 3
        }, options);
        this.nextExecTime = null;
        this.requestedDelay = 0;
        this.delayCounter = 0;

         
         

    }
 

    nextTick() {
        let stepStartTime = (new Date()).getTime();
        if (stepStartTime > this.nextExecTime + this.options.period * LOOP_SLOW_THRESH) {
            this.delayCounter++;
        } else
            this.delayCounter = 0;

        this.callTick();
        this.nextExecTime = stepStartTime + this.options.period + this.requestedDelay;
        this.requestedDelay = 0;
        setTimeout(this.nextTick.bind(this), this.nextExecTime - (new Date()).getTime());
    }

    callTick() {
        if (this.delayCounter >= LOOP_SLOW_COUNT) {
            this.emit('loopRunningSlow');
            this.delayCounter = 0;
        }
        this.options.tick();
    }

    /**
     * start the schedule
     * @return {Scheduler} returns this scheduler instance
     */
    start() {
        setTimeout(this.nextTick.bind(this));
        if (typeof window === 'object' && typeof window.requestAnimationFrame === 'function')
            window.requestAnimationFrame(this.nextTickChecker.bind(this));
        return this;
    }

    /**
     * delay next execution
     */
    delayTick() {
        this.requestedDelay += this.options.delay;
    }

    /**
     * hurry the next execution
     */
    hurryTick() {
        this.requestedDelay -= this.options.delay;
    }
}