'use server';

interface DeviceSession {
  deviceId: string;
  email: string;
  isAuthenticated: boolean;
  timestamp: number;
}

const VALID_DEVICE_CREDENTIALS = {
  email: 'sample@bank.com',
  password: 'sample',
};

let deviceSession: DeviceSession | null = null;

export function validateDeviceLogin(email: string, password: string): boolean {
  return email === VALID_DEVICE_CREDENTIALS.email && password === VALID_DEVICE_CREDENTIALS.password;
}

export function createDeviceSession(email: string): DeviceSession {
  const session: DeviceSession = {
    deviceId: Math.random().toString(36).substring(7),
    email,
    isAuthenticated: true,
    timestamp: Date.now(),
  };
  deviceSession = session;
  return session;
}

export function getDeviceSession(): DeviceSession | null {
  return deviceSession;
}

export function clearDeviceSession(): void {
  deviceSession = null;
}
