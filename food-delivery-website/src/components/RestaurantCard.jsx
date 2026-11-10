import React from 'react'
import { Star, Clock3, Bike, Heart } from 'lucide-react'
export default function RestaurantCard({ restaurant: r, onClick, saved, onSave }) {
  return <article className="nearby-card" onClick={onClick} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && onClick()}>
    <div className="nearby-logo"><img src={r.image} alt="" /></div>
    <div className="nearby-copy"><b>{r.name}</b><div className="nearby-meta"><span><Star size={11} fill="currentColor" /> {r.rating}</span><span>♧ {r.cuisine.split('•').pop()}</span><span><Bike size={11} /> {r.time}</span></div><small>{r.offer}</small></div>
    <button className={`nearby-heart ${saved ? 'saved' : ''}`} onClick={e => { e.stopPropagation(); onSave() }} aria-label="Save restaurant"><Heart size={14} fill={saved ? 'currentColor' : 'none'} /></button>
  </article>
}
