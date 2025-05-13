import { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Link as MuiLink,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Breadcrumbs
} from '@mui/material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LanguageIcon from '@mui/icons-material/Language';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';

import { getUserById, getAlbumsByUserId, getAvatarUrl } from '../../api/api';
import Loading from '../../components/Loading';
import Pagination from '../../components/Pagination';
import UserAvatar from '../../components/UserAvatar';

const UserDetail = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1');
  const [user, setUser] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const PAGE_SIZE = 10;
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(true);
      try {
        const userData = await getUserById(id);
        setUser(userData);

        const albumsData = await getAlbumsByUserId(id);
        setAlbums(albumsData);

        setTotalPages(Math.ceil(albumsData.length / PAGE_SIZE));
      } catch (error) {
        console.error('Error fetching user details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [id]);

  const paginatedAlbums = albums.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  if (loading) {
    return <Loading message="Loading user details..." />;
  }

  return (
    <Box sx={{ width: '100%', maxWidth: '1200px', mx: 'auto' }}>
      <Box mb={3}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link to="/users" style={{ display: 'flex', alignItems: 'center', color: 'inherit', textDecoration: 'none' }}>
            <KeyboardArrowLeftIcon fontSize="small" />
            Users
          </Link>
          <Typography color="text.primary">Show</Typography>
        </Breadcrumbs>
      </Box>

      <Typography variant="h5" gutterBottom component="h1" sx={{ mb: 3 }}>
        Show User
      </Typography>

      <Box mb={3}>
        <UserAvatar user={user} avatarSize={50} />
      </Box>

      <Typography variant="h6" gutterBottom component="h2" sx={{ mb: 4 }}>
        Albums ({albums.length})
      </Typography>

      <TableContainer component={Paper} elevation={0} sx={{ border: 'none', boxShadow: 'none' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>
              <TableCell sx={{ fontWeight: 'bold', pl: 0 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold', pr: 0 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedAlbums.map((album) => (
              <TableRow key={album.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell sx={{ pl: 0 }}>{album.id}</TableCell>
                <TableCell>
                  <MuiLink
                    component={Link}
                    to={`/albums/${album.id}`}
                    color="inherit"
                    underline="hover"
                    sx={{ cursor: 'pointer' }}
                  >
                    {album.title}
                  </MuiLink>
                </TableCell>
                <TableCell align="right" sx={{ pr: 0 }}>
                  <Button
                    component={Link}
                    to={`/albums/${album.id}`}
                    startIcon={<VisibilityIcon />}
                    variant="outlined"
                    size="small"
                    color="primary"
                    sx={{ borderRadius: 5, py: 0.5, px: 1.5, fontWeight: 'normal', textTransform: 'none' }}
                  >
                    Show
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <Pagination
          count={totalPages}
          page={currentPage}
        />
      )}
    </Box>
  );
};

export default UserDetail;