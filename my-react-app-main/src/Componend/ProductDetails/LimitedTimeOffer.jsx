import React, { useEffect, useState } from 'react';

const LimitedTimeOffer = ({ durationInHours = 2 }) => {
  const [timeLeft, setTimeLeft] = useState(durationInHours * 60 * 60);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
    <div className="mt-3 bg-red-700 text-white px-4 py-2 rounded text-sm font-semibold animate-pulse w-fit">
      🕒 Limited-Time Offer: <span className="ml-1">{formatTime(timeLeft)}</span>
    </div>
  );
};

export default LimitedTimeOffer;

