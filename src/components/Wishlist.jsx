import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import IconButton from '@mui/material/IconButton';



export default function Wishlist({ isWishlisted, onClick }) {
  return (
    <IconButton onClick={onClick} color="error">
      {isWishlisted ? <FavoriteIcon /> : <FavoriteBorderIcon />}
    </IconButton>
  );
    
}

