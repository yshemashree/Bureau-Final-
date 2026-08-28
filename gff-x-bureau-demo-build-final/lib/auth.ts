export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface AuthSession {
  user: User;
  token: string;
}

const DEMO_CREDENTIALS = {
  email: 'global@bureau.id',
  password: 'User@123',
};

const USER_DEMO_CREDENTIALS = {
  email: 'user@demo.com',
  password: 'User@123',
};

const MERCHANT_DEMO_CREDENTIALS = {
  email: 'merchant@demo.com',
  password: 'Merchant@123',
};

export async function authenticateUser(email: string, password: string): Promise<AuthSession> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (email !== DEMO_CREDENTIALS.email || password !== DEMO_CREDENTIALS.password) {
    throw new Error('Invalid email or password');
  }

  const session: AuthSession = {
    user: {
      id: 'user_001',
      email: email,
      name: 'Global Administrator',
      role: 'admin',
    },
    token: 'demo_token_' + Date.now(),
  };

  if (typeof window !== 'undefined') {
    // Clear any lingering end-user or merchant sessions before setting admin session
    localStorage.removeItem('end_user_session');
    localStorage.removeItem('merchant_session');
    localStorage.setItem('auth_session', JSON.stringify(session));
  }

  return session;
}

export async function authenticateEndUser(email: string, password: string): Promise<AuthSession> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (email !== USER_DEMO_CREDENTIALS.email || password !== USER_DEMO_CREDENTIALS.password) {
    throw new Error('Invalid email or password');
  }

  const session: AuthSession = {
    user: {
      id: 'end_user_001',
      email: email,
      name: 'Demo User',
      role: 'user',
    },
    token: 'user_token_' + Date.now(),
  };

  if (typeof window !== 'undefined') {
    // Clear any lingering admin or merchant sessions before setting end-user session
    localStorage.removeItem('auth_session');
    localStorage.removeItem('merchant_session');
    localStorage.setItem('end_user_session', JSON.stringify(session));
  }

  return session;
}

export async function authenticateMerchant(email: string, password: string): Promise<AuthSession> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (email !== MERCHANT_DEMO_CREDENTIALS.email || password !== MERCHANT_DEMO_CREDENTIALS.password) {
    throw new Error('Invalid email or password');
  }

  const session: AuthSession = {
    user: {
      id: 'merchant_001',
      email: email,
      name: 'Demo Merchant',
    },
    token: 'merchant_token_' + Date.now(),
  };

  if (typeof window !== 'undefined') {
    // Clear any lingering admin or end-user sessions before setting merchant session
    localStorage.removeItem('auth_session');
    localStorage.removeItem('end_user_session');
    localStorage.setItem('merchant_session', JSON.stringify(session));
  }

  return session;
}

export function getMerchantSession(): AuthSession | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('merchant_session');
  if (stored) return JSON.parse(stored);
  return null;
}

export function setMerchantSession(): AuthSession {
  const session: AuthSession = {
    user: {
      id: 'merchant_001',
      email: MERCHANT_DEMO_CREDENTIALS.email,
      name: 'Demo Merchant',
    },
    token: 'merchant_token_' + Date.now(),
  };
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_session');
    localStorage.removeItem('end_user_session');
    localStorage.setItem('merchant_session', JSON.stringify(session));
  }
  return session;
}

export function logoutMerchant(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('merchant_session');
  }
}

export function getEndUserSession(): AuthSession | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('end_user_session');
  if (stored) return JSON.parse(stored);
  return null;
}

export function logoutEndUser(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('end_user_session');
  }
}

/** Returns whichever session exists — end-user, merchant, or operator (in that priority order).
 *  End-user and merchant are checked first so their sessions are never shadowed by a stale admin session.
 *  Used by verification flow pages so all login types can access them. */
export function getAnySession(): AuthSession | null {
  if (typeof window === 'undefined') return null;
  const endUser = localStorage.getItem('end_user_session');
  if (endUser) return JSON.parse(endUser);
  const merchant = localStorage.getItem('merchant_session');
  if (merchant) return JSON.parse(merchant);
  const operator = localStorage.getItem('auth_session');
  if (operator) return JSON.parse(operator);
  return null;
}

/** Logs out whichever session is active and returns the redirect path. */
export function logoutAny(): string {
  if (typeof window === 'undefined') return '/';
  if (localStorage.getItem('auth_session')) {
    localStorage.removeItem('auth_session');
    return '/';
  }
  if (localStorage.getItem('merchant_session')) {
    localStorage.removeItem('merchant_session');
    return '/merchant/login';
  }
  localStorage.removeItem('end_user_session');
  return '/';
}

const DEMO_SESSION: AuthSession = {
  user: {
    id: 'user_001',
    email: 'global@bureau.id',
    name: 'Global Administrator',
    role: 'admin',
  },
  token: 'demo_token_preview',
};

export function getSession(): AuthSession | null {
  if (typeof window === 'undefined') return null;

  const stored = localStorage.getItem('auth_session');
  if (stored) return JSON.parse(stored);

  return null;
}

export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_session');
  }
}

export function isAuthenticated(): boolean {
  return getSession() !== null;
}
