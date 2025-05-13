import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';

const FallbackImage = ({ 
  imageUrls = [], 
  alt = "Image", 
  width = "100%", 
  height = "150px",
  objectFit = "cover",
  color = "#cccccc",
  textColor = "#ffffff",
  showPlaceholder = true,
  imgProps = {}
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [allFailed, setAllFailed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageError = () => {
    if (currentIndex < imageUrls.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setAllFailed(true);
    }
  };

  useEffect(() => {
    setImageLoaded(false);
  }, [currentIndex]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  if (allFailed && showPlaceholder) {
    return (
      <Box
        sx={{
          width,
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: color,
          color: textColor,
        }}
      >
        <ImageIcon sx={{ fontSize: typeof height === 'number' ? height * 0.3 : 40 }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width,
        height,
        position: 'relative',
        overflow: 'hidden',
        bgcolor: !imageLoaded ? 'transparent' : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {!imageLoaded && !allFailed && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#f5f5f5',
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              border: '3px solid #e0e0e0',
              borderTopColor: '#3f51b5',
              animation: 'spin 1s linear infinite',
              '@keyframes spin': {
                '0%': {
                  transform: 'rotate(0deg)',
                },
                '100%': {
                  transform: 'rotate(360deg)',
                },
              },
            }}
          />
        </Box>
      )}

      {!allFailed && (
        <img
          src={imageUrls[currentIndex]}
          alt={alt}
          onError={handleImageError}
          onLoad={handleImageLoad}
          style={{
            width: '100%',
            height: '100%',
            objectFit,
            display: imageLoaded ? 'block' : 'none',
            ...imgProps.style,
          }}
          {...imgProps}
        />
      )}
    </Box>
  );
};

export default FallbackImage; 