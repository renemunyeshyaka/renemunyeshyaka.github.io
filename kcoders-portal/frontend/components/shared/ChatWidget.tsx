'use client';

import { useState, useRef } from 'react';

interface Message {
  role: 'user' | 'bot';
  text: string;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const msgsRef = useRef<HTMLDivElement>(null);

  const scrollBottom = () => {
    setTimeout(() => {
      msgsRef.current?.scrollTo({ top: msgsRef.current.scrollHeight, behavior: 'smooth' });
    }, 50);
  };

  const sendMessage = async () => {
    const msg = input.trim();
    if (!msg || loading) return;

    setMessages(prev => [...prev, { role: 'user', text: msg }]);
    setInput('');
    setLoading(true);
    scrollBottom();

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'bot', text: data.reply || "Sorry, I couldn't process that." }]);
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: 'Connection issue. Please try again later.' }]);
    }

    setLoading(false);
    scrollBottom();
  };

  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
      fontFamily: "'Space Grotesk', 'Inter', sans-serif",
    }}>
      <style>{`
        .cb-btn {
          width:56px;height:56px;border-radius:50%;background:#f97316;color:#0f0f12;
          border:none;cursor:pointer;font-size:24px;
          box-shadow:0 4px 20px rgba(249,115,22,.4);transition:all .25s;
          display:flex;align-items:center;justify-content:center;
        }
        .cb-btn:hover{transform:scale(1.08);box-shadow:0 6px 28px rgba(249,115,22,.5)}
        .cb-panel {
          position:absolute;bottom:68px;right:0;width:360px;max-height:520px;
          background:#1a1a1f;border-radius:20px;
          border:1px solid rgba(255,255,255,.08);box-shadow:0 20px 60px rgba(0,0,0,.5);
          display:flex;flex-direction:column;overflow:hidden;
        }
        .cb-header{background:#f97316;color:#0f0f12;font-weight:600;font-size:15px;display:flex;justify-content:space-between;align-items:center;}
        .cb-body{padding:16px;overflow-y:auto;flex:1;display:flex;flex-direction:column;gap:10px;min-height:200px;max-height:340px;}
        .cb-msg{max-width:85%;padding:10px 14px;border-radius:16px;font-size:14px;line-height:1.5;animation:fadeIn .3s;white-space:pre-wrap;}
        .cb-msg.bot{background:#22222a;color:#ededee;align-self:flex-start;border-bottom-left-radius:4px}
        .cb-msg.user{background:#f97316;color:#0f0f12;align-self:flex-end;border-bottom-right-radius:4px}
        .cb-input-wrap{display:flex;gap:8px;padding:12px 16px;border-top:1px solid rgba(255,255,255,.06)}
        .cb-input{flex:1;background:#22222a;border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:10px 14px;color:#ededee;font-size:14px;outline:none;font-family:inherit}
        .cb-input:focus{border-color:#f97316}
        .cb-send{background:#f97316;color:#0f0f12;border:none;border-radius:12px;width:40px;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;transition:all .2s}
        .cb-send:hover{background:#fb923c}
        .cb-send:disabled{opacity:.5;cursor:not-allowed}
        .cb-welcome{color:rgba(255,255,255,.5);font-size:13px;text-align:center;padding:30px 0}
        .cb-spinner{width:16px;height:16px;border:2px solid rgba(255,255,255,.2);border-top-color:#fff;border-radius:50%;animation:spin .6s linear infinite;margin:4px 0}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @media(max-width:480px){.cb-panel{width:calc(100vw - 32px);right:-8px}}
      `}</style>

      {open && (
        <div className="cb-panel">
          <div className="cb-header" style={{ padding: '16px 20px' }}>
            <span>Kcoders Chat Box</span>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: '#0f0f12', cursor: 'pointer', fontSize: 18, opacity: 0.7 }}>✕</button>
          </div>
          <div className="cb-body" ref={msgsRef}>
            {messages.length === 0 && (
              <div className="cb-welcome">Hi! Ask me about Jean René's skills, projects, or services 👋</div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`cb-msg ${m.role}`}>{m.text}</div>
            ))}
            {loading && <div className="cb-msg bot"><div className="cb-spinner" /></div>}
          </div>
          <div className="cb-input-wrap">
            <input
              className="cb-input"
              placeholder="Type your question..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
            />
            <button className="cb-send" onClick={sendMessage} disabled={loading}>➤</button>
          </div>
        </div>
      )}

      <button className="cb-btn" onClick={() => setOpen(!open)}>
        {open ? '✕' : '💬'}
      </button>
    </div>
  );
}
