import { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  IconButton,
  Breadcrumbs
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import ImageIcon from '@mui/icons-material/Image';

import { getAlbumById, getUserById, getPhotosByAlbumId } from '../../api/api';
import Loading from '../../components/Loading';
import UserAvatar from '../../components/UserAvatar';
import Pagination from '../../components/Pagination';
import FallbackImage from '../../components/FallbackImage';

const FALLBACK_IMAGES = [
  'https://via.placeholder.com/600/771796',
  'https://via.placeholder.com/600/24f355',
  'https://via.placeholder.com/600/d32776',
  'https://via.placeholder.com/600/f66b97',
  'https://via.placeholder.com/600/56a8c2',
  'https://via.placeholder.com/600/b0f7cc',
  'https://via.placeholder.com/600/54176f',
  'https://via.placeholder.com/600/51aa97',
  'https://via.placeholder.com/600/810b14',
  'https://via.placeholder.com/600/1ee8a4',
];

const FALLBACK_THUMBNAILS = [
  'https://via.placeholder.com/150/771796',
  'https://via.placeholder.com/150/24f355',
  'https://via.placeholder.com/150/d32776',
  'https://via.placeholder.com/150/f66b97',
  'https://via.placeholder.com/150/56a8c2',
  'https://via.placeholder.com/150/b0f7cc',
  'https://via.placeholder.com/150/54176f',
  'https://via.placeholder.com/150/51aa97',
  'https://via.placeholder.com/150/810b14',
  'https://via.placeholder.com/150/1ee8a4',
];

const AlbumDetail = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1');
  const [album, setAlbum] = useState(null);
  const [user, setUser] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const PAGE_SIZE = 10;
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    const fetchAlbumDetails = async () => {
      setLoading(true);
      try {
        const albumData = await getAlbumById(id);
        setAlbum(albumData);

        const userData = await getUserById(albumData.userId);
        setUser(userData);

        const photosData = await getPhotosByAlbumId(id);

        const processedPhotos = photosData.map((photo, index) => ({
          ...photo,
          thumbnailBackup: FALLBACK_THUMBNAILS[index % FALLBACK_THUMBNAILS.length],
          urlBackup: FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]
        }));

        setPhotos(processedPhotos);

        setTotalPages(Math.ceil(processedPhotos.length / PAGE_SIZE));
      } catch (error) {
        console.error('Error fetching album details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbumDetails();
  }, [id]);

  const handleOpenPhoto = (photo) => {
    setSelectedPhoto(photo);
  };

  const handleClosePhoto = () => {
    setSelectedPhoto(null);
  };

  const handleImageError = (photoId, isBackupFailed = false) => {
    if (isBackupFailed) {
      setImageErrors(prev => ({
        ...prev,
        [photoId]: { primary: true, backup: true }
      }));
    } else {
      setImageErrors(prev => ({
        ...prev,
        [photoId]: { ...prev[photoId], primary: true }
      }));
    }
  };

  const getPhotoSrc = (photo, isLarge = false) => {
    const errorState = imageErrors[photo.id] || {};

    if (isLarge) {
      if (!errorState.primary) {
        return photo.urlBackup || photo.url;
      } else if (!errorState.backup) {
        return photo.urlBackup2;
      }
      return null;
    } else {
      if (!errorState.primary) {
        return photo.thumbnailBackup || photo.thumbnailUrl;
      } else if (!errorState.backup) {
        return photo.thumbnailBackup2;
      }
      return null;
    }
  };

  const currentPhotos = photos.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  if (loading) {
    return <Loading message="Loading album details..." />;
  }

  return (
    <Box sx={{ width: '100%', maxWidth: '1200px', mx: 'auto' }}>
      <Box mb={3}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link to="/albums" style={{ display: 'flex', alignItems: 'center', color: 'inherit', textDecoration: 'none' }}>
            <KeyboardArrowLeftIcon fontSize="small" />
            Albums
          </Link>
          <Typography color="text.primary">Show</Typography>
        </Breadcrumbs>
      </Box>

      <Typography variant="h5" gutterBottom component="h1" sx={{ mb: 3 }}>
        Show Album
      </Typography>

      {user && (
        <Box mb={3}>
          <UserAvatar user={user} avatarSize={50} />
        </Box>
      )}

      <Typography variant="h6" component="h2" gutterBottom sx={{ mb: 2 }}>
        {album?.title}
      </Typography>

      <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="body2" color="text.secondary">
          {photos.length} photos in this album
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Page {currentPage} of {totalPages}
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {currentPhotos.map((photo) => {
          const photoSrc = getPhotoSrc(photo);
          const errorState = imageErrors[photo.id] || {};
          const hasCompleteFail = errorState.primary && errorState.backup;

          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={photo.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  boxShadow: 'none',
                  border: '1px solid #eee',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                  }
                }}
                onClick={() => handleOpenPhoto(photo)}
              >
                <FallbackImage
                  imageUrls={photo.thumbnailUrls}
                  alt={photo.title}
                  height={150}
                  color={`#${photo.color}`}
                  textColor={`#${photo.textColor}`}
                />
                <CardContent sx={{ flexGrow: 1, p: 1.5 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                    {photo.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {totalPages > 1 && (
        <Pagination
          count={totalPages}
          page={currentPage}
        />
      )}

      <Dialog
        open={!!selectedPhoto}
        onClose={handleClosePhoto}
        maxWidth="md"
        fullWidth
      >
        {selectedPhoto && (
          <>
            <DialogContent>
              <IconButton
                sx={{ position: 'absolute', right: 8, top: 8, zIndex: 2 }}
                onClick={handleClosePhoto}
              >
                <CloseIcon />
              </IconButton>
              <Box sx={{ textAlign: 'center' }}>
                <FallbackImage
                  imageUrls={selectedPhoto.imageUrls}
                  alt={selectedPhoto.title}
                  height="60vh"
                  width="auto"
                  color={`#${selectedPhoto.color}`}
                  textColor={`#${selectedPhoto.textColor}`}
                  imgProps={{
                    style: {
                      maxWidth: '100%',
                      maxHeight: '70vh',
                      width: 'auto',
                      margin: '0 auto'
                    }
                  }}
                />
                <Typography variant="h6" mt={2}>
                  {selectedPhoto.title}
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClosePhoto}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default AlbumDetail;