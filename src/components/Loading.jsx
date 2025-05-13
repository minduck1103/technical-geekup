import { Box, CircularProgress, Typography } from '@mui/material';

const Loading = ({ message = 'Loading...' }) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      minHeight="200px"
      padding={3}
    >
      <CircularProgress color="primary" size={60} thickness={4} />
      <Typography variant="h6" color="textSecondary" mt={2}>
        {message}
      </Typography>
    </Box>
  );
};

export default Loading; 