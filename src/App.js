import { useState } from 'react';
import './App.css';

const RESTAURANTS = [
  { id: 1, name: 'Pizza Palace', category: 'pizza', rating: 4.5, deliveryTime: '30-40 min', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400' },
  { id: 2, name: 'Burger House', category: 'burgers', rating: 4.3, deliveryTime: '25-35 min', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400' },
  { id: 3, name: 'Sushi Bar', category: 'sushi', rating: 4.7, deliveryTime: '40-50 min', image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400' },
  { id: 4, name: 'Taco Fiesta', category: 'mexican', rating: 4.4, deliveryTime: '30-40 min', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400' },
  { id: 5, name: 'Pasta Corner', category: 'italian', rating: 4.6, deliveryTime: '35-45 min', image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400' },
  { id: 6, name: 'Healthy Bowl', category: 'healthy', rating: 4.8, deliveryTime: '20-30 min', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400' },
];

const MENU_ITEMS = {
  1: [
    { id: 101, name: 'Margherita Pizza', price: 299, description: 'Classic tomato and mozzarella' },
    { id: 102, name: 'Pepperoni Pizza', price: 399, description: 'Loaded with pepperoni' },
    { id: 103, name: 'Veggie Supreme', price: 349, description: 'Fresh vegetables' },
  ],
  2: [
    { id: 201, name: 'Classic Burger', price: 199, description: 'Beef patty with cheese' },
    { id: 202, name: 'Chicken Burger', price: 229, description: 'Grilled chicken breast' },
    { id: 203, name: 'Veggie Burger', price: 179, description: 'Plant-based patty' },
  ],
};

function App() {
  const [view, setView] = useState('home');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [menuOpen, setMenuOpen] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const categories = ['all', 'pizza', 'burgers', 'sushi', 'mexican', 'italian', 'healthy'];

  const filteredRestaurants = RESTAURANTS.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || restaurant.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (item) => {
    const existing = cart.find(cartItem => cartItem.id === item.id);
    if (existing) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1, restaurantId: selectedRestaurant.id }]);
    }
  };

  const updateQuantity = (id, delta) => {
    setCart(cart.map(item =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handlePlaceOrder = () => {
    const orderNum = 'FD' + Math.random().toString(36).substr(2, 9).toUpperCase();
    setOrderNumber(orderNum);
    setView('tracking');
    setCart([]);
  };

  return (
    <div className="App">
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-left">
          <div className="logo" onClick={() => { setView('home'); setSelectedRestaurant(null); }}>FoodDelivery</div>
          <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className={`dropdown-menu ${menuOpen ? 'open' : ''}`}>
            <button onClick={() => { setView('home'); setMenuOpen(false); setSelectedRestaurant(null); }}>Home</button>
            <button onClick={() => { setView('restaurants'); setMenuOpen(false); setSelectedRestaurant(null); }}>Restaurants</button>
            <button onClick={() => { setView('tracking'); setMenuOpen(false); }}>Track Order</button>
          </div>
        </div>
        <div className="cart-icon" onClick={() => setView('cart')}>
          🛒
          {cartCount > 0 && <div className="cart-badge">{cartCount}</div>}
        </div>
      </nav>

      {/* Main Content */}
      <div className="container">
        {view === 'home' && (
          <>
            <div className="hero">
              <h1 className="hero-title">Delicious Food, Delivered Fast</h1>
              <p className="hero-subtitle">Order from your favorite restaurants</p>
              <button className="cta-btn" onClick={() => setView('restaurants')}>
                Browse Restaurants
              </button>
            </div>

            <div className="categories-section">
              <h2>Popular Categories</h2>
              <div className="category-grid">
                {categories.filter(c => c !== 'all').map(cat => (
                  <div
                    key={cat}
                    className="category-card"
                    onClick={() => {
                      setActiveCategory(cat);
                      setView('restaurants');
                    }}
                  >
                    <div className="category-name">{cat.charAt(0).toUpperCase() + cat.slice(1)}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {view === 'restaurants' && !selectedRestaurant && (
          <div className="restaurants-screen">
            <h2>Restaurants</h2>

            <div className="search-bar">
              <input
                type="text"
                className="search-input"
                placeholder="Search restaurants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-pills">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`pill-btn ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>

            <div className="restaurant-grid">
              {filteredRestaurants.map(restaurant => (
                <div
                  key={restaurant.id}
                  className="restaurant-card"
                  onClick={() => setSelectedRestaurant(restaurant)}
                >
                  <img src={restaurant.image} alt={restaurant.name} className="restaurant-image" />
                  <div className="restaurant-info">
                    <h3>{restaurant.name}</h3>
                    <div className="restaurant-meta">
                      <span>⭐ {restaurant.rating}</span>
                      <span>🕐 {restaurant.deliveryTime}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedRestaurant && (
          <div className="menu-screen">
            <button className="back-btn" onClick={() => setSelectedRestaurant(null)}>← Back</button>
            <h2>{selectedRestaurant.name}</h2>
            <p className="restaurant-details">⭐ {selectedRestaurant.rating} • 🕐 {selectedRestaurant.deliveryTime}</p>

            <div className="menu-grid">
              {(MENU_ITEMS[selectedRestaurant.id] || []).map(item => (
                <div key={item.id} className="menu-item">
                  <div className="menu-item-info">
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <div className="menu-item-price">₹{item.price}</div>
                  </div>
                  <button className="add-btn" onClick={() => addToCart(item)}>Add</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'cart' && (
          <div className="cart-screen">
            <h2>Your Cart</h2>

            {cart.length === 0 ? (
              <div className="empty-cart">
                <div className="empty-icon">🛒</div>
                <p>Your cart is empty</p>
                <button className="cta-btn" onClick={() => setView('restaurants')}>Browse Restaurants</button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map(item => (
                    <div key={item.id} className="cart-item">
                      <div className="cart-item-info">
                        <h3>{item.name}</h3>
                        <div className="cart-item-price">₹{item.price}</div>
                      </div>
                      <div className="quantity-controls">
                        <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                      </div>
                      <button className="remove-btn" onClick={() => removeFromCart(item.id)}>×</button>
                    </div>
                  ))}
                </div>

                <div className="cart-total">
                  <h3>Total: ₹{cartTotal}</h3>
                  <button className="checkout-btn" onClick={handlePlaceOrder}>Place Order</button>
                </div>
              </>
            )}
          </div>
        )}

        {view === 'tracking' && (
          <div className="tracking-screen">
            <div className="tracking-icon">✓</div>
            <h2>Order Placed!</h2>
            <p className="order-id">Order #{orderNumber}</p>

            <div className="tracking-timeline">
              <div className="track-item completed">
                <div className="track-dot"></div>
                <div className="track-text">
                  <div className="track-title">Order Confirmed</div>
                  <div className="track-time">Just now</div>
                </div>
              </div>
              <div className="track-item active">
                <div className="track-dot"></div>
                <div className="track-text">
                  <div className="track-title">Preparing</div>
                  <div className="track-time">15-20 min</div>
                </div>
              </div>
              <div className="track-item">
                <div className="track-dot"></div>
                <div className="track-text">
                  <div className="track-title">Out for Delivery</div>
                  <div className="track-time">Pending</div>
                </div>
              </div>
              <div className="track-item">
                <div className="track-dot"></div>
                <div className="track-text">
                  <div className="track-title">Delivered</div>
                  <div className="track-time">30-40 min</div>
                </div>
              </div>
            </div>

            <button className="cta-btn" onClick={() => setView('home')}>Back to Home</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
