import { Avatar, Box, Typography, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import { getAvatarUrl } from '../api/api';

const UserAvatar = ({ user, avatarSize = 36, showInfo = true, clickable = true }) => {
  if (!user) return null;

  const avatarUrl = getAvatarUrl(user.name, avatarSize);
  
  const avatarComponent = (
    <Avatar
      src={avatarUrl}
      alt={user.name}
      sx={{ 
        width: avatarSize, 
        height: avatarSize,
        cursor: clickable ? 'pointer' : 'default',
        bgcolor: '#e91e63', // Pink background similar to the template
        fontSize: avatarSize / 2.5,
        fontWeight: 'bold',
      }}
    >
      {user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
    </Avatar>
  );

  if (!showInfo) {
    return clickable ? (
      <Link to={`/users/${user.id}`}>{avatarComponent}</Link>
    ) : (
      avatarComponent
    );
  }

  return (
    <Box display="flex" alignItems="center" gap={1.5}>
      {clickable ? (
        <Link to={`/users/${user.id}`}>{avatarComponent}</Link>
      ) : (
        avatarComponent
      )}
      
      <Box>
        <Typography variant="body1" component="div" sx={{ fontWeight: 500, fontSize: '0.875rem', lineHeight: 1.2 }}>
          {clickable ? (
            <MuiLink
              component={Link}
              to={`/users/${user.id}`}
              underline="hover"
              color="inherit"
              sx={{ cursor: 'pointer' }}
            >
              {user.name}
            </MuiLink>
          ) : (
            user.name
          )}
        </Typography>
        
        {user.email && (
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
            <MuiLink
              href={`mailto:${user.email}`}
              underline="hover"
              color="inherit"
              sx={{ cursor: 'pointer' }}
            >
              {user.email}
            </MuiLink>
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default UserAvatar; 