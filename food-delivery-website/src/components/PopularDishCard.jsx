import React from 'react'
import { Star, Clock3, Plus } from 'lucide-react'
export default function PopularDishCard({ dish, onClick }) {
  return <article className="popular-card">
    <button className="popular-photo" onClick={onClick}>
      <img src={dish.image} alt={dish.name}/>
      <span className="photo-plus">
        <Plus size={17}/>
        </span>
        </button>
        <div className="popular-info">
          <div className="popular-meta">
            <span><Star size={11} fill="currentColor"/> 4.3 (104)</span>
            <span>♧ {dish.category}</span><span>
              <Clock3 size={11}/> 25–35 min</span></div>
              <div className="popular-name-row">
                <b>{dish.name}</b>
                <strong>₹{dish.price}</strong>
                </div>
                <small>{dish.veg?'Free delivery':'Buy 2 get 1 free'}</small>
                </div>
                </article>
}
