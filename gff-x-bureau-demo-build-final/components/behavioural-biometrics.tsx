'use client';

import { useEffect, useRef } from 'react';

function GaugeChart({ score }: { score: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H * 0.78;
    const r = W * 0.38;
    const startAngle = Math.PI;
    const endAngle = 2 * Math.PI;

    ctx.clearRect(0, 0, W, H);

    // Draw arc segments: green 0-50, orange 50-75, red 75-100
    const segments = [
      { from: 0, to: 50, color: '#22c55e' },
      { from: 50, to: 75, color: '#f97316' },
      { from: 75, to: 100, color: '#dc2626' },
    ];

    segments.forEach(({ from, to, color }) => {
      const a1 = startAngle + (from / 100) * Math.PI;
      const a2 = startAngle + (to / 100) * Math.PI;
      ctx.beginPath();
      ctx.arc(cx, cy, r, a1, a2);
      ctx.strokeStyle = color;
      ctx.lineWidth = 22;
      ctx.lineCap = 'round';
      ctx.stroke();
    });

    // Needle
    const needleAngle = startAngle + (score / 100) * Math.PI;
    const needleLen = r * 0.72;
    const nx = cx + needleLen * Math.cos(needleAngle);
    const ny = cy + needleLen * Math.sin(needleAngle);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(nx, ny);
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Center dot
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, 2 * Math.PI);
    ctx.fillStyle = '#374151';
    ctx.fill();


  }, [score]);

  return (
    <div className="flex flex-col items-center">
      <canvas ref={canvasRef} width={220} height={130} />
      <p className="text-xs text-muted-foreground -mt-2">Risk Score</p>
      <p className="text-2xl font-bold" style={{ color: '#f97316' }}>{score.toFixed(3)}</p>
    </div>
  );
}

export function BehaviouralBiometrics() {
  const metrics = [
    { label: 'User Similarity Score', value: '32' },
    { label: 'Bot detection score', value: '0.0' },
    { label: 'Auto fill activity', value: 'LOW' },
    { label: 'Background push activity', value: 'LOW' },
    { label: 'Copy paste activity', value: 'LOW' },
    { label: 'Field focus activity', value: 'LOW' },
    { label: 'Session duration', value: '87' },
    { label: 'Swipe activity detected', value: 'false' },
  ];

  const deviceMetrics = [
    { label: 'Special chars', value: 0 },
    { label: 'Keystrokes', value: 0 },
    { label: 'Backspaces', value: 0 },
    { label: 'Field count', value: 2 },
    { label: 'Taps', value: 0 },
    { label: 'Swipe', value: 0 },
    { label: 'Scroll', value: 0 },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Behavioural Biometrics Results</h2>
        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
        </svg>
      </div>

      {/* Behavioural Risk Level */}
      <div className="bg-green-50 border border-green-100 rounded-lg px-4 py-3 flex items-center gap-3">
        <svg className="w-5 h-5 text-green-600 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
        </svg>
        <div>
          <p className="text-xs text-green-700 font-medium">Behavioural Risk Level</p>
          <p className="text-sm font-bold text-green-700">Low</p>
        </div>
      </div>

      {/* Gauge */}
      <div className="flex justify-center">
        <GaugeChart score={42} />
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-3">
        {metrics.map(({ label, value }) => (
          <div key={label}>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-sm font-bold text-foreground">{value}</p>
          </div>
        ))}
      </div>

      {/* On Device Metrics */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-4 h-4 text-foreground" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1M4.22 4.22l.707.707M18.364 18.364l.707.707M1 12h2m18 0h2M4.22 19.78l.707-.707M18.364 5.636l.707-.707" />
          </svg>
          <p className="text-xs font-bold text-foreground">On Device Metrics Result:</p>
        </div>
        <div className="space-y-1">
          {deviceMetrics.map(({ label, value }) => (
            <p key={label} className="text-xs text-foreground">
              {label}: <span className="font-semibold">{value}</span>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
