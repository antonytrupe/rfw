import { useState, useEffect } from "react";
import "./style.css";

const Clock = ({ initialTime }: { initialTime?: number }) => {
    const [time, setTime] = useState<Date>();
    //const [createTime, setCreateTime] = useState(initialTime);

    //console.log(initialTime)

    useEffect(() => {

        const updateClock = () => {
            //console.log(Date.now())
            //console.log(initialTime)
            //console.log(createTime)
            setTime(new Date(Date.now() - initialTime))
  
        };

        const timerId = setInterval(updateClock.bind(this), 1000);

        return () => {
            clearInterval(timerId);
        };
    }, [ initialTime]);

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
            <span className="six">0</span>
            <span className="one">1</span>
            <span className="two">2</span>
            <span className="three">3</span>
            <span className="four">4</span>
            <span className="five">5</span>
        </div>
    );
};

export default Clock;