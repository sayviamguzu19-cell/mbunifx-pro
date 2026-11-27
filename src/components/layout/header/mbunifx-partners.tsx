import React, { useEffect, useState } from 'react';

type Props = { accessToken: string };
type PartnerResult = { source: string; start_date: string; end_date: string; data: unknown };

const referralLink = process.env.NEXT_PUBLIC_DERIV_REFERRAL_LINK || '';

const MbunifxPartners = ({ accessToken }: Props) => {
    const [allowed, setAllowed] = useState(false);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [result, setResult] = useState<PartnerResult | null>(null);

    const load = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch('/api/partners/overview', {
                headers: { Authorization: `Bearer ${accessToken}` },
                cache: 'no-store',
            });
            const payload = await response.json();
            if (response.status === 403 || response.status === 404) {
                setAllowed(false);
                return;
            }
            if (!response.ok) throw new Error(payload.error || 'Could not load Deriv partner data.');
            setAllowed(true);
            setResult(payload);
        } catch (e: any) {
            setError(e.message || 'Partner dashboard is unavailable.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { void load(); }, [accessToken]);

    if (!allowed && !loading) return null;
    if (loading && !allowed) return null;

    return (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
            <button type='button' onClick={() => { setOpen(true); void load(); }}
                style={{ border: '1px solid #b18a3c', borderRadius: 8, padding: '9px 11px', background: '#302612', color: '#ffe0a0', fontSize: 12, fontWeight: 700 }}>
                Partner Admin
            </button>
            {open && <div role='dialog' aria-modal='true' aria-label='Deriv Partners admin dashboard'
                style={{ position: 'fixed', zIndex: 1100, inset: 0, overflowY: 'auto', padding: 16, background: 'rgba(0,0,0,.78)', display: 'grid', placeItems: 'center' }}>
                <section style={{ width: 'min(100%, 680px)', maxHeight: '90vh', overflowY: 'auto', boxSizing: 'border-box', padding: 20, border: '1px solid #69552e', borderRadius: 14, background: '#0b1a2d', color: '#eef5ff' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                        <div><h2 style={{ margin: 0, fontSize: 20 }}>Deriv Partners</h2><p style={{ margin: '5px 0 0', color: '#9fb2ca', fontSize: 12 }}>Private MBUNIFX admin dashboard · official API data</p></div>
                        <button type='button' onClick={() => setOpen(false)} style={{ border: '1px solid #38516f', borderRadius: 7, padding: '6px 10px', background: '#102640', color: '#fff' }}>Close</button>
                    </div>
                    <div style={{ marginTop: 18, padding: 14, borderRadius: 10, background: '#102640' }}>
                        <strong style={{ fontSize: 13 }}>Your referral link</strong>
                        {referralLink ? <><p style={{ overflowWrap: 'anywhere', color: '#b8c9dd', fontSize: 12 }}>{referralLink}</p><button type='button' onClick={() => void navigator.clipboard?.writeText(referralLink)} style={{ border: 0, borderRadius: 7, padding: '8px 12px', background: '#0878d1', color: '#fff' }}>Copy link</button></> :
                            <p style={{ color: '#ffc477', fontSize: 12 }}>Referral link not configured yet. Add NEXT_PUBLIC_DERIV_REFERRAL_LINK in Cloudflare Pages.</p>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: 18 }}>
                        <strong style={{ fontSize: 13 }}>Partner performance</strong>
                        <button type='button' onClick={() => void load()} style={{ border: '1px solid #38516f', borderRadius: 7, padding: '7px 10px', background: '#102640', color: '#fff' }}>Refresh</button>
                    </div>
                    {loading && <p style={{ color: '#9fb2ca', fontSize: 12 }}>Loading verified Deriv data…</p>}
                    {error && <p role='alert' style={{ color: '#ffc477', fontSize: 12 }}>{error}</p>}
                    {result && <><p style={{ color: '#9fb2ca', fontSize: 11 }}>Source: {result.source} · {result.start_date} to {result.end_date}</p>
                        <pre style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', padding: 13, borderRadius: 9, background: '#071426', color: '#c8d8ea', fontSize: 11 }}>{JSON.stringify(result.data, null, 2)}</pre></>}
                    <p style={{ color: '#8298b1', fontSize: 10, lineHeight: 1.5 }}>Only your server-authorised admin account can read this panel. Values are returned by Deriv Partners; no estimated or fabricated earnings are shown.</p>
                </section>
            </div>}
        </div>
    );
};

export default MbunifxPartners;
