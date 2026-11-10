import React, { useEffect, useMemo, useState } from 'react'
import { Search, ShoppingBag, MapPin, ChevronDown, Star, Clock3, Bike, Plus, Minus, X, SlidersHorizontal, ArrowLeft, Check, Leaf, Heart, Utensils, PackageCheck, ChefHat, Truck, ArrowRight, Sparkles } from 'lucide-react'
import Sidebar from './components/Sidebar'
import RestaurantCard from './components/RestaurantCard'
import PopularDishCard from './components/PopularDishCard'

const restaurants = [
  { id: 1, name: 'The Good Bowl', cuisine: 'Healthy • Bowls', rating: 4.8, time: '20–30 min', fee: 19, offer: '20% OFF up to ₹100', tag: 'Popular', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=900', color: '#e7f1df' },
  { id: 2, name: 'Pizza Theory', cuisine: 'Italian • Pizza', rating: 4.6, time: '25–35 min', fee: 25, offer: 'Free garlic bread', tag: 'Bestseller', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=900', color: '#f8e4d9' },
  { id: 3, name: 'Wok This Way', cuisine: 'Asian • Chinese', rating: 4.7, time: '20–30 min', fee: 15, offer: '₹75 OFF above ₹299', tag: 'Fast delivery', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=900', color: '#f4e9d6' },
  { id: 4, name: 'Burger District', cuisine: 'American • Burgers', rating: 4.5, time: '30–40 min', fee: 20, offer: 'Buy 1 Get 1', tag: 'Great value', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=900', color: '#f6e6cb' },
  { id: 5, name: 'Spice Route', cuisine: 'Indian • North Indian', rating: 4.9, time: '25–35 min', fee: 10, offer: '20% OFF your order', tag: 'Top rated', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=900', color: '#f1dfd3' },
  { id: 6, name: 'Sushi & Soul', cuisine: 'Japanese • Sushi', rating: 4.7, time: '35–45 min', fee: 30, offer: 'Free miso soup', tag: 'Fresh picks', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=900', color: '#e4eee9' }
]
const dishes = [
  { id: 101, restaurantId: 1, name: 'Paneer Power Bowl', desc: 'Grilled paneer, brown rice, crunchy greens and mint yogurt.', price: 249, category: 'Signature bowls', veg: true, popular: true, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=700', addons: [['Extra paneer', 49], ['Avocado', 59], ['Mint yogurt', 19]] },
  { id: 102, restaurantId: 1, name: 'Rainbow Buddha Bowl', desc: 'A colourful mix of roasted vegetables, grains and tahini.', price: 229, category: 'Signature bowls', veg: true, popular: false, image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=700', addons: [['Extra hummus', 29], ['Avocado', 59]] },
  { id: 103, restaurantId: 1, name: 'Chocolate Protein Shake', desc: 'Creamy cocoa, banana and a boost of plant protein.', price: 149, category: 'Drinks', veg: true, popular: true, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=700', addons: [['Extra protein', 39], ['Oat milk', 20]] },
  { id: 201, restaurantId: 2, name: 'Margherita Pizza', desc: 'Classic tomato, mozzarella and fragrant basil.', price: 299, category: 'Pizzas', veg: true, popular: true, image: 'https://images.unsplash.com/photo-1579751626657-72bc17010498?w=700', addons: [['Extra cheese', 49], ['Olives', 29], ['Jalapeños', 19]] },
  { id: 202, restaurantId: 2, name: 'Farmhouse Pizza', desc: 'Loaded with capsicum, onion, mushrooms and sweet corn.', price: 379, category: 'Pizzas', veg: true, popular: true, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=700', addons: [['Extra cheese', 49], ['Mushrooms', 39]] },
  { id: 203, restaurantId: 2, name: 'Garlic Bread', desc: 'Toasted bread with garlic butter and herbs.', price: 129, category: 'Sides', veg: true, popular: false, image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=700', addons: [['Cheese dip', 25]] },
  { id: 301, restaurantId: 3, name: 'Chilli Garlic Noodles', desc: 'Wok-tossed noodles with garlic, vegetables and chilli.', price: 219, category: 'Noodles & rice', veg: true, popular: true, image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=700', addons: [['Paneer', 40], ['Extra spicy', 0]] },
  { id: 302, restaurantId: 3, name: 'Crispy Veg Momos', desc: 'Steamed dumplings with a crisp golden finish.', price: 169, category: 'Starters', veg: true, popular: true, image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=700', addons: [['Spicy dip', 15], ['Extra 4 pcs', 65]] },
  { id: 401, restaurantId: 4, name: 'Classic Smash Burger', desc: 'Double smashed patty, cheddar, lettuce and house sauce.', price: 259, category: 'Burgers', veg: false, popular: true, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700', addons: [['Extra patty', 89], ['Bacon', 49], ['Cheese', 25]] },
  { id: 402, restaurantId: 4, name: 'Crispy Veg Burger', desc: 'Crunchy veggie patty with fresh lettuce and mayo.', price: 179, category: 'Burgers', veg: true, popular: false, image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=700', addons: [['Cheese', 25], ['Jalapeños', 19]] },
  { id: 501, restaurantId: 5, name: 'Paneer Butter Masala', desc: 'Soft paneer in a rich tomato and butter gravy.', price: 289, category: 'Mains', veg: true, popular: true, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=700', addons: [['Extra paneer', 59], ['Butter naan', 49]] },
  { id: 502, restaurantId: 5, name: 'Dal Makhani', desc: 'Slow-cooked black lentils finished with cream.', price: 229, category: 'Mains', veg: true, popular: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=700', addons: [['Extra cream', 19], ['Jeera rice', 69]] },
  { id: 601, restaurantId: 6, name: 'Salmon Avocado Roll', desc: 'Fresh salmon, avocado and seasoned sushi rice.', price: 399, category: 'Sushi rolls', veg: false, popular: true, image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=700', addons: [['Extra wasabi', 10], ['Miso soup', 49]] }
]
const categories = ['All', 'Healthy', 'Pizza', 'Asian', 'Burgers', 'Indian', 'Japanese']
const money = n => `₹${Math.round(n).toLocaleString('en-IN')}`
const load = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback } }

function App() {
  const [page, setPage] = useState('home')
  const [selectedRestaurant, setSelectedRestaurant] = useState(null)
  const [cart, setCart] = useState(() => load('crave-cart', []))
  const [orders, setOrders] = useState(() => load('crave-orders', []))
  const [saved, setSaved] = useState(() => load('crave-favourites', []))
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('Recommended')
  const [vegOnly, setVegOnly] = useState(false)
  const [customDish, setCustomDish] = useState(null)
  const [customQty, setCustomQty] = useState(1)
  const [chosenAddons, setChosenAddons] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [activeOrder, setActiveOrder] = useState(null)
  const [address, setAddress] = useState('Elizabeth, New Jersey')
  const [customer, setCustomer] = useState('')
  const [phone, setPhone] = useState('')
  const [toast, setToast] = useState('')

  useEffect(() => localStorage.setItem('crave-cart', JSON.stringify(cart)), [cart])
  useEffect(() => localStorage.setItem('crave-orders', JSON.stringify(orders)), [orders])
  useEffect(() => localStorage.setItem('crave-favourites', JSON.stringify(saved)), [saved])
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(''), 2400); return () => clearTimeout(t) }, [toast])

  const filteredRestaurants = useMemo(() => {
    let list = restaurants.filter(r => {
      const matchCategory = category === 'All' || r.cuisine.toLowerCase().includes(category.toLowerCase()) || r.name.toLowerCase().includes(category.toLowerCase())
      const matchSearch = !search || `${r.name} ${r.cuisine} ${dishes.filter(d => d.restaurantId === r.id).map(d => d.name).join(' ')}`.toLowerCase().includes(search.toLowerCase())
      const matchVeg = !vegOnly || dishes.some(d => d.restaurantId === r.id && d.veg)
      return matchCategory && matchSearch && matchVeg
    })
    if (sort === 'Top rated') list = [...list].sort((a, b) => b.rating - a.rating)
    if (sort === 'Fastest delivery') list = [...list].sort((a, b) => parseInt(a.time) - parseInt(b.time))
    if (sort === 'Lowest delivery fee') list = [...list].sort((a, b) => a.fee - b.fee)
    return list
  }, [category, search, sort, vegOnly])

  const cartCount = cart.reduce((s, i) => s + i.qty, 0)
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0)
  const delivery = subtotal === 0 ? 0 : subtotal >= 499 ? 0 : 29
  const tax = Math.round(subtotal * .05)
  const total = subtotal + delivery + tax
  const menuCategories = selectedRestaurant ? [...new Set(dishes.filter(d => d.restaurantId === selectedRestaurant.id).map(d => d.category))] : []
  const popularDishes = dishes.filter(d => d.popular)

  function openRestaurant(r) { setSelectedRestaurant(r); setPage('restaurant'); window.scrollTo(0, 0) }
  function openCustom(d) { setCustomDish(d); setCustomQty(1); setChosenAddons([]) }
  function addToCart(d, qty = 1, addons = []) {
    const addonPrice = addons.reduce((s, a) => s + a.price, 0)
    const key = `${d.id}-${addons.map(a => a.name).sort().join('|')}`
    setCart(old => { const found = old.find(i => i.key === key); if (found) return old.map(i => i.key === key ? { ...i, qty: i.qty + qty } : i); return [...old, { key, dishId: d.id, name: d.name, restaurantId: d.restaurantId, restaurantName: restaurants.find(r => r.id === d.restaurantId)?.name, price: d.price + addonPrice, basePrice: d.price, qty, addons: addons.map(a => a.name), image: d.image }] })
    setCustomDish(null); setToast(`${d.name} added to your bag`)
  }
  function changeQty(key, delta) { setCart(old => old.map(i => i.key === key ? { ...i, qty: i.qty + delta } : i).filter(i => i.qty > 0)) }
  function placeOrder(e) { e.preventDefault(); if (!cart.length) return; const order = { id: `FG${Date.now().toString().slice(-7)}`, items: cart, total, address, customer, phone, status: 0, createdAt: new Date().toLocaleString() }; setOrders(old => [order, ...old]); setActiveOrder(order); setCart([]); setCheckoutOpen(false); setCartOpen(false); setPage('tracking'); setToast('Your order has been placed!') }
  useEffect(() => { if (page !== 'tracking' || !activeOrder) return; const timer = setInterval(() => { setOrders(old => old.map(o => o.id === activeOrder.id ? { ...o, status: Math.min(3, (o.status || 0) + 1) } : o)); setActiveOrder(o => o ? { ...o, status: Math.min(3, (o.status || 0) + 1) } : o) }, 12000); return () => clearInterval(timer) }, [page, activeOrder?.id])
  function toggleSaved(id) { setSaved(old => old.includes(id) ? old.filter(x => x !== id) : [...old, id]) }

  return <div className="foodgo-app">
    <Sidebar page={page} setPage={setPage} onPromo={() => setToast('This demo section is ready to connect to your backend.')} />
    <div className="workspace">
      <header className="foodgo-header">
        <div className="mobile-brand"><span>🍊</span> FoodGo</div>
        <button className="delivery-location" onClick={() => setToast('Delivery location: ' + address)}><MapPin size={15} /><span>{address}</span><ChevronDown size={13} /></button>
        <button className="pickup-link" onClick={() => setToast('Pickup mode selected')}>♧ <span>Pick up</span> <ChevronDown size={12} /></button>
        <button className="deal-link" onClick={() => setToast('Showing today’s best deals')}>🎟 <span>Best deals</span> <ChevronDown size={12} /></button>
        <div className="foodgo-search"><Search size={15} /><input value={search} onChange={e => { setSearch(e.target.value); setPage('home') }} placeholder="Search for anything..." /></div>
        <button className="filter-round" onClick={() => setVegOnly(v => !v)} title="Toggle vegetarian filter"><SlidersHorizontal size={15} /></button>
        <button className="basket-round" onClick={() => setCartOpen(true)}><ShoppingBag size={16} />{cartCount > 0 && <i>{cartCount}</i>}</button>
      </header>
      <main className="dashboard-content">
        {page === 'home' && <>
          <div className="content-heading"><div><h1>Restaurants nearby</h1><p>Discover delicious food around you</p></div><select className="distance-select" defaultValue="10 km"><option>5 km</option><option>10 km</option><option>15 km</option><option>20 km</option></select></div>
          <div className="quick-filters">{categories.map((c, i) => <button key={c} className={category === c ? 'selected' : ''} onClick={() => setCategory(c)}>{['✦', '🥗', '🍕', '🍜', '🍔', '🍛', '🍣'][i]} {c}</button>)}<label className="veg-check"><input type="checkbox" checked={vegOnly} onChange={e => setVegOnly(e.target.checked)} /> Veg only</label><select value={sort} onChange={e => setSort(e.target.value)}><option>Recommended</option><option>Top rated</option><option>Fastest delivery</option><option>Lowest delivery fee</option></select></div>
          <div className="nearby-grid">{filteredRestaurants.map(r => <RestaurantCard key={r.id} restaurant={r} onClick={() => openRestaurant(r)} saved={saved.includes(r.id)} onSave={() => toggleSaved(r.id)} />)}</div>
          {filteredRestaurants.length === 0 && <div className="empty-inline">No restaurants found. Try another search or category.</div>}
          <div className="popular-heading"><div><h2>Popular orders</h2><p>Most-loved meals picked for you</p></div><select defaultValue="Today"><option>Today</option><option>This week</option></select></div>
          <div className="popular-grid">{popularDishes.slice(0, 6).map(d => <PopularDishCard key={d.id} dish={d} onClick={() => { const r = restaurants.find(x => x.id === d.restaurantId); setSelectedRestaurant(r); openCustom(d) }} />)}</div>
        </>}
        {page === 'restaurant' && selectedRestaurant && <div className="restaurant-page-new"><button className="back-link" onClick={() => setPage('home')}><ArrowLeft size={16} /> All restaurants</button><section className="restaurant-cover"><img src={selectedRestaurant.image} alt={selectedRestaurant.name} /><div className="cover-shade" /><div className="cover-info"><span className="offer-pill">{selectedRestaurant.offer}</span><h1>{selectedRestaurant.name}</h1><p>{selectedRestaurant.cuisine}</p><div className="cover-meta"><span><Star size={15} fill="currentColor" /> {selectedRestaurant.rating}</span><span><Clock3 size={15} /> {selectedRestaurant.time}</span><span><Bike size={16} /> {money(selectedRestaurant.fee)} delivery</span></div></div></section><div className="menu-intro"><div><span className="eyebrow">MADE FRESH, JUST FOR YOU</span><h2>Explore the menu</h2></div><span className="menu-note">Tap a dish to customise it <Sparkles size={15} /></span></div><div className="menu-tabs">{menuCategories.map(c => <a key={c} href={`#menu-${c.replaceAll(' ', '-')}`}>{c}</a>)}</div>{menuCategories.map(c => <section className="menu-group" id={`menu-${c.replaceAll(' ', '-')}`} key={c}><h3>{c}</h3><div className="dish-grid">{dishes.filter(d => d.restaurantId === selectedRestaurant.id && d.category === c && (!vegOnly || d.veg)).map(d => <DishCard key={d.id} dish={d} onAdd={() => openCustom(d)} />)}</div></section>)}<button className="sticky-cart-hint" onClick={() => setCartOpen(true)}><ShoppingBag size={18} />{cartCount} items in your bag <b>{money(subtotal)}</b><ArrowRight size={18} /></button></div>}
        {page === 'favourites' && <section className="secondary-page"><span className="eyebrow">YOUR SAVED PLACES</span><h1>Favourites</h1><p>Restaurants you’ve saved for your next meal.</p><div className="nearby-grid">{restaurants.filter(r => saved.includes(r.id)).map(r => <RestaurantCard key={r.id} restaurant={r} onClick={() => openRestaurant(r)} saved onSave={() => toggleSaved(r.id)} />)}</div>{saved.length === 0 && <div className="empty-inline">No favourites yet. Tap the heart on a restaurant to save it here.</div>}</section>}
        {page === 'orders' && <section className="secondary-page"><span className="eyebrow">YOUR FOODGO ACTIVITY</span><h1>My orders</h1><p>All your recent food moments, in one place.</p>{orders.length === 0 ? <div className="empty-inline">No orders yet. Your next favourite meal is waiting.</div> : <div className="order-list">{orders.map(o => <div className="order-card" key={o.id}><div className="order-card-top"><div><b>Order #{o.id}</b><small>{o.createdAt}</small></div><span className="status-pill">{o.status === 3 ? 'Delivered' : 'In progress'}</span></div><div className="order-items-preview">{o.items.map(i => `${i.qty} × ${i.name}`).join(' · ')}</div><div className="order-card-bottom"><b>{money(o.total)}</b><button className="text-btn" onClick={() => { setActiveOrder(o); setPage('tracking') }}>Track order <ArrowRight size={15} /></button></div></div>)}</div>}</section>}
        {page === 'tracking' && activeOrder && <section className="secondary-page"><button className="back-link" onClick={() => setPage('orders')}><ArrowLeft size={16} /> My orders</button><div className="tracking-card"><div className="success-icon"><Check size={28} /></div><span className="eyebrow">ORDER CONFIRMED</span><h1>Your food is on its way.</h1><p className="muted">Order #{activeOrder.id} · Placed {activeOrder.createdAt}</p><div className="eta-box"><div><small>ESTIMATED ARRIVAL</small><b>30–40 min</b></div><div className="eta-illustration">🛵</div></div><div className="tracking-steps">{[{ icon: Check, title: 'Order confirmed', desc: 'The restaurant received your order.' }, { icon: ChefHat, title: 'Being prepared', desc: 'The kitchen is preparing your food.' }, { icon: PackageCheck, title: 'Ready for pickup', desc: 'Your order is packed and ready.' }, { icon: Truck, title: 'On the way', desc: 'Your delivery partner is heading to you.' }].map((s, i) => <div className={`tracking-step ${i <= activeOrder.status ? 'done' : ''}`} key={s.title}><div className="step-icon"><s.icon size={18} /></div><div><b>{s.title}</b><small>{s.desc}</small></div><span className="step-check">{i <= activeOrder.status ? '✓' : ''}</span></div>)}</div><div className="tracking-foot"><span><MapPin size={16} />{activeOrder.address}</span><b>{money(activeOrder.total)}</b></div><p className="demo-note">Demo tracking advances automatically. No real courier is connected.</p></div></section>}
      </main>
      <footer className="foodgo-footer">© 2026 FoodGo · Good food, delivered with care</footer>
    </div>

    {cartOpen && <div className="overlay" onMouseDown={e => { if (e.target === e.currentTarget) setCartOpen(false) }}><aside className="drawer"><div className="drawer-head"><div><span className="eyebrow">YOUR SELECTION</span><h2>Your bag <span>({cartCount})</span></h2></div><button className="icon-btn" onClick={() => setCartOpen(false)}><X /></button></div>{cart.length === 0 ? <div className="empty-state"><ShoppingBag size={35} /><h3>Your bag is feeling light</h3><p>Add something delicious to get started.</p><button className="primary-btn" onClick={() => { setCartOpen(false); setPage('home') }}>Explore food</button></div> : <><div className="cart-items">{cart.map(i => <div className="cart-item" key={i.key}><img src={i.image} alt="" /><div className="cart-item-info"><b>{i.name}</b><small>{i.restaurantName}</small>{i.addons.length > 0 && <small className="addon-text">+ {i.addons.join(', ')}</small>}<strong>{money(i.price)}</strong></div><div className="qty-control"><button onClick={() => changeQty(i.key, -1)}><Minus size={13} /></button><b>{i.qty}</b><button onClick={() => changeQty(i.key, 1)}><Plus size={13} /></button></div></div>)}</div><div className="cart-summary"><div><span>Subtotal</span><b>{money(subtotal)}</b></div><div><span>Delivery fee</span><b>{delivery === 0 ? 'FREE' : money(delivery)}</b></div><div><span>Taxes & charges</span><b>{money(tax)}</b></div><div className="summary-total"><span>Total</span><b>{money(total)}</b></div><button className="primary-btn checkout-btn" onClick={() => { setCartOpen(false); setCheckoutOpen(true) }}>Continue to checkout <ArrowRight size={17} /></button><small className="secure-note">Free delivery on orders above ₹499</small></div></>}</aside></div>}
    {customDish && <div className="overlay modal-overlay" onMouseDown={e => { if (e.target === e.currentTarget) setCustomDish(null) }}><div className="custom-modal"><button className="modal-close icon-btn" onClick={() => setCustomDish(null)}><X /></button><img className="custom-image" src={customDish.image} alt={customDish.name} /><div className="custom-content"><span className="eyebrow">MAKE IT YOURS</span><h2>{customDish.name}</h2><p>{customDish.desc}</p><div className="custom-price">{money(customDish.price)}</div>{customDish.addons.length > 0 && <div className="addon-section"><h4>Add something extra <small>OPTIONAL</small></h4>{customDish.addons.map(([name, price]) => <label className="addon-option" key={name}><span><b>{name}</b><small>{price ? `+ ${money(price)}` : 'No extra charge'}</small></span><input type="checkbox" checked={chosenAddons.some(a => a.name === name)} onChange={e => setChosenAddons(old => e.target.checked ? [...old, { name, price }] : old.filter(a => a.name !== name))} /></label>)}</div>}<div className="custom-footer"><div className="qty-control large"><button onClick={() => setCustomQty(q => Math.max(1, q - 1))}><Minus size={15} /></button><b>{customQty}</b><button onClick={() => setCustomQty(q => q + 1)}><Plus size={15} /></button></div><button className="primary-btn" onClick={() => addToCart(customDish, customQty, chosenAddons)}>Add to bag · {money((customDish.price + chosenAddons.reduce((s, a) => s + a.price, 0)) * customQty)}</button></div></div></div></div>}
    {checkoutOpen && <div className="overlay modal-overlay"><form className="checkout-modal" onSubmit={placeOrder}><div className="drawer-head"><div><span className="eyebrow">ALMOST THERE</span><h2>Checkout</h2></div><button type="button" className="icon-btn" onClick={() => setCheckoutOpen(false)}><X /></button></div><label>Your name<input required value={customer} onChange={e => setCustomer(e.target.value)} placeholder="Enter your name" /></label><label>Mobile number<input required pattern="[0-9]{10}" value={phone} onChange={e => setPhone(e.target.value)} placeholder="10-digit mobile number" /></label><label>Delivery address<textarea required value={address} onChange={e => setAddress(e.target.value)} rows="2" /></label><div className="payment-note"><span>PAYMENT METHOD</span><b>Cash on delivery</b><small>Demo checkout · No payment will be collected</small></div><div className="checkout-total"><span>Amount to pay</span><b>{money(total)}</b></div><button className="primary-btn checkout-btn" type="submit">Place demo order <ArrowRight size={17} /></button></form></div>}
    {toast && <div className="toast"><Check size={17} />{toast}</div>}
  </div>
}

function DishCard({ dish, onAdd }) { return <div className="dish-card"><div className="dish-copy"><div className={`food-mark ${dish.veg ? 'veg' : 'nonveg'}`}><span /></div>{dish.popular && <span className="popular-label">Bestseller</span>}<h4>{dish.name}</h4><b className="dish-price">{money(dish.price)}</b><p>{dish.desc}</p><button className="add-btn" onClick={onAdd}>Add <Plus size={14} /></button></div><div className="dish-image"><img src={dish.image} alt={dish.name} /></div></div> }

export default App
