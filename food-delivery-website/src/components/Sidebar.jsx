import React from 'react'
import { Home, LayoutGrid, Heart, ClipboardList, MessageSquare, Settings, Utensils, UserRound, ChevronUp, ChevronDown, X } from 'lucide-react'

const links = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'explore', label: 'Explore', icon: LayoutGrid },
  { id: 'favourites', label: 'Favourites', icon: Heart },
  { id: 'orders', label: 'Orders', icon: ClipboardList },
  { id: 'messages', label: 'Messages', icon: MessageSquare, badge: '2' },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export default function Sidebar({ page, setPage, onClose, onPromo }) {
  const active = page === 'home' ? 'explore' : page
  return <aside className="sidebar">
    <div className="side-brand"><span className="side-logo"><Utensils size={17} /></span><b>FoodGo</b><button className="mobile-close" onClick={onClose}><X size={18} /></button></div>
    <nav className="side-nav">
      {links.map(({ id, label, icon: Icon, badge }) => <button key={id} className={`side-link ${active === id ? 'active' : ''}`} onClick={() => { if (id === 'messages' || id === 'settings') { onPromo(id); return } setPage(id === 'explore' ? 'home' : id); onClose?.() }}>
        <Icon size={17} /><span>{label}</span>{badge && <i>{badge}</i>}</button>)}</nav>
    <div className="side-promo"><button className="promo-x" onClick={onPromo}>
      <X size={13} /></button><div className="promo-emoji">🍔</div><b>Food groceries<br />delivery service in<br />
      New Jersey</b><p>Delivering food from top restaurants at your home & office.</p><button onClick={() => { setPage('home'); onClose?.() }}>
        Order now < span>→</span></button></div>
    <div className="side-profile"><img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" alt="Profile" /><div><b>DEV Black</b><small>dexblack@gmail.com</small></div><div className="profile-arrows"><ChevronUp size={13} /><ChevronDown size={13} /></div></div>
  </aside>
}
