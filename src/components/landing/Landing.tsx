import { useState, useEffect, useRef } from 'react'
import Icon from '../Icon'

// ── Animated particles background ──────────────────────────────────────────
function Particles() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let raf: number
    const pts: { x: number; y: number; vx: number; vy: number; a: number }[] = []
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)
    for (let i = 0; i < 55; i++) pts.push({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
      a: Math.random() * 0.35 + 0.05
    })
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(185,159,101,${p.a})`
        ctx.fill()
      })
      pts.forEach((a, i) => pts.slice(i + 1).forEach(b => {
        const d = Math.hypot(a.x - b.x, a.y - b.y)
        if (d < 140) {
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y)
          ctx.strokeStyle = `rgba(185,159,101,${0.06 * (1 - d / 140)})`
          ctx.stroke()
        }
      }))
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={ref} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }} />
}

// ── Chat preview bubble ─────────────────────────────────────────────────────
function ChatBubble({ role, text, delay = 0 }: { role: 'user' | 'ai'; text: string; delay?: number }) {
  const [vis, setVis] = useState(false)
  useEffect(() => { const t = setTimeout(() => setVis(true), delay); return () => clearTimeout(t) }, [delay])
  return (
    <div style={{ display: 'flex', flexDirection: role === 'user' ? 'row-reverse' : 'row', gap: 8, marginBottom: 10, opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(6px)', transition: 'all .35s ease' }}>
      <div style={{ width: 22, height: 22, borderRadius: 6, background: role === 'user' ? 'rgba(72,128,192,.15)' : 'rgba(185,159,101,.15)', border: `1px solid ${role === 'user' ? 'rgba(72,128,192,.3)' : 'rgba(185,159,101,.3)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 7, fontWeight: 800, color: role === 'user' ? 'var(--blue)' : 'var(--gold)', flexShrink: 0 }}>
        {role === 'user' ? 'JA' : 'J'}
      </div>
      <div style={{ maxWidth: '80%', padding: '8px 12px', borderRadius: role === 'user' ? '10px 3px 10px 10px' : '3px 10px 10px 10px', background: role === 'user' ? 'var(--raised)' : 'var(--void)', border: '1px solid var(--border)', fontSize: 12, color: 'var(--t2)', lineHeight: 1.65, whiteSpace: 'pre-line' }}>
        {text}
      </div>
    </div>
  )
}


// ── Install guide modal ──────────────────────────────────────────────────────
function InstallGuide({ platform, onClose }: { platform: 'windows' | 'mac'; onClose: () => void }) {
  const isWin = platform === 'windows'
  return (
    <div onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 16px' }}>
      <div style={{ width: 460, background: '#0a0a0a', border: '1px solid rgba(185,159,101,.25)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,.7)' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--t1)' }}>Install on {isWin ? 'Windows' : 'Mac'}</div>
            <div style={{ fontSize: 11, color: 'var(--t4)', marginTop: 3 }}>Install Pantheon Growth as a desktop app — no download required</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t4)', padding: 4, flexShrink: 0, lineHeight: 0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Chrome / Edge step */}
          <div style={{ padding: '16px', background: 'rgba(185,159,101,.04)', border: '1px solid rgba(185,159,101,.15)', borderRadius: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gold)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 7 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="4.93" y1="4.93" x2="9.17" y2="9.17"/><line x1="14.83" y1="14.83" x2="19.07" y2="19.07"/><line x1="14.83" y1="9.17" x2="19.07" y2="4.93"/><line x1="4.93" y1="19.07" x2="9.17" y2="14.83"/></svg>
              Chrome or Edge (recommended)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                'Open this page in Chrome or Edge',
                'Look for the install icon ⊕ in the address bar (right side)',
                'Click it → then click "Install"',
                'Pantheon Growth opens in its own window — just like a native app',
              ].map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{ width: 18, height: 18, borderRadius: 5, background: 'var(--gold-bg)', border: '1px solid var(--gold-bd)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 800, color: 'var(--gold)', flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                  <div style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.6 }}>{step}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Safari (Mac only) */}
          {!isWin && (
            <div style={{ padding: '14px 16px', background: 'var(--raised)', border: '1px solid var(--border)', borderRadius: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--t2)', marginBottom: 6 }}>Safari (Mac)</div>
              <div style={{ fontSize: 11, color: 'var(--t3)', lineHeight: 1.75 }}>
                File menu → <b style={{ color: 'var(--t2)' }}>Add to Dock</b> — or Share button → <b style={{ color: 'var(--t2)' }}>Add to Dock</b>
              </div>
            </div>
          )}
          {/* Direct open */}
          <button onClick={onClose}
            style={{ width: '100%', padding: '12px', borderRadius: 10, background: 'transparent', border: '1px solid var(--gold-bd)', color: 'var(--gold)', fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font)' }}>
            Open in Browser Instead →
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Agent card ──────────────────────────────────────────────────────────────
function AgentCard({ name, role, color, desc, delay = 0 }: { name: string; role: string; color: string; desc: string; delay?: number }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ padding: '16px', background: hov ? 'var(--raised)' : 'var(--surface)', border: `1px solid ${hov ? color + '30' : 'var(--border)'}`, borderRadius: 12, cursor: 'default', transition: 'all .15s' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: color + '18', border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color, flexShrink: 0 }}>
          {name[0]}
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>{name}</div>
          <div style={{ fontSize: 11, color: 'var(--t4)' }}>{role}</div>
        </div>
      </div>
      <div style={{ fontSize: 12, color: 'var(--t3)', lineHeight: 1.65 }}>{desc}</div>
    </div>
  )
}

// ── Module tile ─────────────────────────────────────────────────────────────
function ModuleTile({ icon, name, desc, badge }: { icon: string; name: string; desc: string; badge?: string }) {
  const [hov, setHov] = useState(false)
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ padding: '18px 18px 16px', background: hov ? 'var(--raised)' : 'var(--surface)', transition: 'background .12s', position: 'relative', height: '100%', boxSizing: 'border-box' as const }}>
      {badge && <div style={{ position: 'absolute', top: 10, right: 10, fontSize: 8, fontWeight: 800, padding: '2px 6px', borderRadius: 6, background: 'var(--gold-bg)', border: '1px solid var(--gold-bd)', color: 'var(--gold)', letterSpacing: '.06em', textTransform: 'uppercase' }}>{badge}</div>}
      <div style={{ marginBottom: 10 }}><Icon name={icon as any} size={15} color="var(--gold)" /></div>
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--t1)', marginBottom: 4 }}>{name}</div>
      <div style={{ fontSize: 11, color: 'var(--t4)', lineHeight: 1.6 }}>{desc}</div>
    </div>
  )
}

// ── Provider logo row ───────────────────────────────────────────────────────
function ProviderPill({ name, color }: { name: string; color: string }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 20, background: color + '0d', border: `1px solid ${color}25`, fontSize: 11, fontWeight: 600, color }}>
      <div style={{ width: 6, height: 6, borderRadius: '50%', background: color }} />
      {name}
    </div>
  )
}


// ── Main landing ────────────────────────────────────────────────────────────
export default function Landing() {
  const DOWNLOAD_URLS = {
    windows: 'https://github.com/alfarjoao/pantheon-growth-ai-plataform/releases/download/v4.0.3/Pantheon.Growth.Setup.4.0.3.exe',
    mac: 'https://github.com/alfarjoao/pantheon-growth-ai-plataform/releases/download/v4.0.3/Pantheon.Growth-4.0.3-arm64.pkg',
  }

  const triggerInstall = (platform: 'windows' | 'mac') => {
    window.location.href = DOWNLOAD_URLS[platform]
  }

  const tr = (delay = 0) => ({ opacity: 0, animation: `fadeUp .6s ${delay}ms both` })

  const AGENTS = [
    { name: 'Jarvis', role: 'Chief of Staff', color: '#b99f65', desc: 'Synthesises agency state, prioritises actions, connects CRM to chat. Your virtual COO.' },
    { name: 'Sales', role: 'Sales & Conversion', color: '#48A068', desc: 'Sales scripts, objections, follow-ups, call analysis. Close more at AI speed.' },
    { name: 'Engineer', role: 'Full-Stack Dev', color: '#4880C0', desc: 'React, TypeScript, Next.js, funnels. Production-grade code without juniors.' },
    { name: 'Marketing', role: 'Growth & Funnels', color: '#C07840', desc: 'Meta Ads, Google Ads, copywriting, conversion funnels. ROI first, always.' },
    { name: 'Strategist', role: 'Business Strategy', color: '#7858C0', desc: 'Positioning, pricing, scale, retention. Only what moves the needle from €10k to €100k/month.' },
  ]

  const MODULES = [
    { icon: 'crm',        name: 'CRM',          desc: 'Kanban pipeline, AI scoring, call history',  badge: '' },
    { icon: 'chat',       name: 'Chat AI',       desc: 'Multi-model per conversation, slash commands',    badge: 'AI' },
    { icon: 'finance',    name: 'Finance',      desc: 'P&L, cashflow, billed projects, metrics',    badge: '' },
    { icon: 'projects',   name: 'Projects',     desc: 'Timelines, Gantt, clients, budgets',          badge: '' },
    { icon: 'tasks',      name: 'Tasks',         desc: 'Kanban board, priorities, assigned',           badge: '' },
    { icon: 'agents',     name: 'AI Agents',     desc: '5 core agents + custom agent creation',      badge: 'AI' },
    { icon: 'aifactory',  name: 'AI Factory',    desc: 'Create agents with any model/provider',       badge: 'AI' },
    { icon: 'automation', name: 'Automations',   desc: 'Rules, triggers, automatic actions',           badge: '' },
    { icon: 'analytics',  name: 'Analytics',     desc: 'Agency metrics, funnel, conversion',          badge: '' },
    { icon: 'saleshub',   name: 'Sales Hub',     desc: 'Hot leads, scripts, calls, next steps', badge: '' },
    { icon: 'emailhub',   name: 'Email Hub',     desc: 'AI drafts, approval, batch sending',        badge: 'AI' },
    { icon: 'apollo',     name: 'Apollo.io',     desc: 'Integrated prospecting, permanent login',        badge: '' },
    { icon: 'outreach',   name: 'Outreach',      desc: 'Contact sequences, templates, CSV import',  badge: '' },
    { icon: 'knowledge',  name: 'Knowledge',     desc: 'Agency knowledge base for AI context', badge: 'AI' },
    { icon: 'msgs',       name: 'Messages',     desc: 'Private chat João ↔ Simão, team channels',    badge: '' },
    { icon: 'calendar',   name: 'Calendar',      desc: 'Meetings, follow-ups, agency schedule',        badge: '' },
  ]

  const AI_PROVIDERS = [
    { name: 'Claude', color: '#b99f65' },
    { name: 'GPT-4o', color: '#10a37f' },
    { name: 'Gemini', color: '#4285f4' },
    { name: 'Grok', color: '#e7e7e7' },
    { name: 'Mistral', color: '#ff7000' },
    { name: 'Llama', color: '#7c5cbf' },
    { name: 'Ollama', color: '#48A068' },
    { name: 'Custom', color: '#8A8A8A' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--void)', overflowX: 'hidden', fontFamily: 'var(--font)', position: 'relative' }}>
      <Particles />

      {/* ── NAV ── */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(0,0,0,.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)', padding: '0 40px', height: 52, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, overflow: 'hidden' }}>
            <img src="/logo.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)', letterSpacing: '-.3px' }}>Pantheon Growth</span>
          <span style={{ fontSize: 10, color: 'var(--t4)', padding: '2px 6px', borderRadius: 4, border: '1px solid var(--border)', marginLeft: 2 }}>Agency OS</span>
        </div>
        <div style={{ flex: 1 }} />
        <button onClick={() => triggerInstall('windows')}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 16px', borderRadius: 7, background: 'linear-gradient(135deg,#b99f65,#ccb07a)', border: 'none', color: '#0a0a0a', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font)' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-13.051-1.851"/></svg>
          Download
        </button>
      </nav>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '100px 56px 80px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%,-50%)', width: 900, height: 700, background: 'radial-gradient(ellipse,rgba(185,159,101,.06) 0%,transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 680, position: 'relative' }}>
          <div style={{ ...tr(80), marginBottom: 24 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 10, fontWeight: 600, color: 'var(--gold)', letterSpacing: '2.5px', textTransform: 'uppercase', padding: '5px 16px', borderRadius: 20, border: '1px solid var(--gold-bd)', background: 'var(--gold-bg)' }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--gold)', animation: 'pulse 2s infinite' }} />
              Agency AI Operating System
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(44px,6.5vw,80px)', fontWeight: 800, lineHeight: .95, letterSpacing: '-4px', marginBottom: 24, ...tr(140) }}>
            The operating system<br />
            <span style={{ background: 'linear-gradient(135deg,#b99f65,#D4A870)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>for your agency.</span>
          </h1>
          <p style={{ fontSize: 18, color: 'var(--t3)', lineHeight: 1.7, maxWidth: 480, margin: '0 auto 16px', ...tr(200) }}>
            CRM, finance, AI and projects in a workspace built exclusively for Pantheon Growth.
          </p>
          <p style={{ fontSize: 14, color: 'var(--t4)', lineHeight: 1.7, maxWidth: 420, margin: '0 auto 44px', ...tr(240) }}>
            5 specialised AI agents. Support for 8 AI providers. 16 integrated modules.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', ...tr(280) }}>
            <button onClick={() => triggerInstall('windows')}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600, background: 'transparent', border: '1px solid var(--border2)', color: 'var(--t2)', cursor: 'pointer', transition: 'all .15s', fontFamily: 'var(--font)' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--gold-bd)'; el.style.color = 'var(--gold)'; el.style.background = 'var(--gold-bg)' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border2)'; el.style.color = 'var(--t2)'; el.style.background = 'transparent' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-13.051-1.851"/></svg>
              Download for Windows
            </button>
            <button onClick={() => triggerInstall('mac')}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600, background: 'transparent', border: '1px solid var(--border2)', color: 'var(--t2)', cursor: 'pointer', transition: 'all .15s', fontFamily: 'var(--font)' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--gold-bd)'; el.style.color = 'var(--gold)'; el.style.background = 'var(--gold-bg)' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border2)'; el.style.color = 'var(--t2)'; el.style.background = 'transparent' }}>
              <svg width="14" height="14" viewBox="0 0 814 1000" fill="currentColor"><path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 442.3 8 341.8 8 244.5c0-170.1 111.4-260.2 222.5-260.2 74.4 0 136.4 49 181.7 49 43.3 0 112.5-52.2 195.6-52.2 31.9 0 109.2 4.5 163.7 68.4zm-107.4-98.7c-17.9-23.4-45.2-40.7-74.5-40.7-3.4 0-6.9.3-10.3.9 2.2-17.2 11.2-34.4 24-47.7 17.9-18.7 47.8-32.1 73.2-32.1 2.1 0 4.2.2 6.3.3-2.4 18.1-12.2 36.3-18.7 45.5z"/></svg>
              Download for Mac
            </button>
          </div>

          {/* Stats bar */}
          <div style={{ display: 'flex', gap: 0, justifyContent: 'center', marginTop: 64, paddingTop: 32, borderTop: '1px solid var(--border)', flexWrap: 'wrap', ...tr(360) }}>
            {[['16+','modules'],['5','AI agents'],['8','AI providers'],['100%','local data']].map(([v, l], i) => (
              <div key={l} style={{ flex: '1 0 120px', textAlign: 'center', padding: '0 24px', borderRight: i < 3 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--t1)', letterSpacing: '-1.5px' }}>{v}</div>
                <div style={{ fontSize: 11, color: 'var(--t4)', marginTop: 3 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI PROVIDERS ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '20px 56px 60px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--t4)', letterSpacing: '2px', textTransform: 'uppercase' }}>Native support for</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
          {AI_PROVIDERS.map(p => <ProviderPill key={p.name} {...p} />)}
        </div>
      </section>

      {/* ── MODULES GRID ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '64px 56px', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--t4)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 10 }}>Modules</div>
            <h2 style={{ fontSize: 32, fontWeight: 700, color: 'var(--t1)', letterSpacing: '-1.2px', marginBottom: 10 }}>Everything in one workspace</h2>
            <p style={{ fontSize: 14, color: 'var(--t3)', maxWidth: 440, margin: '0 auto' }}>16 integrated modules, all shared across the entire team.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gridAutoRows: '1fr', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
            {MODULES.map((m, i) => {
              const col = i % 4
              const row = Math.floor(i / 4)
              const totalRows = Math.ceil(MODULES.length / 4)
              return (
                <div key={m.name} style={{
                  borderRight: col < 3 ? '1px solid var(--border)' : 'none',
                  borderBottom: row < totalRows - 1 ? '1px solid var(--border)' : 'none',
                }}>
                  <ModuleTile {...m} />
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── AI AGENTS ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '72px 56px', borderTop: '1px solid var(--border)', background: 'var(--void)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start' }}>
            {/* Left: explanation */}
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--gold)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 14 }}>Specialised AI Agents</div>
              <h2 style={{ fontSize: 30, fontWeight: 700, color: 'var(--t1)', letterSpacing: '-1px', lineHeight: 1.15, marginBottom: 18 }}>
                An AI team.<br />Always available.
              </h2>
              <p style={{ fontSize: 14, color: 'var(--t3)', lineHeight: 1.8, marginBottom: 28 }}>
                Each agent has a deep prompt system built around Pantheon Growth — not generic chatbots. They know the agency, the clients, the offers and how to close.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  ['Real agency context', 'CRM, pipeline, projects, finance — always in AI context'],
                  ['Custom agent creation', 'AI Factory: create agents with any model and prompt'],
                  ['Multi-provider', 'Each agent uses the ideal model — Jarvis with Claude, another with GPT'],
                  ['Task extraction', 'Detects actions in responses and suggests creating tasks on the board'],
                ].map(([t, d]) => (
                  <div key={t} style={{ display: 'flex', gap: 10, padding: '11px 14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 9 }}>
                    <Icon name="check" size={13} color="var(--green)" />
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--t1)' }}>{t}</div>
                      <div style={{ fontSize: 11, color: 'var(--t4)', marginTop: 2 }}>{d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Right: agent cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {AGENTS.map((a, i) => <AgentCard key={a.name} {...a} delay={i * 80} />)}
            </div>
          </div>
        </div>
      </section>

      {/* ── JARVIS DEMO ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '72px 56px', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
            {/* Chat preview */}
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8, background: 'var(--void)' }}>
                <div style={{ width: 26, height: 26, borderRadius: 7, background: 'rgba(185,159,101,.15)', border: '1px solid rgba(185,159,101,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 800, color: 'var(--gold)' }}>J</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--t1)' }}>Jarvis</div>
                  <div style={{ fontSize: 10, color: 'var(--t4)' }}>Chief of Staff · claude-sonnet</div>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5, fontSize: 9, color: 'var(--green)' }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--green)' }} /> online
                </div>
              </div>
              <div style={{ padding: '16px' }}>
                <ChatBubble role="user" text="Called Pedro Costa, he's interested but wants to see ROI. Proposal tomorrow." delay={300} />
                <ChatBubble role="ai" text={"Done. Updated Pedro to \"Proposal\" in CRM.\n\nFor the proposal ROI:\n→ Restaurants: +2-3 clients/month via funnels\n→ Case study: Ana Rodrigues +40% in 60 days\n→ Entry pack €1,500/month, quick wins in 30 days\n\nTask created: Send proposal to Pedro Costa."} delay={900} />
                <div style={{ marginTop: 10, padding: '8px 10px', background: 'var(--gold-bg)', border: '1px solid var(--gold-bd)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon name="zap" size={11} color="var(--gold)" />
                  <span style={{ fontSize: 11, color: 'var(--gold)', fontWeight: 500 }}>1 task created automatically</span>
                  <span style={{ marginLeft: 'auto', fontSize: 10, padding: '2px 8px', borderRadius: 6, background: 'var(--gold-g)', color: '#080808', fontWeight: 700, cursor: 'pointer' }}>View</span>
                </div>
              </div>
            </div>
            {/* Right: explanation */}
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--gold)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 14 }}>AI with operational memory</div>
              <h2 style={{ fontSize: 28, fontWeight: 700, color: 'var(--t1)', letterSpacing: '-1px', lineHeight: 1.2, marginBottom: 18 }}>
                Talk to the AI.<br />The agency updates itself.
              </h2>
              <p style={{ fontSize: 14, color: 'var(--t3)', lineHeight: 1.8, marginBottom: 28 }}>
                Jarvis isn't a chatbot. It's your digital Chief of Staff. Every conversation is enriched with CRM context, pipeline, pending tasks and knowledge base.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { icon: 'users', title: 'CRM integrated in chat', desc: 'Mention a client and Jarvis sees the full history.' },
                  { icon: 'tasks', title: 'Automatic tasks', desc: 'Detects actions in responses. One click to create the task.' },
                  { icon: 'knowledge', title: 'Knowledge base', desc: 'Add offers, processes, scripts — the AI uses them in context.' },
                  { icon: 'crystal', title: 'Slash commands', desc: '/proposta, /briefing, /followup, /score — quick actions.' },
                ].map(item => (
                  <div key={item.title} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--surface)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon name={item.icon as any} size={14} color="var(--gold)" />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--t1)', marginBottom: 3 }}>{item.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--t4)', lineHeight: 1.6 }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── AI HUB (multi-provider) ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '72px 56px', borderTop: '1px solid var(--border)', background: 'var(--void)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--t4)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 12 }}>Universal AI Hub</div>
            <h2 style={{ fontSize: 30, fontWeight: 700, color: 'var(--t1)', letterSpacing: '-1px', marginBottom: 14 }}>Any model. Any provider.</h2>
            <p style={{ fontSize: 14, color: 'var(--t3)', maxWidth: 500, margin: '0 auto' }}>
              Claude Opus, GPT-4o, Gemini 2.5 Pro, Grok, Mistral, Llama via Groq/Together, or any local model via Ollama. Your choice per conversation.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
            {[
              { name: 'Claude', models: 'Opus · Sonnet · Haiku', color: '#b99f65', note: 'Default — core agents' },
              { name: 'GPT-4o', models: 'GPT-4o · 4o-mini · o1', color: '#10a37f', note: 'Complex reasoning' },
              { name: 'Gemini', models: '2.5 Pro · 2.0 Flash', color: '#4285f4', note: 'Long context' },
              { name: 'Grok', models: 'Grok-2 · Beta', color: '#e7e7e7', note: 'Real-time web' },
              { name: 'Mistral', models: 'Large · Small', color: '#ff7000', note: 'European, efficient' },
              { name: 'Groq', models: 'Llama 3.3 · Mixtral', color: '#7c5cbf', note: 'Ultra-fast' },
              { name: 'Ollama', models: 'Any local model', color: '#48A068', note: '100% private' },
              { name: 'Custom', models: 'OpenAI-compatible', color: '#8A8A8A', note: 'Any endpoint' },
            ].map(p => (
              <div key={p.name} style={{ padding: '16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>{p.name}</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--t3)', marginBottom: 5 }}>{p.models}</div>
                <div style={{ fontSize: 10, color: 'var(--t4)', fontStyle: 'italic' }}>{p.note}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 28, padding: '18px 22px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 14 }}>
            <Icon name="settings" size={16} color="var(--gold)" />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--t1)', marginBottom: 3 }}>Configuration in Settings → AI Models</div>
              <div style={{ fontSize: 12, color: 'var(--t4)' }}>Add your API keys, set the default model and choose which model each agent uses.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── AI FACTORY ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '72px 56px', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--gold)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 14 }}>AI Factory</div>
              <h2 style={{ fontSize: 28, fontWeight: 700, color: 'var(--t1)', letterSpacing: '-1px', lineHeight: 1.2, marginBottom: 18 }}>
                Build your own<br />AI agents.
              </h2>
              <p style={{ fontSize: 14, color: 'var(--t3)', lineHeight: 1.8, marginBottom: 28 }}>
                Create a "Contract Writer" agent with Claude Opus, a "Lead Researcher" with Perplexity, an "Ad Analyser" with GPT-4o. Each with its own prompt system and ideal model.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  'Define name, avatar and personality',
                  'Choose the model provider (Claude, GPT, Gemini…)',
                  'Write the system prompt in natural language',
                  'Available immediately in Chat AI',
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <div style={{ width: 20, height: 20, borderRadius: 5, background: 'var(--gold-bg)', border: '1px solid var(--gold-bd)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 800, color: 'var(--gold)', flexShrink: 0 }}>{i + 1}</div>
                    <div style={{ fontSize: 13, color: 'var(--t2)' }}>{item}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Factory UI preview */}
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8, background: 'var(--void)' }}>
                <Icon name="aifactory" size={13} color="var(--gold)" />
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--t1)' }}>AI Factory</span>
                <span style={{ marginLeft: 'auto', fontSize: 10, padding: '2px 8px', borderRadius: 5, background: 'var(--gold-bg)', color: 'var(--gold)', border: '1px solid var(--gold-bd)' }}>+ New Agent</span>
              </div>
              <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { name: 'Jarvis', role: 'Chief of Staff', model: 'claude-opus', color: '#b99f65', core: true },
                  { name: 'Sales Machine', role: 'Sales & Conversion', model: 'claude-sonnet', color: '#48A068', core: true },
                  { name: 'Redactor', role: 'Contracts & Docs', model: 'gpt-4o', color: '#10a37f', core: false },
                  { name: 'Lead Scout', role: 'Lead Research', model: 'gemini-2.5-pro', color: '#4285f4', core: false },
                ].map(agent => (
                  <div key={agent.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', background: 'var(--raised)', borderRadius: 9, border: '1px solid var(--border)' }}>
                    <div style={{ width: 28, height: 28, borderRadius: 7, background: agent.color + '18', border: `1px solid ${agent.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 800, color: agent.color, flexShrink: 0 }}>{agent.name[0]}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--t1)' }}>{agent.name}</div>
                      <div style={{ fontSize: 10, color: 'var(--t4)' }}>{agent.role}</div>
                    </div>
                    <div style={{ fontSize: 9, padding: '2px 7px', borderRadius: 5, background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--t4)', whiteSpace: 'nowrap' }}>{agent.model}</div>
                    {agent.core && <div style={{ fontSize: 9, padding: '2px 6px', borderRadius: 5, background: 'var(--gold-bg)', color: 'var(--gold)', border: '1px solid var(--gold-bd)' }}>core</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PLAYGROUND ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '72px 56px', borderTop: '1px solid var(--border)', background: 'var(--void)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
            {/* Preview */}
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', background: 'var(--void)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon name="crystal" size={13} color="var(--gold)" />
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--t1)' }}>AI Playground</span>
              </div>
              <div style={{ padding: '14px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[
                  { model: 'Claude 3.5 Sonnet', color: '#b99f65', resp: 'Pedro needs to see concrete ROI. Proposal: €1,500/month with a 30-day results guarantee.' },
                  { model: 'GPT-4o', color: '#10a37f', resp: 'I recommend a quick-wins focused proposal. 3 actions with measurable results in 2 weeks.' },
                  { model: 'Gemini 2.5 Pro', color: '#4285f4', resp: 'To close: show 3 similar case studies with documented ROI. Pedro needs social proof.' },
                  { model: 'Grok-2', color: '#e7e7e7', resp: 'Direct angle: "€1,500 today, €15,000 in 3 months or money back." Close on the call, not by email.' },
                ].map(m => (
                  <div key={m.model} style={{ padding: '10px 12px', background: 'var(--raised)', borderRadius: 8, border: `1px solid ${m.color}20` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}>
                      <div style={{ width: 5, height: 5, borderRadius: '50%', background: m.color }} />
                      <span style={{ fontSize: 9, fontWeight: 700, color: m.color }}>{m.model}</span>
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--t3)', lineHeight: 1.6 }}>{m.resp}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Explanation */}
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--gold)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 14 }}>AI Playground</div>
              <h2 style={{ fontSize: 28, fontWeight: 700, color: 'var(--t1)', letterSpacing: '-1px', lineHeight: 1.2, marginBottom: 18 }}>
                Compare models<br />side by side.
              </h2>
              <p style={{ fontSize: 14, color: 'var(--t3)', lineHeight: 1.8, marginBottom: 28 }}>
                Test the same prompt across multiple models simultaneously. See which gives the best answer for each type of task and optimise your AI stack.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  ['Up to 4 models in parallel', 'Compare Claude, GPT, Gemini and Grok on the same query'],
                  ['Temperature and max tokens', 'Full control of parameters per model'],
                  ['Slash commands / tools', '/proposta, /briefing and other quick commands'],
                  ['Real-time streaming', 'See responses appearing simultaneously'],
                ].map(([t, d]) => (
                  <div key={t} style={{ display: 'flex', gap: 10 }}>
                    <Icon name="check" size={13} color="var(--green)" />
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--t1)' }}>{t}</div>
                      <div style={{ fontSize: 11, color: 'var(--t4)', marginTop: 2 }}>{d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CRM + FINANCE ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '72px 56px', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--t4)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 10 }}>Operations</div>
            <h2 style={{ fontSize: 30, fontWeight: 700, color: 'var(--t1)', letterSpacing: '-1px', marginBottom: 10 }}>Agency CRM and finance.</h2>
            <p style={{ fontSize: 14, color: 'var(--t3)', maxWidth: 460, margin: '0 auto' }}>Sales pipeline, AI lead scoring, P&L, cashflow and project management — all in one place.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
            {[
              { icon: 'crm', title: 'CRM Kanban', items: ['Visual pipeline by stage', 'AI lead scoring', 'Call history and notes', 'Lead assignment by user'] },
              { icon: 'finance', title: 'Finance', items: ['Monthly and annual P&L', 'Projected cashflow', 'Revenue by client', 'Agency KPIs'] },
              { icon: 'projects', title: 'Projects', items: ['Active project management', 'Timelines and milestones', 'Budget vs. actual', 'Linked to CRM'] },
            ].map(card => (
              <div key={card.title} style={{ padding: '20px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--gold-bg)', border: '1px solid var(--gold-bd)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name={card.icon as any} size={15} color="var(--gold)" />
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)' }}>{card.title}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                  {card.items.map(item => (
                    <div key={item} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <div style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--t4)', flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: 'var(--t3)' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '96px 56px', borderTop: '1px solid var(--border)', background: 'var(--void)', textAlign: 'center' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 500, background: 'radial-gradient(ellipse,rgba(185,159,101,.06) 0%,transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', maxWidth: 520, margin: '0 auto' }}>
          <div style={{ width: 60, height: 60, borderRadius: 16, overflow: 'hidden', margin: '0 auto 24px' }}>
            <img src="/logo.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: 'var(--t1)', letterSpacing: '-1.5px', marginBottom: 16 }}>Ready to start?</h2>
          <p style={{ fontSize: 15, color: 'var(--t3)', marginBottom: 40, lineHeight: 1.7 }}>The workspace is ready. The API key is the only step left.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => triggerInstall('windows')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '15px 36px', borderRadius: 10, fontSize: 15, fontWeight: 700, background: 'linear-gradient(135deg,#b99f65,#ccb07a)', border: 'none', color: '#0a0a0a', cursor: 'pointer', boxShadow: '0 0 50px rgba(185,159,101,.22)', transition: 'all .18s', fontFamily: 'var(--font)' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = '0 12px 50px rgba(185,159,101,.36)' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'none'; el.style.boxShadow = '0 0 50px rgba(185,159,101,.22)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-13.051-1.851"/></svg>
              Download for Windows
            </button>
            <button onClick={() => triggerInstall('mac')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '15px 22px', borderRadius: 10, fontSize: 14, fontWeight: 600, background: 'transparent', border: '1px solid var(--border2)', color: 'var(--t2)', cursor: 'pointer', transition: 'all .15s', fontFamily: 'var(--font)' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--gold-bd)'; el.style.color = 'var(--gold)'; el.style.background = 'var(--gold-bg)' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border2)'; el.style.color = 'var(--t2)'; el.style.background = 'transparent' }}>
              <svg width="14" height="14" viewBox="0 0 814 1000" fill="currentColor"><path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 442.3 8 341.8 8 244.5c0-170.1 111.4-260.2 222.5-260.2 74.4 0 136.4 49 181.7 49 43.3 0 112.5-52.2 195.6-52.2 31.9 0 109.2 4.5 163.7 68.4zm-107.4-98.7c-17.9-23.4-45.2-40.7-74.5-40.7-3.4 0-6.9.3-10.3.9 2.2-17.2 11.2-34.4 24-47.7 17.9-18.7 47.8-32.1 73.2-32.1 2.1 0 4.2.2 6.3.3-2.4 18.1-12.2 36.3-18.7 45.5z"/></svg>
              Download for Mac
            </button>
          </div>
        </div>
      </section>


      {/* ── FOOTER ── */}
      <footer style={{ position: 'relative', zIndex: 1, borderTop: '1px solid var(--border)', padding: '18px 56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 18, height: 18, borderRadius: 4, overflow: 'hidden', opacity: .4 }}><img src="/logo.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
          <span style={{ fontSize: 12, color: 'var(--t4)' }}>Pantheon Growth © 2025</span>
        </div>
        <span style={{ fontSize: 12, color: 'var(--t4)' }}>Powered by Claude AI · Built for Pantheon Growth</span>
      </footer>

    </div>
  )
}
