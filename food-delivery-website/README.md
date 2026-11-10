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

## 2. Open the project

1. Download and extract the ZIP file.
2. Open the extracted `food-delivery-website` folder in VS Code.
3. Open the VS Code terminal using **Terminal → New Terminal**.
4. Make sure the terminal is inside the folder containing `package.json`.

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

## 6. Understand the app step by step

### Step 1 — Build the layout

`App.jsx` renders the main FoodGo shell. The shell has the sidebar, top header, content area and footer. The sidebar is a separate component so its navigation can be reused and maintained independently.

### Step 2 — Display restaurants

The `restaurants` array in `App.jsx` contains the demo restaurant information: name, cuisine, rating, delivery time, delivery fee, offer and image. `RestaurantCard.jsx` receives one restaurant through props and displays it.

### Step 3 — Search and filter

The search input updates the `search` state. Cuisine buttons update `category`. The vegetarian checkbox updates `vegOnly`, and the sort dropdown updates `sort`. `useMemo` calculates the restaurants that match those settings.

### Step 4 — Save favourites

The heart button calls `toggleSaved()`. Favourite restaurant IDs are saved in localStorage, so they remain after refreshing the page in the same browser.

### Step 5 — Open a restaurant menu

Selecting a restaurant changes the current page to `restaurant`. The menu is built from the `dishes` array by matching each dish's `restaurantId` and category.

### Step 6 — Customise a dish

Selecting a dish opens a modal. The customer can choose add-ons and quantity. The final dish price includes the selected add-ons.

### Step 7 — Add items to the cart

`addToCart()` adds the selected dish to the cart. `changeQty()` increases or decreases quantities. Cart data is stored in localStorage.

### Step 8 — Calculate the bill

The app calculates subtotal, delivery fee, tax and final total from the cart. The demo gives free delivery when the subtotal is at least ₹499.

### Step 9 — Checkout and tracking

The checkout form collects a name, mobile number and delivery address. Submitting creates a demo order, clears the cart and opens the tracking screen. The tracking stage advances automatically every 12 seconds to demonstrate the flow.

## 7. Test the main features

- [ ] Search for `pizza` and check the restaurant results.
- [ ] Select the Pizza category.
- [ ] Turn on Veg only.
- [ ] Change sorting to Top rated.
- [ ] Save a restaurant with the heart icon and open Favourites.
- [ ] Open a restaurant and select a dish.
- [ ] Choose an add-on and change the quantity.
- [ ] Add the dish to the cart and change its quantity.
- [ ] Open checkout and submit valid demo details.
- [ ] Open Orders and view the order tracking screen.
- [ ] Refresh the browser and check that cart/favourites/orders persist.

## 8. Useful commands

```bash
npm run dev       # Start local development server
npm run build     # Create production files in dist/
npm run preview   # Preview the production build
```

## 9. Common problems

**`npm` or `node` is not recognised**

Install Node.js LTS, close and reopen VS Code, then check `node -v` and `npm -v` again.

**`vite` is not recognised**

Run `npm install` in the project folder. Confirm that the terminal is in the folder containing `package.json`.

**Port 5173 is already in use**

Vite will normally offer another available port. Open the URL shown in the terminal.

**Images are not loading**

The demo uses remote Unsplash image URLs, so an internet connection is required for those images.

## 10. Suggested next steps for a real project

1. Create a backend using Node.js and Express.
2. Store users, restaurants, menus, carts and orders in MongoDB.
3. Add login and role-based access for customers and administrators.
4. Replace sample data with API requests using Axios.
5. Integrate a real payment provider in a secure backend flow.
6. Add maps, delivery partner assignment, and live order updates.
7. Deploy the frontend and backend.

Build and understand one feature at a time. Start by changing a restaurant name or dish in the sample arrays, save the file, and watch Vite refresh the browser.
