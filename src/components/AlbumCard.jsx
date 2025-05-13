import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Button, CardActionArea, Skeleton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { getPhotosByAlbumId, getImageUrls } from '../api/api';
import FallbackImage from './FallbackImage';
import UserAvatar from './UserAvatar';

const albumCoverCache = {};

const AlbumCard = ({ album, user }) => {
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoverPhoto = async () => {
      if (!album) return;
      
      if (albumCoverCache[album.id]) {
        setCoverPhoto(albumCoverCache[album.id]);
        setLoading(false);
        return;
      }
      
      try {
        const photos = await getPhotosByAlbumId(album.id);
        if (photos && photos.length > 0) {
          albumCoverCache[album.id] = photos[0];
          setCoverPhoto(photos[0]);
        } else {
          const dummyPhoto = {
            id: album.id,
            title: album.title,
            thumbnailUrls: getImageUrls(album.id, false),
            imageUrls: getImageUrls(album.id, true),
            color: Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'),
            textColor: 'FFFFFF'
          };
          albumCoverCache[album.id] = dummyPhoto;
          setCoverPhoto(dummyPhoto);
        }
      } catch (error) {
        console.error('Error fetching cover photo:', error);
        const fallbackPhoto = {
          id: album.id,
          title: album.title,
          thumbnailUrls: getImageUrls(album.id, false),
          imageUrls: getImageUrls(album.id, true),
          color: Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'),
          textColor: 'FFFFFF'
        };
        setCoverPhoto(fallbackPhoto);
      } finally {
        setLoading(false);
      }
    };

    fetchCoverPhoto();
  }, [album]);

  if (!album) return null;

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s',
        boxShadow: 1,
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: 3
        }
      }}
    >
      <CardActionArea 
        component={Link} 
        to={`/albums/${album.id}`}
        sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
      >
        {loading ? (
          <Skeleton variant="rectangular" width="100%" height={180} animation="wave" />
        ) : (
          <FallbackImage 
            imageUrls={coverPhoto?.thumbnailUrls || []}
            alt={album.title}
            height={180}
            color={`#${coverPhoto?.color || '1976d2'}`}
            textColor={`#${coverPhoto?.textColor || 'ffffff'}`}
          />
        )}
        
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6" component="h2" gutterBottom noWrap sx={{ mb: 1 }}>
            {album.title}
          </Typography>
          
          {user && (
            <Box mt="auto" mb={1}>
              <UserAvatar user={user} showInfo={true} clickable={true} />
            </Box>
          )}
        </CardContent>
      </CardActionArea>
      
      <Box p={2} pt={0} display="flex" justifyContent="flex-end">
        <Button
          component={Link}
          to={`/albums/${album.id}`}
          startIcon={<VisibilityIcon />}
          variant="contained"
          size="small"
          sx={{ borderRadius: 2 }}
        >
          View Album
        </Button>
      </Box>
    </Card>
  );
};

export default AlbumCard; 