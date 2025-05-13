import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Link as MuiLink,
  Grid,
  ToggleButtonGroup,
  ToggleButton,
  Divider
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import { Link } from 'react-router-dom';

import { getAlbums, getUserById } from '../../api/api';
import Loading from '../../components/Loading';
import Pagination from '../../components/Pagination';
import UserAvatar from '../../components/UserAvatar';
import AlbumCard from '../../components/AlbumCard';

const AlbumList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1');
  const viewMode = searchParams.get('view') || 'grid';

  const [albums, setAlbums] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);

  const PAGE_SIZE = {
    grid: 12,
    table: 20
  };

  useEffect(() => {
    const fetchAlbums = async () => {
      setLoading(true);
      try {
        const pageSize = PAGE_SIZE[viewMode];
        const result = await getAlbums(currentPage, pageSize);
        setAlbums(result.data);
        setTotalPages(Math.ceil(result.total / pageSize));

        const userIds = [...new Set(result.data.map(album => album.userId))];
        const userPromises = userIds.map(id => getUserById(id));
        const userData = await Promise.all(userPromises);

        const userMap = {};
        userData.forEach(user => {
          userMap[user.id] = user;
        });

        setUsers(userMap);
      } catch (error) {
        console.error('Error fetching albums:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbums();
  }, [currentPage, viewMode]);

  const handleViewChange = (event, newViewMode) => {
    if (newViewMode) {
      searchParams.set('view', newViewMode);
      searchParams.set('page', '1');
      setSearchParams(searchParams);
    }
  };

  if (loading) {
    return <Loading message="Loading albums..." />;
  }

  const renderGridView = () => (
    <Grid container spacing={3}>
      {albums.map(album => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={album.id}>
          <AlbumCard
            album={album}
            user={users[album.userId]}
          />
        </Grid>
      ))}
    </Grid>
  );

  const renderTableView = () => (
    <TableContainer component={Paper} elevation={0} sx={{ border: 'none', boxShadow: 'none' }}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow sx={{ borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>
            <TableCell sx={{ fontWeight: 'bold', pl: 0 }}>ID</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>User</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold', pr: 0 }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {albums.map((album) => (
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
              <TableCell>
                {users[album.userId] && (
                  <UserAvatar user={users[album.userId]} />
                )}
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
  );

  return (
    <Box sx={{ width: '100%', maxWidth: '1200px', mx: 'auto' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h1">
          Albums
        </Typography>

        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewChange}
          aria-label="view mode"
          size="small"
        >
          <ToggleButton value="grid" aria-label="grid view">
            <GridViewIcon />
          </ToggleButton>
          <ToggleButton value="table" aria-label="table view">
            <ViewListIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {viewMode === 'grid' ? renderGridView() : renderTableView()}

      <Box mt={4} display="flex" justifyContent="center">
        <Pagination
          count={totalPages}
          page={currentPage}
        />
      </Box>
    </Box>
  );
};

export default AlbumList;