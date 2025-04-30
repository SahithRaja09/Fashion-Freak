import React, { useEffect, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import Header from './Header';
import { useNavigate } from 'react-router-dom'; 

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
   
  };

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
  }, []);

  const updateCart = updatedCart => {
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const increment = index => {
    const updated = [...cart];
    updated[index].count += 1;
    updated[index].price = updated[index].count * updated[index].unitPrice;
    updateCart(updated);
  };

  const decrement = index => {
    const updated = [...cart];
    if (updated[index].count > 1) {
      updated[index].count -= 1;
      updated[index].price = updated[index].count * updated[index].unitPrice;
    } else {
      updated.splice(index, 1);
    }
    updateCart(updated);
  };

  const filteredCart = cart.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filteredCart.length === 0) {
    return (
      <>
        <Header showSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <Box sx={{ textAlign: 'center', py: 5, color: '#fff', bgcolor: '#191b43', minHeight: '100vh' }}>
          <Typography variant="h4">Your Cart is Empty</Typography>
          <Button
            href="/"
            sx={{
              mt: 3,
              backgroundColor: '#fff',
              color: '#191b43',
              px: 3,
              borderRadius: 50,
              '&:hover': { backgroundColor: '#262d8c', color: '#fff' },
            }}
          >
            Willing to add more products?
          </Button>
        </Box>
      </>
    );
  }
  return (
    <>
          <Header
        showSearch
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onMenuClick={toggleDrawer(true)}
        cartCount={cart.reduce((total, item) => total + item.count, 0)}
      />
      <Box sx={{ width: '90%', margin: '0 auto', backgroundColor: '#191b43', minHeight: '100vh', py: 4 }}>
        <Button
          onClick={() => navigate('/')}
          sx={{
            mb: 2,
            backgroundColor: '#fff',
            color: '#191b43',
            px: 3,
            ml:2,
            borderRadius: 50,
            '&:hover': { backgroundColor: '#262d8c', color: '#fff' },
          }}
        >
          Back to Products
        </Button>
        <Typography variant="h3" sx={{ textAlign: 'center', color: '#fff', mb: 4 }}>
          My Cart
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center' }}>
          {filteredCart.map((item, index) => (
            <Box
              key={item.id}
              sx={{
                bgcolor: '#fff',
                borderRadius: 2,
                width: 250,
                textAlign: 'center',
                p: 2,
                boxShadow: 4,
              }}
            >
              <img src={item.image} alt={item.title} style={{ height: 150, objectFit: 'contain' }} />
              <Typography variant="h6" sx={{ color: '#191b43', my: 1 }}>{item.title}</Typography>
              <Typography sx={{ textTransform: 'capitalize', color: '#191b43' }}>{item.category}</Typography>
              <Box sx={{ mt: 1, mb: 2, backgroundColor: '#191b43', color: 'white', borderRadius: 50, py: 1 }}>
                ${item.price}
              </Box>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', alignItems: 'center' }}>
                <Button size="small" onClick={() => decrement(index)} sx={{ backgroundColor: '#191b43', color: '#fff', minWidth: 40 }}>-</Button>
                <Typography sx={{ color: '#333' }}>{item.count}</Typography>
                <Button size="small" onClick={() => increment(index)} sx={{ backgroundColor: '#191b43', color: '#fff', minWidth: 40 }}>+</Button>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
}