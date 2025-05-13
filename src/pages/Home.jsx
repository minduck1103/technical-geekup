import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, Grid, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import PhotoAlbumIcon from '@mui/icons-material/PhotoAlbum';
import PeopleIcon from '@mui/icons-material/People';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { getAlbums, getUserById } from '../api/api';
import AlbumCard from '../components/AlbumCard';
import Loading from '../components/Loading';

const Home = () => {
  const [featuredAlbums, setFeaturedAlbums] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedContent = async () => {
      setLoading(true);
      try {
        // Lấy 4 album nổi bật (chỉ lấy trang đầu tiên với 4 mục)
        const albumsResult = await getAlbums(1, 4);
        setFeaturedAlbums(albumsResult.data);
        
        // Lấy thông tin người dùng cho các album
        const userIds = [...new Set(albumsResult.data.map(album => album.userId))];
        const userPromises = userIds.map(id => getUserById(id));
        const userData = await Promise.all(userPromises);
        
        const userMap = {};
        userData.forEach(user => {
          userMap[user.id] = user;
        });
        
        setUsers(userMap);
      } catch (error) {
        console.error('Error fetching featured content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedContent();
  }, []);

  return (
    <Box>
      <Box textAlign="center" py={6}>
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to GEEK<sup>UP</sup> Album Manager
        </Typography>
        
        <Typography variant="h6" color="text.secondary" paragraph mb={6}>
          Explore albums and users from our collection
        </Typography>
        
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={6} lg={5}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 4, 
                height: '100%',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 8
                }
              }}
            >
              <PhotoAlbumIcon sx={{ fontSize: 70, color: 'primary.main', mb: 2 }} />
              <Typography variant="h4" gutterBottom>
                Albums
              </Typography>
              <Typography variant="body1" paragraph color="text.secondary">
                Browse through our collection of albums from different users.
                View detailed information and photos within each album.
              </Typography>
              <Button
                component={Link}
                to="/albums"
                variant="contained"
                size="large"
                startIcon={<PhotoAlbumIcon />}
                sx={{ mt: 2 }}
              >
                View Albums
              </Button>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6} lg={5}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 4, 
                height: '100%',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 8
                }
              }}
            >
              <PeopleIcon sx={{ fontSize: 70, color: 'primary.main', mb: 2 }} />
              <Typography variant="h4" gutterBottom>
                Users
              </Typography>
              <Typography variant="body1" paragraph color="text.secondary">
                Explore our user directory with detailed profiles.
                Find contact information and view all albums by each user.
              </Typography>
              <Button
                component={Link}
                to="/users"
                variant="contained"
                size="large"
                startIcon={<PeopleIcon />}
                sx={{ mt: 2 }}
              >
                View Users
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      
      {/* Featured Albums Section */}
      <Box mt={8}>
        <Divider sx={{ mb: 4 }} />
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4" component="h2">
            Featured Albums
          </Typography>
          <Button 
            component={Link} 
            to="/albums" 
            endIcon={<ArrowForwardIcon />}
            color="primary"
          >
            View All Albums
          </Button>
        </Box>
        
        {loading ? (
          <Loading message="Loading featured albums..." />
        ) : (
          <Grid container spacing={3}>
            {featuredAlbums.map(album => (
              <Grid item xs={12} sm={6} md={3} key={album.id}>
                <AlbumCard 
                  album={album} 
                  user={users[album.userId]} 
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default Home; 