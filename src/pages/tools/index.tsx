import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

const sections = [
    { id: 'dashboard', name: 'Dashboard', description: 'Your MBUNIFX trading workspace and account connection status.' },
    { id: 'bot-builder', name: 'Bot Builder', description: 'Build and edit automated strategies using the existing Deriv Bot Builder.' },
    { id: 'free-bots', name: 'Free Bots', description: 'Browse starter bot ideas and open them in Bot Builder.' },
    { id: 'pro-scanner', name: 'Pro Scanner', description: 'A workspace for monitoring Volatility markets and digit-contract opportunities.' },
    { id: 'strategy-pro', name: 'Strategy Pro', description: 'Organize, compare and refine your trading rules before use.' },
    { id: 'speedbot', name: 'Speedbot', description: 'A fast strategy workspace. Execution stays locked until official authorization is configured.' },
    { id: 'ai-software', name: 'AI Software', description: 'Review AI-assisted strategy ideas without presenting guesses as guaranteed signals.' },
    { id: 'auto-trade', name: 'Auto Trade', description: 'Automated order execution is disabled until Deriv OAuth and API safeguards are verified.' },
    { id: 'manual-trade', name: 'Manual Trade', description: 'Prepare a trade setup for your own review. No order is placed from this workspace.' },
    { id: 'bulk-trader', name: 'Bulk Trader', description: 'Prepare multiple trade ideas. Bulk order execution is currently disabled.' },
    { id: 'charts', name: 'Charts', description: 'Open the existing Deriv chart workspace.' },
    { id: 'copy-trader', name: 'Copy Trader', description: 'A workspace for reviewing strategies to follow. Copy execution is not enabled.' },
    { id: 'risk-calculator', name: 'Risk Calculator', description: 'Calculate position risk and maximum loss before placing a trade.' },
    { id: 'trade-academy', name: 'Trade Academy', description: 'Learn contract types, market basics and risk management.' },
];

const panelStyle = { background: 'var(--general-section-1, #fff)', border: '1px solid var(--border-normal, #e5e7eb)', borderRadius: 12, padding: 16 };
const inputStyle = { width: '100%', maxWidth: 320, padding: '10px 12px', borderRadius: 8, border: '1px solid #9ca3af', marginTop: 6, color: 'inherit', background: 'transparent' };

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
        const b = Number(balance);
        const p = Number(riskPercent);
        return Number.isFinite(b) && Number.isFinite(p) && b >= 0 && p >= 0 ? (b * p) / 100 : 0;
    }, [balance, riskPercent]);

    const openExisting = (hash: string) => {
        window.location.assign('/' + hash);
    };

    return (
        <main style={{ padding: '20px 16px 48px', maxWidth: 1180, margin: '0 auto', color: 'var(--text-general, inherit)' }}>
            <header style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, opacity: 0.7 }}>MBUNIFX.PRO / WORKSPACE</div>
                <h1 style={{ fontSize: 26, margin: '8px 0' }}>{active.name}</h1>
                <p style={{ margin: 0, opacity: 0.8 }}>{active.description}</p>
            </header>

            <nav aria-label='MBUNIFX sections' style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(145px, 1fr))', gap: 8, marginBottom: 20 }}>
                {sections.map(item => (
                    <button key={item.id} onClick={() => navigate('/tools/' + item.id)} aria-current={active.id === item.id ? 'page' : undefined}
                        style={{ textAlign: 'left', padding: '11px 12px', borderRadius: 9, border: active.id === item.id ? '2px solid #5c82f6' : '1px solid var(--border-normal, #ddd)', background: active.id === item.id ? 'rgba(92,130,246,.12)' : 'transparent', color: 'inherit', cursor: 'pointer', fontWeight: active.id === item.id ? 700 : 500 }}>
                        {item.name}
                    </button>
                ))}
            </nav>

            {active.id === 'risk-calculator' ? (
                <section style={panelStyle}>
                    <h2 style={{ marginTop: 0 }}>Trade risk calculator</h2>
                    <p>Set your account balance and risk percentage. This is a planning calculation, not a trade order.</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 16 }}>
                        <label>Account balance (USD)<input style={inputStyle} type='number' min='0' step='0.01' value={balance} onChange={e => setBalance(e.target.value)} /></label>
                        <label>Risk per trade (%)<input style={inputStyle} type='number' min='0' max='100' step='0.1' value={riskPercent} onChange={e => setRiskPercent(e.target.value)} /></label>
                    </div>
                    <div style={{ marginTop: 18, padding: 16, borderRadius: 10, background: 'rgba(92,130,246,.10)' }}>
                        <div style={{ opacity: .75 }}>Maximum planned risk</div>
                        <strong style={{ fontSize: 30 }}>USD {riskAmount.toFixed(2)}</strong>
                    </div>
                    <p style={{ fontSize: 13, opacity: .75 }}>Risk amount = balance × risk percentage ÷ 100. This does not guarantee the actual loss will be limited to this amount.</p>
                </section>
            ) : active.id === 'bot-builder' ? (
                <section style={panelStyle}><h2>Existing Bot Builder</h2><p>The original Deriv Bot Builder remains part of MBUNIFX.PRO.</p><button onClick={() => openExisting('#bot_builder')}>Open Bot Builder</button></section>
            ) : active.id === 'charts' ? (
                <section style={panelStyle}><h2>Deriv Charts</h2><p>Open the chart tab already included in the existing trading workspace.</p><button onClick={() => openExisting('#chart')}>Open Charts</button></section>
            ) : active.id === 'dashboard' ? (
                <section style={panelStyle}>
                    <h2>Trading connection</h2>
                    <p>Deriv account connection: <strong>Not connected / verify in the main app</strong></p>
                    <p>Order placement: <strong>Disabled until official Deriv OAuth and API authorization are configured and tested.</strong></p>
                    <button onClick={() => openExisting('#dashboard')}>Open original Dashboard</button>
                </section>
            ) : (
                <section style={panelStyle}>
                    <h2>{active.name} workspace</h2>
                    <p>{active.description}</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 12, marginTop: 16 }}>
                        <label>Market
                            <select style={inputStyle} value={market} onChange={e => setMarket(e.target.value)}>
                                <option>Volatility 10 Index</option><option>Volatility 25 Index</option><option>Volatility 50 Index</option><option>Volatility 75 Index</option><option>Volatility 100 Index</option>
                            </select>
                        </label>
                        <label>Contract type
                            <select style={inputStyle} value={contract} onChange={e => setContract(e.target.value)}>
                                <option>Over / Under</option><option>Matches</option><option>Differs</option><option>Even / Odd</option>
                            </select>
                        </label>
                        <label>Planned stake (USD)
                            <input style={inputStyle} type='number' min='0' step='0.01' value={stake} onChange={e => setStake(e.target.value)} />
                        </label>
                    </div>
                    <div style={{ marginTop: 18, padding: 14, borderRadius: 9, background: 'rgba(245,158,11,.10)' }}>
                        <strong>Safe preview mode</strong>
                        <p style={{ marginBottom: 0 }}>Selected: {market} · {contract} · Planned stake USD {Math.max(0, Number(stake) || 0).toFixed(2)}. No live signal, balance, or trade result is fabricated. Live market scanning and order execution require verified official Deriv API integration.</p>
                    </div>
                    {active.id === 'trade-academy' && <p>Learning topics: Volatility indices, digit contracts, Over/Under, Matches, Differs, Even/Odd, stake sizing and risk control.</p>}
                    {active.id === 'free-bots' && <button onClick={() => openExisting('#bot_builder')}>Open Bot Builder to create or load a bot</button>}
                </section>
            )}
        </main>
    );
};

export default ToolsPage;
