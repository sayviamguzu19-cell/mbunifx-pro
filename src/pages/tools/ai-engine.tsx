import React, { useState } from 'react';

const markets = ['Volatility 10 Index', 'Volatility 25 Index', 'Volatility 50 Index', 'Volatility 75 Index', 'Volatility 100 Index'];
const contracts = ['Over / Under', 'Matches', 'Differs', 'Even / Odd'];
const panel: React.CSSProperties = { background: 'linear-gradient(145deg,#12243b,#0d1b2e)', border: '1px solid #263d5a', borderRadius: 14, padding: 16, minWidth: 0 };
const muted: React.CSSProperties = { color: '#9fb2ca' };
const field: React.CSSProperties = { display: 'block', width: '100%', boxSizing: 'border-box', marginTop: 7, padding: '11px 12px', borderRadius: 9, border: '1px solid #38516f', background: '#0a192c', color: '#f2f7ff', fontSize: 14 };

const AIEngine = () => {
  const [market, setMarket] = useState(markets[1]);
  const [contract, setContract] = useState(contracts[0]);
  const [question, setQuestion] = useState('');
  const [risk, setRisk] = useState('1');
  const [notice, setNotice] = useState('');

  const requestAI = () => setNotice('AI service haijaunganishwa bado. Backend ya AI inahitaji kusanidiwa kabla ya kutoa majibu halisi. Hakuna signal au prediction iliyotengenezwa.');
  const requestScan = () => setNotice('Market scan inasubiri Deriv API tick feed rasmi. Hakuna market data ya kubuni itakayoonyeshwa.');

  return <div style={{ display: 'grid', gap: 14 }}>
    <section style={{ ...panel, background: 'radial-gradient(circle at 90% 0%,#124d73 0%,#10243d 45%,#0d1b2e 100%)' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
        <div><div style={{ color: '#43e2c0', fontSize: 10, fontWeight: 850, letterSpacing: '.18em' }}>MBUNIFX INTELLIGENCE</div><h2 style={{ fontSize: 25, margin: '7px 0' }}>AI Trading Hub</h2><p style={{ ...muted, margin: 0, fontSize: 13 }}>AI assistant · digit analysis · strategy intelligence · risk controls</p></div>
        <div style={{ border: '1px solid #76591d', color: '#f8d78e', background: '#302713', borderRadius: 30, padding: '8px 12px', fontSize: 11 }}>AI SERVICE: NOT CONNECTED</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(135px,1fr))', gap: 9, marginTop: 18 }}>
        {['AI Assistant','AI Market Scanner','Digit Intelligence','Strategy Generator'].map((x,i)=><div key={x} style={{ background: '#0a1a2caa', border: '1px solid #315477', borderRadius: 10, padding: 12 }}><div style={{ color: '#42d8c0', fontSize: 19 }}>{['✦','⌕','0–9','⚙'][i]}</div><div style={{ fontWeight: 750, fontSize: 12, marginTop: 7 }}>{x}</div><div style={{ ...muted, fontSize: 10, marginTop: 4 }}>Integration pending</div></div>)}
      </div>
    </section>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,300px),1fr))', gap: 14 }}>
      <section style={panel}>
        <h3 style={{ margin: '0 0 6px' }}>AI Assistant</h3><p style={{ ...muted, fontSize: 12, marginTop: 0 }}>Uliza kuhusu digit contracts, strategy rules au risk management.</p>
        <label style={{ fontSize: 12 }}>Your question<textarea value={question} onChange={e=>setQuestion(e.target.value)} placeholder='Mfano: Explain a conservative Over/Under strategy for Volatility 25...' rows={4} style={{ ...field, resize: 'vertical' }} /></label>
        <button onClick={requestAI} disabled={!question.trim()} style={{ ...field, background: question.trim() ? '#0759a8' : '#26364a', borderColor: '#087ce2', fontWeight: 800, cursor: question.trim() ? 'pointer' : 'not-allowed' }}>ASK MBUNIFX AI →</button>
      </section>
      <section style={panel}>
        <h3 style={{ margin: '0 0 6px' }}>AI Market Scanner</h3><p style={{ ...muted, fontSize: 12, marginTop: 0 }}>Chagua soko na contract ya kuchanganua baada ya live feed kuunganishwa.</p>
        <label style={{ fontSize: 12 }}>Market<select value={market} onChange={e=>setMarket(e.target.value)} style={field}>{markets.map(x=><option key={x}>{x}</option>)}</select></label>
        <label style={{ display: 'block', marginTop: 11, fontSize: 12 }}>Contract<select value={contract} onChange={e=>setContract(e.target.value)} style={field}>{contracts.map(x=><option key={x}>{x}</option>)}</select></label>
        <button onClick={requestScan} style={{ ...field, background: '#0759a8', borderColor: '#087ce2', fontWeight: 800, cursor: 'pointer' }}>SCAN SELECTED MARKET →</button>
      </section>
      <section style={panel}>
        <h3 style={{ margin: '0 0 6px' }}>AI Strategy Generator</h3><p style={{ ...muted, fontSize: 12 }}>Strategy rules zitahifadhiwa kama drafts. AI itakapounganishwa itaweza kusaidia kuzitengeneza na kuzieleza.</p>
        <div style={{ border: '1px solid #315477', background: '#0a192c', borderRadius: 10, padding: 12, fontSize: 12, lineHeight: 1.7 }}><strong>Strategy workspace</strong><div style={muted}>Market: {market}</div><div style={muted}>Contract: {contract}</div><div style={muted}>Execution: Manual preview only</div></div>
        <button onClick={()=>setNotice('Strategy draft imeandaliwa kwenye preview pekee. Hakuna bot inayofanya trade mpaka engine na Deriv API viunganishwe.')} style={{ ...field, background: '#123b42', borderColor: '#168b82', fontWeight: 800, cursor: 'pointer' }}>PREPARE STRATEGY DRAFT</button>
      </section>
      <section style={panel}>
        <h3 style={{ margin: '0 0 6px' }}>AI Risk Intelligence</h3><p style={{ ...muted, fontSize: 12 }}>Weka kiwango cha risk unachopanga. Hii ni mipaka ya kupanga tu, si ushauri wa faida.</p>
        <label style={{ fontSize: 12 }}>Maximum planned risk (%)<input type='number' min='0.1' max='5' step='0.1' value={risk} onChange={e=>setRisk(e.target.value)} style={field}/></label>
        <div style={{ marginTop: 12, borderRadius: 9, padding: 11, background: '#0a192c', border: '1px solid #315477', fontSize: 12 }}>Configured planning limit: <strong style={{ color: '#43e2c0' }}>{risk || '0'}%</strong></div>
      </section>
    </div>
    {notice && <div role='status' style={{ ...panel, borderColor: '#76591d', background: '#302713', color: '#f8d78e', fontSize: 12 }}>{notice}</div>}
    <section style={{ ...panel, borderColor: '#76591d', background: '#302713', color: '#f8d78e', fontSize: 12, lineHeight: 1.6 }}>
      <strong>Connection requirements</strong><p style={{ margin: '6px 0' }}>AI responses need a secure server-side AI provider connection. Live scanning needs the official Deriv API tick stream. API secrets must stay on the server, never inside browser code. Auto-trading stays disabled until account authorization, risk limits and demo tests are complete.</p>
    </section>
  </div>;
};

export default AIEngine;
