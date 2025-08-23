import React, { useState, useEffect } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { config } from './config';
import './App.css';

function getAuthHeaders() {
  const token = localStorage.getItem('jwtToken');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

function App() {
  const [search, setSearch] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [noResults, setNoResults] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [cartMessage, setCartMessage] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartError, setCartError] = useState('');
  const [checkoutMessage, setCheckoutMessage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [popularBooks, setPopularBooks] = useState([]);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerData, setRegisterData] = useState({ email: '', password: '', name: '', phone: '', address: '' });
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('jwtToken'));

  // Email validation function
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Google authentication handler
  const handleGoogleSuccess = async (credentialResponse) => {
    setAuthError('');
    setAuthSuccess('');
    console.log('Client ID being used:', config.GOOGLE_CLIENT_ID);
    console.log('Credential response:', credentialResponse);
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: credentialResponse.credential })
      });
      
      if (!res.ok) throw new Error('Google authentication failed');
      
      const data = await res.json();
      localStorage.setItem('jwtToken', data.token);
      setIsLoggedIn(true);
      setAuthSuccess('Google login successful!');
    } catch (err) {
      setAuthError(err.message);
    }
  };

  const handleGoogleError = () => {
    console.log('Google Authentication error');
    console.log('Client ID being used:', config.GOOGLE_CLIENT_ID);
    setAuthError('Google authentication failed. Please try again.');
  };

  const fetchBooks = async (query, isSimilar = false) => {
    setLoading(true);
    setError('');
    setNoResults(false);
    try {
      const endpoint = isSimilar
        ? `/api/books/similar?search=${encodeURIComponent(query)}`
        : `/api/books?search=${encodeURIComponent(query)}`;
      const res = await fetch(endpoint, { headers: getAuthHeaders() });
      if (res.status === 401 || res.status === 403) {
        handleLogout();
        setAuthError('Session expired. Please log in again.');
        return;
      }
      if (!res.ok) throw new Error('Failed to fetch books');
      const data = await res.json();
      if (data.length === 0 && !isSimilar) {
        // Try similar books if no exact matches
        fetchBooks(query, true);
      } else if (data.length === 0 && isSimilar) {
        setNoResults(true);
        setBooks([]);
      } else {
        setBooks(data);
      }
    } catch (err) {
      setError(err.message);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim() !== '') {
      fetchBooks(search.trim());
    }
  };

  // LOGIN/REGISTER HANDLERS
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    
    // Email validation for login
    if (!isValidEmail(loginEmail)) {
      setAuthError('Please enter a valid email address');
      return;
    }
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      if (!res.ok) throw new Error('Invalid credentials');
      const data = await res.json();
      localStorage.setItem('jwtToken', data.token);
      setIsLoggedIn(true);
      setShowLogin(false);
      setLoginEmail('');
      setLoginPassword('');
      setAuthSuccess('Login successful!');
    } catch (err) {
      setAuthError(err.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    
    // Email validation for registration
    if (!isValidEmail(registerData.email)) {
      setAuthError('Please enter a valid email address');
      return;
    }
    
    // Additional validation for registration fields
    if (!registerData.name.trim()) {
      setAuthError('Name is required');
      return;
    }
    
    if (!registerData.password || registerData.password.length < 6) {
      setAuthError('Password must be at least 6 characters long');
      return;
    }
    
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData)
      });
      if (!res.ok) throw new Error('Registration failed');
      setAuthSuccess('Registration successful! You can now log in.');
      setShowRegister(false);
      setRegisterData({ email: '', password: '', name: '', phone: '', address: '' });
    } catch (err) {
      setAuthError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    setIsLoggedIn(false);
    setAuthSuccess('Logged out successfully.');
  };

  // --- PROTECTED API CALLS ---
  const handleAddToCart = async (bookId) => {
    if (!isLoggedIn) {
      setAuthError('Please log in to add items to cart');
      setShowLogin(true);
      return;
    }
    
    setCartMessage('');
    try {
      const res = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ bookId, quantity })
      });
      if (res.status === 401 || res.status === 403) {
        handleLogout();
        setAuthError('Session expired. Please log in again.');
        return;
      }
      if (!res.ok) throw new Error('Failed to add to cart');
      setCartMessage('Book added to cart!');
    } catch (err) {
      setCartMessage('Error: ' + err.message);
    }
  };

  const handleBuyNow = async (bookId) => {
    if (!isLoggedIn) {
      setAuthError('Please log in to purchase books');
      setShowLogin(true);
      return;
    }
    
    try {
      // First add to cart
      const addRes = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ bookId, quantity: 1 })
      });
      
      if (addRes.status === 401 || addRes.status === 403) {
        handleLogout();
        setAuthError('Session expired. Please log in again.');
        return;
      }
      
      if (!addRes.ok) throw new Error('Failed to add to cart');
      
      // Then checkout
      const checkoutRes = await fetch('/api/orders/checkout', { 
        method: 'POST', 
        headers: getAuthHeaders() 
      });
      
      if (checkoutRes.status === 401 || checkoutRes.status === 403) {
        handleLogout();
        setAuthError('Session expired. Please log in again.');
        return;
      }
      
      if (!checkoutRes.ok) throw new Error('Checkout failed');
      
      setAuthSuccess('Purchase successful! Thank you for your order.');
    } catch (err) {
      setAuthError('Error: ' + err.message);
    }
  };

  const fetchCart = async () => {
    setCartLoading(true);
    setCartError('');
    try {
      const res = await fetch('/api/cart', { headers: getAuthHeaders() });
      if (res.status === 401 || res.status === 403) {
        handleLogout();
        setAuthError('Session expired. Please log in again.');
        return;
      }
      if (!res.ok) throw new Error('Failed to fetch cart');
      const data = await res.json();
      setCartItems(data);
    } catch (err) {
      setCartError(err.message);
      setCartItems([]);
    } finally {
      setCartLoading(false);
    }
  };

  const handleOpenCart = () => {
    if (!isLoggedIn) {
      setAuthError('Please log in to view your cart');
      setShowLogin(true);
      return;
    }
    setCartOpen(true);
    fetchCart();
  };

  const handleCloseCart = () => {
    setCartOpen(false);
    setCartItems([]);
    setCartError('');
  };

  const handleCheckout = async () => {
    setCheckoutMessage('');
    try {
      const res = await fetch('/api/orders/checkout', { method: 'POST', headers: getAuthHeaders() });
      if (res.status === 401 || res.status === 403) {
        handleLogout();
        setAuthError('Session expired. Please log in again.');
        return;
      }
      if (!res.ok) throw new Error('Checkout failed');
      setCheckoutMessage('Checkout successful! Thank you for your purchase.');
      setCartItems([]);
    } catch (err) {
      setCheckoutMessage('Error: ' + err.message);
    }
  };

  useEffect(() => {
    // Initial load: fetch all books
    fetchBooks('');
    fetch('http://localhost:8080/api/popular-books')
      .then((res) => res.json())
      .then((data) => setPopularBooks(data))
      .catch((err) => console.error('Failed to fetch popular books:', err));
    // eslint-disable-next-line
  }, []);

  return (
    <GoogleOAuthProvider clientId={config.GOOGLE_CLIENT_ID}>
      <div className="App">
      <div style={{ position: 'absolute', top: 24, right: 32, display: 'flex', gap: 12, zIndex: 1200 }}>
        {!isLoggedIn && <>
          <button onClick={() => { setShowLogin(true); setShowRegister(false); setAuthError(''); setAuthSuccess(''); }} style={{ padding: '8px 18px', background: '#007bff', color: '#fff', border: 'none', borderRadius: 4, fontSize: 16, cursor: 'pointer' }}>Login</button>
          <button onClick={() => { setShowRegister(true); setShowLogin(false); setAuthError(''); setAuthSuccess(''); }} style={{ padding: '8px 18px', background: '#28a745', color: '#fff', border: 'none', borderRadius: 4, fontSize: 16, cursor: 'pointer' }}>Register</button>
        </>}
        {isLoggedIn && <button onClick={handleLogout} style={{ padding: '8px 18px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: 4, fontSize: 16, cursor: 'pointer' }}>Logout</button>}
        <button onClick={handleOpenCart} style={{ padding: '8px 18px', background: '#ff9800', color: '#fff', border: 'none', borderRadius: 4, fontSize: 16, cursor: 'pointer' }}>View Cart</button>
      </div>
      {authError && <p style={{ color: 'red', marginTop: 60, textAlign: 'center' }}>{authError}</p>}
      {authSuccess && <p style={{ color: 'green', marginTop: 60, textAlign: 'center' }}>{authSuccess}</p>}
      {showLogin && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000 }} onClick={() => setShowLogin(false)}>
          <form onClick={e => e.stopPropagation()} onSubmit={handleLogin} style={{ background: '#fff', padding: 40, borderRadius: 16, minWidth: 340, maxWidth: 400, boxShadow: '0 8px 32px rgba(0,0,0,0.18)', position: 'relative', display: 'flex', flexDirection: 'column', gap: 18 }}>
            <button type="button" onClick={() => setShowLogin(false)} style={{ position: 'absolute', top: 14, right: 14, background: 'transparent', border: 'none', fontSize: 26, cursor: 'pointer', color: '#888' }}>&times;</button>
            <h2 style={{ textAlign: 'center', marginBottom: 8, color: '#007bff' }}>Login</h2>
            <div style={{ marginBottom: 0 }}>
              <label style={{ fontWeight: 500 }}>Email</label>
              <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required style={{ width: '100%', padding: 10, marginTop: 6, borderRadius: 6, border: '1px solid #bbb', fontSize: 16 }} />
            </div>
            <div style={{ marginBottom: 0 }}>
              <label style={{ fontWeight: 500 }}>Password</label>
              <input type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required style={{ width: '100%', padding: 10, marginTop: 6, borderRadius: 6, border: '1px solid #bbb', fontSize: 16 }} />
            </div>
            <button type="submit" style={{ padding: '10px 0', background: '#007bff', color: '#fff', border: 'none', borderRadius: 6, fontSize: 18, cursor: 'pointer', marginTop: 10, fontWeight: 600 }}>Login</button>
            
            <div style={{ textAlign: 'center', marginTop: 15, marginBottom: 15 }}>
              <span style={{ color: '#666' }}>OR</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 15 }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="outline"
                size="large"
                text="continue_with"
                shape="rectangular"
              />
            </div>
            
            <div style={{ textAlign: 'center', marginTop: 10 }}>
              <span style={{ color: '#666' }}>Don't have an account? </span>
              <button type="button" onClick={() => { setShowRegister(true); setShowLogin(false); setAuthError(''); setAuthSuccess(''); }} style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}>Register here</button>
            </div>
          </form>
        </div>
      )}
      {showRegister && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000 }} onClick={() => setShowRegister(false)}>
          <form onClick={e => e.stopPropagation()} onSubmit={handleRegister} style={{ background: '#fff', padding: 40, borderRadius: 16, minWidth: 340, maxWidth: 400, boxShadow: '0 8px 32px rgba(0,0,0,0.18)', position: 'relative', display: 'flex', flexDirection: 'column', gap: 18 }}>
            <button type="button" onClick={() => setShowRegister(false)} style={{ position: 'absolute', top: 14, right: 14, background: 'transparent', border: 'none', fontSize: 26, cursor: 'pointer', color: '#888' }}>&times;</button>
            <h2 style={{ textAlign: 'center', marginBottom: 8, color: '#28a745' }}>Register</h2>
            <div style={{ marginBottom: 0 }}>
              <label style={{ fontWeight: 500 }}>Email</label>
              <input type="email" value={registerData.email} onChange={e => setRegisterData({ ...registerData, email: e.target.value })} required style={{ width: '100%', padding: 10, marginTop: 6, borderRadius: 6, border: '1px solid #bbb', fontSize: 16 }} />
            </div>
            <div style={{ marginBottom: 0 }}>
              <label style={{ fontWeight: 500 }}>Password</label>
              <input type="password" value={registerData.password} onChange={e => setRegisterData({ ...registerData, password: e.target.value })} required style={{ width: '100%', padding: 10, marginTop: 6, borderRadius: 6, border: '1px solid #bbb', fontSize: 16 }} />
            </div>
            <div style={{ marginBottom: 0 }}>
              <label style={{ fontWeight: 500 }}>Name</label>
              <input type="text" value={registerData.name} onChange={e => setRegisterData({ ...registerData, name: e.target.value })} required style={{ width: '100%', padding: 10, marginTop: 6, borderRadius: 6, border: '1px solid #bbb', fontSize: 16 }} />
            </div>
            <div style={{ marginBottom: 0 }}>
              <label style={{ fontWeight: 500 }}>Phone</label>
              <input type="text" value={registerData.phone} onChange={e => setRegisterData({ ...registerData, phone: e.target.value })} required style={{ width: '100%', padding: 10, marginTop: 6, borderRadius: 6, border: '1px solid #bbb', fontSize: 16 }} />
            </div>
            <div style={{ marginBottom: 0 }}>
              <label style={{ fontWeight: 500 }}>Address</label>
              <input type="text" value={registerData.address} onChange={e => setRegisterData({ ...registerData, address: e.target.value })} required style={{ width: '100%', padding: 10, marginTop: 6, borderRadius: 6, border: '1px solid #bbb', fontSize: 16 }} />
            </div>
            <button type="submit" style={{ padding: '10px 0', background: '#28a745', color: '#fff', border: 'none', borderRadius: 6, fontSize: 18, cursor: 'pointer', marginTop: 10, fontWeight: 600 }}>Register</button>
            
            <div style={{ textAlign: 'center', marginTop: 15, marginBottom: 15 }}>
              <span style={{ color: '#666' }}>OR</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 15 }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="outline"
                size="large"
                text="continue_with"
                shape="rectangular"
              />
            </div>
            
            <div style={{ textAlign: 'center', marginTop: 10 }}>
              <span style={{ color: '#666' }}>Already have an account? </span>
              <button type="button" onClick={() => { setShowLogin(true); setShowRegister(false); setAuthError(''); setAuthSuccess(''); }} style={{ background: 'none', border: 'none', color: '#28a745', cursor: 'pointer', textDecoration: 'underline' }}>Login here</button>
            </div>
          </form>
        </div>
      )}
      <h1>Popular Books</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {popularBooks.length === 0 ? (
          <p>No popular books found.</p>
        ) : (
          popularBooks.map((pb) => (
            <div key={pb.id} style={{ border: '1px solid #ccc', padding: '1rem', width: '200px' }}>
              <h3>{pb.book.title}</h3>
              <p>Author: {pb.book.author}</p>
              <p>Price: ${pb.book.price}</p>
              {pb.book.imageUrl && <img src={pb.book.imageUrl} alt={pb.book.title} style={{ width: '100%' }} />}
              <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                <button onClick={() => handleAddToCart(pb.book.id)} style={{ padding: '6px 12px', background: '#007bff', color: '#fff', border: 'none', borderRadius: 4, fontSize: 14, cursor: 'pointer' }}>Add to Cart</button>
                <button onClick={() => handleBuyNow(pb.book.id)} style={{ padding: '6px 12px', background: '#28a745', color: '#fff', border: 'none', borderRadius: 4, fontSize: 14, cursor: 'pointer' }}>Buy Now</button>
              </div>
            </div>
          ))
        )}
      </div>
      <form onSubmit={handleSearch} style={{ marginBottom: 20 }}>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search for books..."
          style={{ padding: 8, width: 300 }}
        />
        <button type="submit" style={{ padding: 8, marginLeft: 8 }}>Search</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {noResults && <p>No books found. Try a different search.</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'center' }}>
        {books.map(book => (
          <div key={book.id} className="book-card" style={{ cursor: 'default' }}>
            <h3>{book.title}</h3>
            <p><strong>Author:</strong> {book.author}</p>
            <p><strong>Price:</strong> ${book.price}</p>
            <p>{book.description}</p>
            <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
              <button onClick={() => handleAddToCart(book.id)} style={{ padding: '6px 12px', background: '#007bff', color: '#fff', border: 'none', borderRadius: 4, fontSize: 14, cursor: 'pointer' }}>Add to Cart</button>
              <button onClick={() => handleBuyNow(book.id)} style={{ padding: '6px 12px', background: '#28a745', color: '#fff', border: 'none', borderRadius: 4, fontSize: 14, cursor: 'pointer' }}>Buy Now</button>
            </div>
          </div>
        ))}
      </div>
      {selectedBook && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}
          onClick={() => { setSelectedBook(null); setCartMessage(''); setQuantity(1); }}
        >
          <div style={{ background: '#fff', padding: 32, borderRadius: 10, minWidth: 320, maxWidth: 400, boxShadow: '0 4px 24px rgba(0,0,0,0.15)', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => { setSelectedBook(null); setCartMessage(''); setQuantity(1); }} style={{ position: 'absolute', top: 10, right: 10, background: 'transparent', border: 'none', fontSize: 22, cursor: 'pointer' }}>&times;</button>
            <h2>{selectedBook.title}</h2>
            <p><strong>Author:</strong> {selectedBook.author}</p>
            <p><strong>Price:</strong> ${selectedBook.price}</p>
            <p>{selectedBook.description}</p>
            <div style={{ margin: '12px 0' }}>
              <label htmlFor="quantity">Quantity: </label>
              <input id="quantity" type="number" min="1" value={quantity} onChange={e => setQuantity(Math.max(1, Number(e.target.value)))} style={{ width: 60, padding: 4, fontSize: 16 }} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={{ padding: '8px 18px', background: '#007bff', color: '#fff', border: 'none', borderRadius: 4, fontSize: 16, cursor: 'pointer' }} onClick={() => handleAddToCart(selectedBook.id)}>Add to Cart</button>
              <button style={{ padding: '8px 18px', background: '#28a745', color: '#fff', border: 'none', borderRadius: 4, fontSize: 16, cursor: 'pointer' }} onClick={() => handleBuyNow(selectedBook.id)}>Buy Now</button>
            </div>
            {cartMessage && <p style={{ marginTop: 10, color: cartMessage.startsWith('Error') ? 'red' : 'green' }}>{cartMessage}</p>}
          </div>
        </div>
      )}
      {cartOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
        }}
          onClick={handleCloseCart}
        >
          <div style={{ background: '#fff', padding: 32, borderRadius: 10, minWidth: 340, maxWidth: 500, boxShadow: '0 4px 24px rgba(0,0,0,0.15)', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button onClick={handleCloseCart} style={{ position: 'absolute', top: 10, right: 10, background: 'transparent', border: 'none', fontSize: 22, cursor: 'pointer' }}>&times;</button>
            <h2>Your Cart</h2>
            {cartLoading && <p>Loading...</p>}
            {cartError && <p style={{ color: 'red' }}>{cartError}</p>}
            {cartItems.length === 0 && !cartLoading && !cartError && <p>Your cart is empty.</p>}
            {cartItems.length > 0 && (
              <>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {cartItems.map(item => (
                    <li key={item.id} style={{ borderBottom: '1px solid #eee', marginBottom: 10, paddingBottom: 10 }}>
                      <strong>{item.book.title}</strong> by {item.book.author}<br />
                      Price: ${item.book.price} &nbsp; | &nbsp; Qty: {item.quantity}
                    </li>
                  ))}
                </ul>
                <div style={{ fontWeight: 'bold', margin: '12px 0' }}>
                  Total: ${cartItems.reduce((sum, item) => sum + (item.book.price * item.quantity), 0).toFixed(2)}
                </div>
                <button style={{ marginTop: 8, padding: '8px 18px', background: '#007bff', color: '#fff', border: 'none', borderRadius: 4, fontSize: 16, cursor: 'pointer' }} onClick={handleCheckout}>Checkout</button>
              </>
            )}
            {checkoutMessage && <p style={{ marginTop: 10, color: checkoutMessage.startsWith('Error') ? 'red' : 'green' }}>{checkoutMessage}</p>}
          </div>
        </div>
      )}
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
