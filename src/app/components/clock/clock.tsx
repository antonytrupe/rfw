import React, { useState, useEffect } from "react";
import "./style.css";

const Clock = ({ initialTime }: { initialTime?: Date }) => {
    const [time, setTime] = useState(initialTime);

    useEffect(() => {
        let isMounted = true; // Flag to track component mount status

        const updateClock = () => {
            if (isMounted) {
                setTime(new Date());
            }
        };

        const timerId = setInterval(updateClock, 1000);

        return () => {
            isMounted = false; // Mark the component as unmounted
            clearInterval(timerId);
        };
    }, []);

    return (
        <div className="clock">
            {!!time &&
                <div
                    className="sec_hand"
                    style={{
                        transform: `rotateZ(${time.getSeconds() * 60 + 60}deg)`
                    }}
                />
            }
            <span className="six">6</span>
            <span className="one">1</span>
            <span className="two">2</span>
            <span className="three">3</span>
            <span className="four">4</span>
            <span className="five">5</span>
        </div>
    );
};

export default Clock;