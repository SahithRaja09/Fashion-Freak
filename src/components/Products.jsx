import React, { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  Typography,
  FormControlLabel,
  Checkbox,
  CardMedia,
  CardActions,
  Button,
} 
from '@mui/material';
import Header from './Header';
// import { useNavigate } from 'react-router-dom';

import Wishlist from './Wishlist';
// import WishlistButton from './WishlistButton';


const categoryOptions = [
  { label: "Mens", value: "men's clothing" },
  { label: "Womens", value: "women's clothing" },
  { label: "Electronics", value: "electronics" },
  { label: "Jewelry", value: "jewelery" },
];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [cart, setCart] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const [wishlist, setWishlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  // const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const res = await fetch('https://fakestoreapi.com/products');
      const data = await res.json();
      setProducts(data);
      setFiltered(data);
    })();
    setCart(JSON.parse(localStorage.getItem('cart')) || []);
  }, []);

  useEffect(() => {
    let temp = [...products];
    const active = Object.keys(filters).filter(key => filters[key]);
    if (active.length) temp = temp.filter(item => active.includes(item.category));
    if (searchTerm) {
      temp = temp.filter(
        item =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFiltered(temp);
  }, [filters, searchTerm, products]);

  const toggleDrawer = open => () => setDrawerOpen(open);
  const handleFilter = value => e =>
    setFilters(prev => ({ ...prev, [value]: e.target.checked }));

  const addToCart = product => {
    setCart(prev => {
      const exists = prev.find(item => item.id === product.id);
      const updated = exists
        ? prev.map(i =>
            i.id === product.id
              ? { ...i, count: i.count + 1, price: (i.count + 1) * i.unitPrice }
              : i
          )
        : [...prev, { ...product, count: 1, unitPrice: product.price, price: product.price }];
      localStorage.setItem('cart', JSON.stringify(updated));
      return updated;
    });
  };

  const decrement = productId => {
    setCart(prev => {
      const updated = prev
        .map(item =>
          item.id === productId
            ? { ...item, count: Math.max(item.count - 1, 0), price: Math.max(item.count - 1, 0) * item.unitPrice }
            : item
        )
        .filter(item => item.count > 0);
      localStorage.setItem('cart', JSON.stringify(updated));
      return updated;
    });
  };
  

  function ProductCard({ product, wishlist, onToggleWishlist }) {
    const isWishlisted = wishlist.some(item => item.id === product.id);

    return (
      <Box sx={{ border: '1px solid #ddd',display:'inline-flex',justifyContent:'center', borderRadius: 2 }}>
        <h3>{product.name}</h3>
        <Wishlist
          isWishlisted={isWishlisted}
          onClick={() => onToggleWishlist(product)}
        />
      </Box>
    );
  }

  const toggleWishlist = (product) => {
    const exists = wishlist.some(item => item.id === product.id);
    if (exists) {
      setWishlist(wishlist.filter(item => item.id !== product.id));
    } else {
      setWishlist([...wishlist, product]);
    }
  };
  
  return (
    <Box sx={{ bgcolor: '#ffffff', minHeight: '100vh' }}>
      <Header
        showSearch
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onMenuClick={toggleDrawer(true)}
        cartCount={cart.reduce((total, item) => total + item.count, 0)}
      />

      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 250, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Filters
          </Typography>
          {categoryOptions.map(opt => (
            <FormControlLabel
              key={opt.value}
              control={<Checkbox checked={!!filters[opt.value]} onChange={handleFilter(opt.value)} />}
              label={opt.label}
            />
          ))}
        </Box>
      </Drawer>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 2,
          p: 2,
          bgcolor: '#191b43',
        }}
      >
        {filtered.length > 0 ? (
          filtered.map(product => {
            const cartItem = cart.find(cartItem => cartItem.id === product.id);
            return (
              <Box
                key={product.id}
                sx={{
                  flex: '250px',
                  maxWidth: '300px',
                  bgcolor: 'aliceblue',
                  borderRadius: 2,
                  boxShadow: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  transition: 'transform 0.3s ease-out',
                  '&:hover': { transform: 'scale(1.05)', boxShadow: 6 },
                }}
              >
                <CardMedia
                  component="img"
                  image={product.image}
                  alt={product.title}
                  sx={{ height: 200, width: '100%', objectFit: 'contain', borderRadius: 2 }}
                />
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ color: '#191b43', fontSize: '20px' }}>
                    {product.title}
                  </Typography>
                  <Typography sx={{ textTransform: 'capitalize', color: '#191b43' }}>
                    {product.category}
                  </Typography>
                  <Typography sx={{ mt: 1, mb: 2, fontWeight: 600 }}>
                  ${cartItem ? cartItem.price.toFixed(2) : product.price}
                  </Typography>
                  <CardActions sx={{ justifyContent: 'center' }}>
  {cartItem && cartItem.count > 0 ? (
    <>
      <Button
        size="small"
        onClick={() => decrement(product.id)}
        sx={{ backgroundColor: '#191b43', color: '#fff', minWidth: 40 }}
      >
        -
      </Button>
      <Typography sx={{ mx: 1 }}>{cartItem.count}</Typography>
      <Button
        size="small"
        onClick={() => addToCart(product)}
        sx={{ backgroundColor: '#191b43', color: '#fff', minWidth: 40 }}
      >
        +
      </Button>
    </>
  ) : (
    <Button
      size="small"
      onClick={() => addToCart(product)}
      sx={{ backgroundColor: '#191b43', color: '#fff' }}
    >
      Add to Cart
    </Button>
  )}
</CardActions>

<ProductCard
  product={product}
  wishlist={wishlist}
  onToggleWishlist={toggleWishlist}
/>
                </Box>
              </Box>
            );
          })
        ) : (
          <Typography sx={{ color: '#fff' }}>No Products Found.</Typography>
        )}
      </Box>
    </Box>
  );
}
