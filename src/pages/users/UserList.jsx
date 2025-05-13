import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  Avatar
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { getUsers, getAvatarUrl } from '../../api/api';
import Loading from '../../components/Loading';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const userData = await getUsers();
        setUsers(userData);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <Loading message="Loading users..." />;
  }

  return (
    <Box sx={{ width: '100%', maxWidth: '1200px', mx: 'auto' }}>
      <TableContainer component={Paper} elevation={0} sx={{ border: 'none', boxShadow: 'none' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>
              <TableCell sx={{ fontWeight: 'bold', pl: 0 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Avatar</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Phone</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Website</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold', pr: 0 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell sx={{ pl: 0 }}>{user.id}</TableCell>
                <TableCell>
                  <Link to={`/users/${user.id}`}>
                    <Avatar
                      src={getAvatarUrl(user.name)}
                      alt={user.name}
                      sx={{
                        cursor: 'pointer',
                        bgcolor: '#e91e63',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        width: 36,
                        height: 36
                      }}
                    >
                      {user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                    </Avatar>
                  </Link>
                </TableCell>
                <TableCell>
                  <MuiLink
                    component={Link}
                    to={`/users/${user.id}`}
                    color="inherit"
                    underline="hover"
                    sx={{ cursor: 'pointer', fontWeight: 500 }}
                  >
                    {user.name}
                  </MuiLink>
                </TableCell>
                <TableCell>
                  <MuiLink
                    href={`mailto:${user.email}`}
                    underline="hover"
                    color="primary"
                    sx={{ cursor: 'pointer', fontSize: '0.875rem' }}
                  >
                    {user.email}
                  </MuiLink>
                </TableCell>
                <TableCell>
                  <MuiLink
                    href={`tel:${user.phone}`}
                    underline="hover"
                    color="primary"
                    sx={{ cursor: 'pointer', fontSize: '0.875rem' }}
                  >
                    {user.phone}
                  </MuiLink>
                </TableCell>
                <TableCell>
                  <MuiLink
                    href={`https://${user.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="hover"
                    color="primary"
                    sx={{ cursor: 'pointer', fontSize: '0.875rem' }}
                  >
                    {user.website}
                  </MuiLink>
                </TableCell>
                <TableCell align="right" sx={{ pr: 0 }}>
                  <Button
                    component={Link}
                    to={`/users/${user.id}`}
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
    </Box>
  );
};

export default UserList;