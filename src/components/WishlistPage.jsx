
import React from "react";

const WishlistPage = ({ wishlistItems, moveToCart, removeFromWishlist }) => {
  return (
    <div>
      <h2>Your Wishlist</h2>
      {wishlistItems.length === 0 ? (
        <p>No items in wishlist.</p>
      ) : (
        wishlistItems.map((item) => (
          <div key={item.id}>
            <img src={item.image} alt={item.name} width={100} />
            <p>{item.name}</p>
            <button onClick={() => moveToCart(item)}>Move to Cart</button>
            <button onClick={() => removeFromWishlist(item.id)}>Remove</button>
          </div>
        ))
      )}
    </div>
  );
};

export default WishlistPage;
