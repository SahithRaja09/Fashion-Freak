import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  CardMedia,
  CardActions,
  Button,
  Tooltip,
} from '@mui/material';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import CableIcon from '@mui/icons-material/Cable';
import DiamondIcon from '@mui/icons-material/Diamond';
import Header from './Header';
import Wishlist from './Wishlist';

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
  const [filters, setFilters] = useState({});
  const [wishlist, setWishlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

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

  const handleFilterToggle = value => {
    setFilters(prev => ({ ...prev, [value]: !prev[value] }));
  };

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

  const toggleWishlist = product => {
    const exists = wishlist.some(item => item.id === product.id);
    setWishlist(exists ? wishlist.filter(item => item.id !== product.id) : [...wishlist, product]);
  };

  function ProductCard({ product }) {
    const isWishlisted = wishlist.some(item => item.id === product.id);
    const cartItem = cart.find(item => item.id === product.id);

    return (
      <Box
        key={product.id}
        sx={{
          width: 280,
          minHeight: 440,
          bgcolor: 'aliceblue',
          borderRadius: 2,
          boxShadow: 3,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          transition: 'transform 0.3s ease-out',
          '&:hover': { transform: 'scale(1.05)', boxShadow: 6 },
          p: 2,
        }}
      >
        <CardMedia
          component="img"
          image={product.image}
          alt={product.title}
          sx={{ height: 200, width: '100%', objectFit: 'contain', borderRadius: 2 }}
        />
        <Box sx={{ textAlign: 'center', mt: 1 }}>
          <Typography
            variant="h6"
            sx={{
              color: '#191b43',
              fontSize: '16px',
              height: 48,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {product.title}
          </Typography>
          <Typography sx={{ textTransform: 'capitalize', color: '#191b43' }}>
            {product.category}
          </Typography>

          <Typography sx={{ mt: 1, fontWeight: 600 }}>
            ${cartItem ? cartItem.price.toFixed(2) : product.price.toFixed(2)}
          </Typography>

          <CardActions sx={{ justifyContent: 'center', mt: 1 }}>
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

          <Box sx={{ borderTop: '1px solid #ddd', width: '100%', mt: 2, textAlign: 'center' }}>
            <Wishlist isWishlisted={isWishlisted} onClick={() => toggleWishlist(product)} />
          </Box>
        </Box>
      </Box>
    );
  }

  const getCategoryIcon = label => {
    switch (label) {
      case "Mens":
        return <MaleIcon />;
      case "Womens":
        return <FemaleIcon />;
      case "Electronics":
        return <CableIcon />;
      case "Jewelry":
        return <DiamondIcon />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ bgcolor: '#ffffff', minHeight: '100vh', overflowX: 'hidden' }}>
      <Box sx={{ position: 'sticky', top: 0, zIndex: 1000, bgcolor: '#ffffff', boxShadow: 2 }}>
        <Header
          showSearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          cartCount={cart.reduce((total, item) => total + item.count, 0)}
        />

        {/* Filter icons in header */}
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
          {categoryOptions.map(opt => (
            <Tooltip key={opt.value} title={opt.label}>
              <IconButton
                onClick={() => handleFilterToggle(opt.value)}
                color={filters[opt.value] ? 'primary' : 'default'}
              >
                {getCategoryIcon(opt.label)}
              </IconButton>
            </Tooltip>
          ))}
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 2,
          px: 1,
          py: 2,
          bgcolor: '#191b43',
        }}
      >
        {filtered.length > 0 ? (
          filtered.map(product => <ProductCard key={product.id} product={product} />)
        ) : (
          <Typography sx={{ color: '#fff' }}>No Products Found.</Typography>
        )}
      </Box>
    </Box>
  );
}
