import React, { useState, useEffect } from "react";
import "./style.css";

export default () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timerId = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => {
            clearInterval(timerId);
        };
    }, []);

    return (
        <div className="clock">
            <div
                className="sec_hand"
                style={{
                    transform: `rotateZ(${time.getSeconds() * 60 + 60}deg)`
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
};