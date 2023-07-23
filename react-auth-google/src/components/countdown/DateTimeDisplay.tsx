import React from 'react';

interface IDateTimeDisplayParams {
  value: number;
}

const DateTimeDisplay = ({ value }: IDateTimeDisplayParams) => {
  return <div className={'countdown-unit'}>{value}</div>;
};

export default DateTimeDisplay;
