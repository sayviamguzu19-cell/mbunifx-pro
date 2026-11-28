import { CSSProperties, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

const sections = [
    { id: 'dashboard', name: 'Dashboard', description: 'Your MBUNIFX.PRO trading workspace.' },
    { id: 'bot-builder', name: 'Bot Builder', description: 'Build and edit strategies in the existing Deriv Bot Builder.' },
    { id: 'free-bots', name: 'Free Bots', description: 'Explore starter bot ideas before opening them in Bot Builder.' },
    { id: 'pro-scanner', name: 'Pro Scanner', description: 'Monitor Volatility markets and digit-contract opportunities.' },
    { id: 'strategy-pro', name: 'Strategy Pro', description: 'Organize and review your trading rules.' },
    { id: 'speedbot', name: 'Speedbot', description: 'Prepare fast strategy workflows. Live execution remains locked.' },
    { id: 'ai-software', name: 'AI Software', description: 'Review AI-assisted ideas without treating estimates as guarantees.' },
    { id: 'auto-trade', name: 'Auto Trade', description: 'Automation stays disabled until official Deriv authorization is verified.' },
    { id: 'manual-trade', name: 'Manual Trade', description: 'Prepare a trade for your own review. No order is placed here.' },
    { id: 'bulk-trader', name: 'Bulk Trader', description: 'Prepare multiple trade ideas. Bulk execution is disabled.' },
    { id: 'charts', name: 'Charts', description: 'Open the existing Deriv chart workspace.' },
    { id: 'copy-trader', name: 'Copy Trader', description: 'Review strategies to follow. Copy execution is disabled.' },
    { id: 'risk-calculator', name: 'Risk Calculator', description: 'Calculate planned risk before considering a trade.' },
    { id: 'trade-academy', name: 'Trade Academy', description: 'Learn markets, digit contracts and risk management.' },
];

const markets = ['Volatility 10 Index', 'Volatility 25 Index', 'Volatility 50 Index', 'Volatility 75 Index', 'Volatility 100 Index'];
const contracts = ['Over / Under', 'Matches', 'Differs', 'Even / Odd'];

const shell: CSSProperties = { minHeight: '100%', background: '#071426', color: '#eef5ff', padding: '12px clamp(10px, 2vw, 24px) 36px' };
const panel: React.CSSProperties = { background: 'linear-gradient(145deg,#12243b,#0d1b2e)', border: '1px solid #263d5a', borderRadius: 14, padding: 16, minWidth: 0, boxShadow: '0 8px 24px rgba(0,0,0,.18)' };
const field: React.CSSProperties = { display: 'block', width: '100%', boxSizing: 'border-box', marginTop: 7, padding: '11px 12px', borderRadius: 9, border: '1px solid #38516f', background: '#0a192c', color: '#f2f7ff', fontSize: 14 };
const muted: React.CSSProperties = { color: '#9fb2ca' };

const ToolsPage = () => {
    const { section = 'dashboard' } = useParams();
    const navigate = useNavigate();
    const [balance, setBalance] = useState('100');
    const [riskPercent, setRiskPercent] = useState('1');
    const [stake, setStake] = useState('1');
    const [market, setMarket] = useState('Volatility 25 Index');
    const [contract, setContract] = useState('Over / Under');
    const active = sections.find(item => item.id === section) ?? sections[0];
    const riskAmount = useMemo(() => {
        const b = Number(balance), p = Number(riskPercent);
        return Number.isFinite(b) && Number.isFinite(p) && b >= 0 && p >= 0 ? b * p / 100 : 0;
    }, [balance, riskPercent]);

    const openExisting = (hash: string) => window.location.assign('/' + hash);

    return (
        <main style={shell}>
            <div style={{ maxWidth: 1600, margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '7px 4px 14px' }}>
                    <div>
                        <div style={{ fontSize: 'clamp(21px,3vw,30px)', fontWeight: 850, letterSpacing: '.02em' }}>MBUNIFX<span style={{ color: '#159bff' }}>.PRO</span></div>
                        <div style={{ ...muted, fontSize: 10, letterSpacing: '.2em' }}>TRADING WORKSPACE</div>
                    </div>
                    <div style={{ border: '1px solid #146c50', color: '#43e2a0', background: '#082b28', borderRadius: 30, padding: '7px 12px', fontSize: 12, whiteSpace: 'nowrap' }}>● SAFE PREVIEW</div>
                </div>

                <nav aria-label='MBUNIFX main navigation' style={{ position: 'sticky', top: 0, zIndex: 20, display: 'flex', flexWrap: 'nowrap', overflowX: 'auto', overflowY: 'hidden', whiteSpace: 'nowrap', gap: 5, padding: '8px 4px', margin: '0 -4px 16px', background: '#0b1a2d', borderTop: '1px solid #294361', borderBottom: '2px solid #087ce2', scrollbarWidth: 'thin' }}>
                    {sections.map(item => (
                        <button key={item.id} onClick={() => navigate('/tools/' + item.id)} aria-current={active.id === item.id ? 'page' : undefined}
                            style={{ flex: '0 0 auto', border: active.id === item.id ? '1px solid #159bff' : '1px solid #263d59', borderRadius: 8, background: active.id === item.id ? '#0759b8' : '#13253c', color: '#f4f8ff', padding: '10px 12px', fontSize: 12, fontWeight: active.id === item.id ? 750 : 550, cursor: 'pointer' }}>
                            {item.name}
                        </button>
                    ))}
                </nav>

                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
                    <div><div style={{ ...muted, fontSize: 11 }}>MBUNIFX.PRO / WORKSPACE</div><h1 style={{ fontSize: 24, margin: '4px 0' }}>{active.name}</h1><p style={{ ...muted, margin: 0, fontSize: 13 }}>{active.description}</p></div>
                    <div style={{ ...muted, fontSize: 11, whiteSpace: 'nowrap' }}>Deriv connection: not connected</div>
                </div>

                {active.id === 'risk-calculator' ? (
                    <section style={{ ...panel, maxWidth: 760 }}>
                        <h2 style={{ marginTop: 0 }}>Trade risk calculator</h2>
                        <p style={muted}>Plan a risk amount. This calculation does not place a trade or guarantee the actual loss.</p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: 14 }}>
                            <label>Account balance (USD)<input style={field} type='number' min='0' step='0.01' value={balance} onChange={e => setBalance(e.target.value)} /></label>
                            <label>Risk per trade (%)<input style={field} type='number' min='0' max='100' step='0.1' value={riskPercent} onChange={e => setRiskPercent(e.target.value)} /></label>
                        </div>
                        <div style={{ marginTop: 18, borderRadius: 10, padding: 16, background: '#082e35', border: '1px solid #087c83' }}><div style={muted}>Planned risk amount</div><strong style={{ fontSize: 30, color: '#44e2c0' }}>USD {riskAmount.toFixed(2)}</strong></div>
                    </section>
                ) : active.id === 'bot-builder' ? (
                    <section style={panel}><h2>Existing Deriv Bot Builder</h2><p style={muted}>The original Bot Builder remains in the project.</p><button onClick={() => openExisting('#bot_builder')} style={field}>Open Bot Builder</button></section>
                ) : active.id === 'charts' ? (
                    <section style={panel}><h2>Deriv Charts</h2><p style={muted}>Open the chart workspace already included in the project.</p><button onClick={() => openExisting('#chart')} style={field}>Open Charts</button></section>
                ) : (
                    <>
                    {active.id === 'dashboard' && (
                        <section style={{ marginBottom: 14 }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 10 }}>
                                <div><div style={{ ...muted, fontSize: 10, letterSpacing: '.2em' }}>QUICK ACTIONS</div><h2 style={{ margin: '4px 0 0', fontSize: 18 }}>Welcome to your workspace</h2></div>
                                <span style={{ color: '#41dfac', fontSize: 11 }}>● SAFE PREVIEW</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(145px,1fr))', gap: 10 }}>
                                {[
                                    { id: 'bot-builder', icon: '🧩', title: 'Bot Builder', note: 'Build a strategy visually', accent: '#ff7958' },
                                    { id: 'free-bots', icon: '🤖', title: 'Free Bots', note: 'Explore starter strategies', accent: '#25d99a' },
                                    { id: 'pro-scanner', icon: '🔎', title: 'Pro Scanner', note: 'Review digit opportunities', accent: '#45a5ff' },
                                    { id: 'strategy-pro', icon: '⚡', title: 'Quick Strategy', note: 'Set up your trade plan', accent: '#f3c34f' },
                                ].map(card => (
                                    <button key={card.id} onClick={() => navigate('/tools/' + card.id)} style={{ textAlign: 'left', minHeight: 112, padding: 14, borderRadius: 13, border: '1px solid #2c4665', borderTop: '3px solid ' + card.accent, background: 'linear-gradient(145deg,#142941,#0b1a2c)', color: '#f2f7ff', cursor: 'pointer' }}>
                                        <div style={{ fontSize: 23 }}>{card.icon}</div><div style={{ fontWeight: 800, marginTop: 8 }}>{card.title}</div><div style={{ ...muted, fontSize: 11, marginTop: 4 }}>{card.note}</div><div style={{ color: card.accent, fontSize: 11, fontWeight: 800, marginTop: 10 }}>OPEN →</div>
                                    </button>
                                ))}
                            </div>
                        </section>
                    )}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: 12, alignItems: 'start' }}>
                        <aside style={{ display: 'grid', gap: 12 }}>
                            <section style={panel}>
                                <h3 style={{ margin: '0 0 12px' }}>Markets</h3>
                                {markets.map(name => <div key={name} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, padding: '11px 0', borderBottom: '1px solid #263b56', fontSize: 12 }}><span>{name}</span><span style={muted}>Waiting for feed</span></div>)}
                            </section>
                            <section style={{ ...panel, background: 'linear-gradient(135deg,#152b48,#10223a)' }}><div style={{ color: '#36aaff', fontWeight: 800 }}>CASHRUSH NITRO</div><p style={{ ...muted, fontSize: 12, marginBottom: 0 }}>Game section remains part of MBUNIFX.PRO and is not modified in this update.</p></section>
                        </aside>

                        <section style={{ ...panel, minHeight: 300 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}><h2 style={{ margin: 0 }}>{active.id === 'dashboard' ? 'Trading overview' : active.name}</h2><span style={{ color: '#f7c66b', fontSize: 11 }}>LIVE FEED NOT CONNECTED</span></div>
                            <p style={muted}>Choose a Volatility market and contract. No live prices, predictions, confidence scores or results are invented.</p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(125px,1fr))', gap: 8, margin: '16px 0' }}>
                                {markets.map(name => <button key={name} onClick={() => setMarket(name)} style={{ padding: 12, borderRadius: 9, border: market === name ? '1px solid #159bff' : '1px solid #304762', background: market === name ? '#10477f' : '#102139', color: '#f2f7ff', cursor: 'pointer', fontSize: 12 }}>{name.replace(' Index','')}</button>)}
                            </div>
                            <h3 style={{ marginBottom: 9 }}>DIGITS 0–9</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,minmax(0,1fr))', gap: 7 }}>
                                {Array.from({ length: 10 }, (_, digit) => <div key={digit} style={{ textAlign: 'center', border: '1px solid #304763', background: '#0b1b30', borderRadius: 8, padding: '12px 4px', fontSize: 23, fontWeight: 800 }}>{digit}</div>)}
                            </div>
                            <div style={{ marginTop: 15, padding: 12, borderRadius: 9, background: '#0b1b30', border: '1px solid #263d59' }}><strong>Digit analysis</strong><p style={{ ...muted, margin: '5px 0 0', fontSize: 12 }}>Waiting for verified Deriv tick data. Digit frequency and history will appear after the official feed is connected.</p></div>
                        </section>

                        <aside style={panel}>
                            <h3 style={{ margin: '0 0 12px' }}>Trade panel</h3>
                            <label style={{ fontSize: 12 }}>Market<select style={field} value={market} onChange={e => setMarket(e.target.value)}>{markets.map(m => <option key={m}>{m}</option>)}</select></label>
                            <label style={{ display: 'block', marginTop: 12, fontSize: 12 }}>Contract type<select style={field} value={contract} onChange={e => setContract(e.target.value)}>{contracts.map(c => <option key={c}>{c}</option>)}</select></label>
                            <label style={{ display: 'block', marginTop: 12, fontSize: 12 }}>Planned stake (USD)<input style={field} type='number' min='0' step='0.01' value={stake} onChange={e => setStake(e.target.value)} /></label>
                            <div style={{ marginTop: 14, padding: 12, borderRadius: 9, background: '#352a13', border: '1px solid #76591d', color: '#f8d78e', fontSize: 12 }}>Safe preview only. Trade execution is disabled until official Deriv authorization and safeguards are configured.</div>
                        </aside>
                    </div>
                    </>
                )}
            </div>
        </main>
    );
};

export default ToolsPage;
