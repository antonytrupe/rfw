import React, { Component } from "react";
import "./style.css";

interface ClockState {
    time: Date;
}

export default class Clock extends Component<{}, ClockState> {
    private timerId: NodeJS.Timeout | null = null;

    constructor(props: {}) {
        super(props);
        this.state = {
            time: new Date(),
        };
    }

    componentDidMount() {
        this.timerId = setInterval(this.updateTime, 1000);
    }

    componentWillUnmount() {
        if (this.timerId) {
            clearInterval(this.timerId);
        }
    }

    updateTime = () => {
        this.setState({
            time: new Date(),
        });
    };

    render() {
        return (
            <div className="clock">
                <div
                    className="sec_hand"
                    style={{
                        transform: `rotateZ(${this.state.time.getSeconds() * 60}deg)`,
                    }}
                />
                <span className="six">6</span>
                <span className="one">1</span>
                <span className="two">2</span>
                <span className="three">3</span>
                <span className="four">4</span>
                <span className="five">5</span>
            </div>
        );
    }
}