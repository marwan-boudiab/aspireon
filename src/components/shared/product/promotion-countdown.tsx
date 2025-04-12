'use client';

import { useEffect, useState } from 'react';

interface CountdownTimerProps {
  endDate: Date | string;
}

const CountdownTimer = ({ endDate }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const currentTime = new Date();
      // Convert endDate to Date object if it's a string
      const promotionEndDate = endDate instanceof Date ? endDate : new Date(endDate);
      const timeDifference = Math.max(Number(promotionEndDate) - Number(currentTime), 0);

      setTimeLeft({
        days: Math.floor(timeDifference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((timeDifference % (1000 * 60)) / 1000),
      });
    };

    // Calculate initial time
    calculateTimeLeft();

    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <ul className="grid grid-cols-4">
      <StatBox label="Days" value={timeLeft.days} />
      <StatBox label="Hours" value={timeLeft.hours} />
      <StatBox label="Minutes" value={timeLeft.minutes} />
      <StatBox label="Seconds" value={timeLeft.seconds} />
    </ul>
  );
};

const StatBox = ({ label, value }: { label: string; value: number }) => (
  <li className="w-full p-4 text-center">
    <p className="text-3xl font-bold">{value}</p>
    <p>{label}</p>
  </li>
);

export default CountdownTimer;
