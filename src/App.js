import React, { useState, useEffect } from 'react';
import './App.css';

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

  const fetchBooks = async (query, isSimilar = false) => {
    setLoading(true);
    setError('');
    setNoResults(false);
    try {
      const endpoint = isSimilar
        ? `/api/books/similar?search=${encodeURIComponent(query)}`
        : `/api/books?search=${encodeURIComponent(query)}`;
      const res = await fetch(endpoint);
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

  const handleAddToCart = async (bookId) => {
    setCartMessage('');
    try {
      const res = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId, quantity })
      });
      if (!res.ok) throw new Error('Failed to add to cart');
      setCartMessage('Book added to cart!');
    } catch (err) {
      setCartMessage('Error: ' + err.message);
    }
  };

  const fetchCart = async () => {
    setCartLoading(true);
    setCartError('');
    try {
      const res = await fetch('/api/cart');
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
      const res = await fetch('/api/cart/checkout', { method: 'POST' });
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
    <div className="App">
      <button onClick={handleOpenCart} style={{ position: 'absolute', top: 24, right: 32, padding: '8px 18px', background: '#ff9800', color: '#fff', border: 'none', borderRadius: 4, fontSize: 16, cursor: 'pointer', zIndex: 1100 }}>View Cart</button>
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
            </div>
          ))
        )}
      </div>
      <h1>Books On Sale</h1>
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
          <div key={book.id} className="book-card" onClick={() => setSelectedBook(book)} style={{ cursor: 'pointer' }}>
            <h3>{book.title}</h3>
            <p><strong>Author:</strong> {book.author}</p>
            <p><strong>Price:</strong> ${book.price}</p>
            <p>{book.description}</p>
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
            <button style={{ marginTop: 8, padding: '8px 18px', background: '#28a745', color: '#fff', border: 'none', borderRadius: 4, fontSize: 16, cursor: 'pointer' }} onClick={() => handleAddToCart(selectedBook.id)}>Add to Cart</button>
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
                  Total: ${cartItems.reduce((sum, item) => sum + item.book.price * item.quantity, 0).toFixed(2)}
                </div>
                <button style={{ marginTop: 8, padding: '8px 18px', background: '#007bff', color: '#fff', border: 'none', borderRadius: 4, fontSize: 16, cursor: 'pointer' }} onClick={handleCheckout}>Checkout</button>
              </>
            )}
            {checkoutMessage && <p style={{ marginTop: 10, color: checkoutMessage.startsWith('Error') ? 'red' : 'green' }}>{checkoutMessage}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
