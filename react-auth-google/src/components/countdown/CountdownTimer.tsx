import React from 'react';
import DateTimeDisplay from './DateTimeDisplay';
import { useCountdown } from './useCountdown';

interface IShowCounterParams {
  hours: number;
  minutes: number;
  seconds: number;
}

interface ICountdownTimerParams {
  targetDate: number;
  isConfigReady: boolean;
}

const ExpiredNotice = () => {
  return (
    <div className="expired-notice">
      <span>Token Expired</span>
    </div>
  );
};

const ConfigNotReady = () => {
  return (
    <div className="expired-notice">
      <span>Missing Config</span>
    </div>
  );
};

const ShowCounter = ({ hours, minutes, seconds }: IShowCounterParams) => {
  return (
    <div className="countdown-wrapper">
      <div>Token valid for:</div>
      <div className="countdown">
        <DateTimeDisplay value={hours} />
        h
        <DateTimeDisplay value={minutes} />
        mn
        <DateTimeDisplay value={seconds} />s
      </div>
    </div>
  );
};

const CountdownTimer = ({
  targetDate,
  isConfigReady
}: ICountdownTimerParams) => {
  const [hours, minutes, seconds] = useCountdown(targetDate);

  if (!isConfigReady) {
    return <ConfigNotReady />;
  } else if (hours + minutes + seconds <= 0) {
    return <ExpiredNotice />;
  } else {
    return <ShowCounter hours={hours} minutes={minutes} seconds={seconds} />;
  }
};

export default CountdownTimer;
