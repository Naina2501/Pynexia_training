# FoodGo — Food Delivery Website

A beginner-friendly React + Vite food delivery frontend. The dashboard layout is inspired by the reference screenshot: a fixed left sidebar, compact top navigation, nearby restaurant list, and popular food cards.

> This is a frontend demo. Restaurant data is sample data, checkout is simulated, and no real payment, restaurant API, authentication, or courier service is connected.

## Features

- FoodGo dashboard with responsive left sidebar and top search bar
- Restaurant discovery with cuisine filters, search, vegetarian filter, sorting, ratings and delivery estimates
- Restaurant menu pages with food photos and add-on customisation
- Popular dishes section with quick add/customise action
- Save restaurants to Favourites (stored in browser localStorage)
- Shopping cart with quantity controls, subtotal, delivery fee, tax and total
- Demo checkout form and order confirmation
- Order history and simulated order tracking
- Cart, favourites and order history persist in localStorage
- Responsive layout for desktop, tablet and mobile

## 1. Requirements

Install these before starting:

- Node.js LTS (includes npm)
- Visual Studio Code (recommended)
- A modern browser such as Chrome or Edge

Check your installation in a terminal:

```bash
node -v
npm -v
```



## 3. Install dependencies

```bash
npm install
```

This installs React, React DOM, Vite and Lucide React icons.

## 4. Start the website

```bash
npm run dev
```

Open the local URL printed in the terminal. Vite commonly uses `http://localhost:5173`.

To stop the server, press `Ctrl + C` in the terminal.

## 5. Project structure

```text
food-delivery-website/
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── styles.css
    └── components/
        ├── Sidebar.jsx
        ├── RestaurantCard.jsx
        └── PopularDishCard.jsx
```

### What each file does

- `main.jsx` — starts React and loads the main application and stylesheet.
- `App.jsx` — contains sample restaurant and dish data, page state, search/filter logic, favourites, cart, checkout, order history and tracking.
- `styles.css` — controls the dashboard appearance, responsive layout, cards, menus, cart drawer and modals.
- `components/Sidebar.jsx` — reusable left navigation and profile/promo area.
- `components/RestaurantCard.jsx` — one nearby restaurant card, including the favourite button.
- `components/PopularDishCard.jsx` — one popular food card with a quick customise action.
