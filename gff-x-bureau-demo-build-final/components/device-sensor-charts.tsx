'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Generate initial sensor data
const generateInitialData = () => {
  const data = [];
  for (let i = 0; i < 50; i++) {
    data.push({
      time: i,
      x: Math.sin(i * 0.2) * 20 + Math.random() * 5,
      y: Math.cos(i * 0.2) * 30 + Math.random() * 5,
      z: Math.sin(i * 0.15) * 15 + Math.random() * 3,
    });
  }
  return data;
};

function useLiveChartData() {
  const [data, setData] = useState(generateInitialData());
  const [timeIndex, setTimeIndex] = useState(50);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeIndex((prev) => prev + 1);
      setData((prevData) => {
        const newData = [...prevData.slice(1)];
        const i = timeIndex + 1;
        newData.push({
          time: i,
          x: Math.sin(i * 0.2) * 20 + Math.random() * 5,
          y: Math.cos(i * 0.2) * 30 + Math.random() * 5,
          z: Math.sin(i * 0.15) * 15 + Math.random() * 3,
        });
        return newData;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [timeIndex]);

  return data;
}

export function GyroscopeChart() {
  const data = useLiveChartData();

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Gyroscope</h3>
      <div className="space-y-2 mb-4">
        <p className="text-sm text-muted-foreground">
          <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
          x: -0.014813471 rad/s
        </p>
        <p className="text-sm text-muted-foreground">
          <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>
          y: 0.017104214 rad/s
        </p>
        <p className="text-sm text-muted-foreground">
          <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
          z: 0.0033597562 rad/s
        </p>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="time" stroke="#999" />
          <YAxis stroke="#999" />
          <Tooltip contentStyle={{ backgroundColor: '#f5f5f5', border: '1px solid #e0e0e0' }} />
          <Line type="monotone" dataKey="x" stroke="#3b82f6" strokeWidth={2} dot={false} animationDuration={0} />
          <Line type="monotone" dataKey="y" stroke="#ef4444" strokeWidth={2} dot={false} animationDuration={0} />
          <Line type="monotone" dataKey="z" stroke="#10b981" strokeWidth={2} dot={false} animationDuration={0} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MagneticFieldChart() {
  const data = useLiveChartData();

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Magnetic Field</h3>
      <div className="space-y-2 mb-4">
        <p className="text-sm text-muted-foreground">
          <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
          x: -25.687502 µT
        </p>
        <p className="text-sm text-muted-foreground">
          <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>
          y: 9.262501 µT
        </p>
        <p className="text-sm text-muted-foreground">
          <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
          z: -29.643751 µT
        </p>
        <p className="text-sm font-medium text-foreground mt-3">Total: -46.068752 µT</p>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="time" stroke="#999" />
          <YAxis stroke="#999" />
          <Tooltip contentStyle={{ backgroundColor: '#f5f5f5', border: '1px solid #e0e0e0' }} />
          <Line type="monotone" dataKey="x" stroke="#3b82f6" strokeWidth={2} dot={false} animationDuration={0} />
          <Line type="monotone" dataKey="y" stroke="#ef4444" strokeWidth={2} dot={false} animationDuration={0} />
          <Line type="monotone" dataKey="z" stroke="#10b981" strokeWidth={2} dot={false} animationDuration={0} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function AccelerometerChart() {
  const data = useLiveChartData();

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Accelerometer</h3>
      <div className="space-y-2 mb-4">
        <p className="text-sm text-muted-foreground">
          <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
          x: -0.6843473 m/s²
        </p>
        <p className="text-sm text-muted-foreground">
          <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>
          y: 8.020741 m/s²
        </p>
        <p className="text-sm text-muted-foreground">
          <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
          z: 5.4484572 m/s²
        </p>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="time" stroke="#999" />
          <YAxis stroke="#999" />
          <Tooltip contentStyle={{ backgroundColor: '#f5f5f5', border: '1px solid #e0e0e0' }} />
          <Line type="monotone" dataKey="x" stroke="#3b82f6" strokeWidth={2} dot={false} animationDuration={0} />
          <Line type="monotone" dataKey="y" stroke="#ef4444" strokeWidth={2} dot={false} animationDuration={0} />
          <Line type="monotone" dataKey="z" stroke="#10b981" strokeWidth={2} dot={false} animationDuration={0} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
