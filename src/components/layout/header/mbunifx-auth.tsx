import React, { useEffect, useState } from 'react';
import MbunifxPartners from './mbunifx-partners';

type AuthSession = {
    access_token: string;
    refresh_token: string;
    expires_at: number;
    user?: { id?: string; email?: string };
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';
const SESSION_KEY = 'mbunifx_supabase_session';

const readSession = (): AuthSession | null => {
    try {
        const raw = localStorage.getItem(SESSION_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

const saveSession = (session: any): AuthSession => {
    const normalized = {
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_at: session.expires_at || Math.floor(Date.now() / 1000) + (session.expires_in || 3600),
        user: session.user,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(normalized));
    return normalized;
};

const authRequest = async (path: string, body?: unknown, token?: string) => {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/${path}`, {
        method: body === undefined ? 'GET' : 'POST',
        headers: {
            apikey: SUPABASE_KEY,
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.msg || data.message || data.error_description || data.error || 'Authentication failed. Please try again.');
    return data;
};

const MbunifxAuth = () => {
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState<'login' | 'signup'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [session, setSession] = useState<AuthSession | null>(null);
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState('');

    const configured = Boolean(SUPABASE_URL && SUPABASE_KEY);

    useEffect(() => {
        if (!configured) return;
        const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
        const accessToken = hash.get('access_token');
        const refreshToken = hash.get('refresh_token');
        if (accessToken && refreshToken) {
            const expiresIn = Number(hash.get('expires_in') || 3600);
            authRequest('user', undefined, accessToken)
                .then(user => {
                    const next = saveSession({ access_token: accessToken, refresh_token: refreshToken, expires_in: expiresIn, user });
                    setSession(next);
                    setMessage('Google sign-in successful.');
                })
                .catch(error => setMessage(error.message))
                .finally(() => window.history.replaceState({}, document.title, window.location.pathname + window.location.search));
            return;
        }

        const existing = readSession();
        if (!existing) return;
        if (existing.expires_at > Math.floor(Date.now() / 1000) + 60) {
            setSession(existing);
            authRequest('user', undefined, existing.access_token)
                .then(user => {
                    const next = saveSession({ ...existing, user });
                    setSession(next);
                })
                .catch(() => {
                    localStorage.removeItem(SESSION_KEY);
                    setSession(null);
                });
            return;
        }
        authRequest('token?grant_type=refresh_token', { refresh_token: existing.refresh_token })
            .then(data => setSession(saveSession(data)))
            .catch(() => {
                localStorage.removeItem(SESSION_KEY);
                setSession(null);
            });
    }, [configured]);

    const submit = async (event: React.FormEvent) => {
        event.preventDefault();
        setBusy(true);
        setMessage('');
        try {
            if (mode === 'signup') {
                const data = await authRequest('signup', { email: email.trim(), password });
                if (data.access_token) {
                    setSession(saveSession(data));
                    setMessage('Account created successfully.');
                } else {
                    setMessage('Account created. Check your email to confirm it, then log in.');
                }
            } else {
                const data = await authRequest('token?grant_type=password', { email: email.trim(), password });
                setSession(saveSession(data));
                setMessage('You are signed in.');
            }
            setPassword('');
        } catch (error: any) {
            setMessage(error.message || 'Could not complete authentication.');
        } finally {
            setBusy(false);
        }
    };

    const signInWithGoogle = () => {
        if (!configured) return;
        const redirectTo = window.location.origin + window.location.pathname + window.location.search;
        const url = new URL(`${SUPABASE_URL}/auth/v1/authorize`);
        url.searchParams.set('provider', 'google');
        url.searchParams.set('redirect_to', redirectTo);
        url.searchParams.set('flow_type', 'implicit');
        url.searchParams.set('apikey', SUPABASE_KEY);
        window.location.assign(url.toString());
    };

    const signOut = async () => {
        setBusy(true);
        try {
            if (session?.access_token) await authRequest('logout', {}, session.access_token);
        } catch {
            // Clear the local session even if the network sign-out request fails.
        }
        localStorage.removeItem(SESSION_KEY);
        setSession(null);
        setMessage('You have signed out.');
        setBusy(false);
    };

    const buttonStyle: React.CSSProperties = {
        border: '1px solid #2c5279', borderRadius: 8, padding: '9px 11px',
        background: '#102640', color: '#f2f7ff', fontSize: 12, fontWeight: 700, cursor: 'pointer',
    };

    if (!configured) {
        return <span style={{ color: '#e8b86a', fontSize: 11 }}>Account login setup pending</span>;
    }

    return (
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 7 }}>
            {session ? (
                <>
                    <span style={{ color: '#b8c9dd', fontSize: 11, maxWidth: 145, overflow: 'hidden', textOverflow: 'ellipsis' }}>{session.user?.email || 'MBUNIFX account'}</span>
                    <MbunifxPartners accessToken={session.access_token} />
                    <button type='button' style={buttonStyle} onClick={signOut} disabled={busy}>Log out</button>
                </>
            ) : (
                <>
                    <button type='button' style={buttonStyle} onClick={() => { setMode('login'); setMessage(''); setOpen(true); }}>Log in</button>
                    <button type='button' style={{ ...buttonStyle, background: '#0878d1', borderColor: '#159bff' }} onClick={() => { setMode('signup'); setMessage(''); setOpen(true); }}>Sign up</button>
                </>
            )}
            {open && (
                <div role='dialog' aria-modal='true' aria-label='MBUNIFX account login' style={{ position: 'fixed', zIndex: 1000, inset: 0, display: 'grid', placeItems: 'center', padding: 16, background: 'rgba(0,0,0,.72)' }}>
                    <section style={{ width: 'min(100%, 390px)', boxSizing: 'border-box', padding: 22, borderRadius: 16, border: '1px solid #294967', background: '#0b1a2d', color: '#eef5ff', boxShadow: '0 18px 60px rgba(0,0,0,.5)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                            <div><div style={{ fontSize: 21, fontWeight: 850 }}>MBUNIFX<span style={{ color: '#159bff' }}>.PRO</span></div><div style={{ color: '#9fb2ca', fontSize: 12 }}>Your MBUNIFX account</div></div>
                            <button type='button' aria-label='Close' onClick={() => setOpen(false)} style={{ ...buttonStyle, padding: '5px 10px' }}>✕</button>
                        </div>
                        <div style={{ display: 'flex', gap: 8, margin: '20px 0 14px' }}>
                            <button type='button' onClick={() => { setMode('login'); setMessage(''); }} style={{ ...buttonStyle, flex: 1, background: mode === 'login' ? '#0759b8' : '#102640' }}>Log in</button>
                            <button type='button' onClick={() => { setMode('signup'); setMessage(''); }} style={{ ...buttonStyle, flex: 1, background: mode === 'signup' ? '#0759b8' : '#102640' }}>Sign up</button>
                        </div>
                        <form onSubmit={submit}>
                            <label style={{ display: 'block', fontSize: 12, marginBottom: 12 }}>Email
                                <input type='email' autoComplete='email' required value={email} onChange={e => setEmail(e.target.value)} placeholder='you@example.com' style={{ display: 'block', width: '100%', boxSizing: 'border-box', marginTop: 6, padding: 12, borderRadius: 8, border: '1px solid #38516f', background: '#071426', color: '#fff' }} />
                            </label>
                            <label style={{ display: 'block', fontSize: 12, marginBottom: 15 }}>Password
                                <input type='password' autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} minLength={6} required value={password} onChange={e => setPassword(e.target.value)} placeholder='At least 6 characters' style={{ display: 'block', width: '100%', boxSizing: 'border-box', marginTop: 6, padding: 12, borderRadius: 8, border: '1px solid #38516f', background: '#071426', color: '#fff' }} />
                            </label>
                            <button type='submit' disabled={busy} style={{ ...buttonStyle, width: '100%', background: '#0878d1', borderColor: '#159bff', opacity: busy ? .65 : 1 }}>{busy ? 'Please wait…' : mode === 'signup' ? 'Create account' : 'Log in'}</button>
                        </form>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '16px 0', color: '#8198b4', fontSize: 11 }}><span style={{ height: 1, flex: 1, background: '#29415e' }} />OR<span style={{ height: 1, flex: 1, background: '#29415e' }} /></div>
                        <button type='button' onClick={signInWithGoogle} style={{ ...buttonStyle, width: '100%', background: '#f4f7fb', color: '#18283b', borderColor: '#f4f7fb' }}>Continue with Google</button>
                        {message && <p role='status' style={{ margin: '14px 0 0', color: message.toLowerCase().includes('success') || message.toLowerCase().includes('created') || message.toLowerCase().includes('signed out') ? '#62dfae' : '#ffc477', fontSize: 12, lineHeight: 1.5 }}>{message}</p>}
                        <p style={{ color: '#8298b1', fontSize: 10, lineHeight: 1.5, marginBottom: 0 }}>This is your MBUNIFX website account. Deriv authorization is a separate connection.</p>
                    </section>
                </div>
            )}
        </div>
    );
};

export default MbunifxAuth;
