'use client';

import { useEffect, useState, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const WINDOW = 60;

function generatePoint(i: number) {
  return {
    time: i,
    y: 30 + Math.sin(i / 10) * 8 + Math.random() * 3,
    z: -5 + Math.cos(i / 15) * 3 + Math.random() * 2,
    x: -45 + Math.sin(i / 12) * 8 + Math.random() * 2,
  };
}

function useStreamingData() {
  const [data, setData] = useState(() =>
    Array.from({ length: WINDOW }, (_, i) => generatePoint(i))
  );
  const tickRef = useRef(WINDOW);

  useEffect(() => {
    const id = setInterval(() => {
      tickRef.current += 1;
      const next = generatePoint(tickRef.current);
      setData((prev) => [...prev.slice(1), next]);
    }, 120);
    return () => clearInterval(id);
  }, []);

  return data;
}

export function BehavioralActionsChart() {
  const data = useStreamingData();
  const latest = data[data.length - 1];

  return (
    <div className="bg-blue-50 rounded-lg p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <svg
            className="w-6 h-6 text-primary"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-foreground">User Behavioral Actions</h3>
      </div>

      <div className="space-y-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-primary"></div>
          <span className="text-foreground font-medium">Orientation: {latest.y.toFixed(6)}°</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-foreground font-medium">Y: {latest.x.toFixed(6)}°</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-foreground font-medium">Z: {latest.z.toFixed(7)}°</span>
        </div>
      </div>

      <h4 className="text-lg font-semibold text-foreground mb-4">User touch actions</h4>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey="time"
            stroke="#999"
            tick={{ fontSize: 12 }}
          />
          <YAxis
            stroke="#999"
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e0e0e0',
              borderRadius: '4px',
            }}
          />
          <Line type="monotone" dataKey="y" stroke="#3b82f6" dot={false} strokeWidth={2} animationDuration={0} />
          <Line type="monotone" dataKey="z" stroke="#22c55e" dot={false} strokeWidth={2} animationDuration={0} />
          <Line type="monotone" dataKey="x" stroke="#ef4444" dot={false} strokeWidth={2} animationDuration={0} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
