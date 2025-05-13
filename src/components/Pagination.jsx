import { Pagination as MuiPagination, Box } from '@mui/material';
import { useSearchParams } from 'react-router-dom';

const Pagination = ({ count, page, onChange, size = 'medium' }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handlePageChange = (event, value) => {
    searchParams.set('page', value.toString());
    setSearchParams(searchParams);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <Box 
      display="flex" 
      justifyContent="center" 
      mt={2} 
      mb={1}
      sx={{ '& .MuiPaginationItem-root': { borderRadius: 0 } }}
    >
      <MuiPagination
        count={count}
        page={page}
        onChange={handlePageChange}
        color="primary"
        size={size}
        showFirstButton
        showLastButton
        siblingCount={1}
        sx={{ 
          '& .MuiPaginationItem-root': { 
            minWidth: '30px',
            height: '30px',
            borderRadius: '0',
            margin: '0 2px',
            fontSize: '0.875rem'
          },
          '& .Mui-selected': {
            backgroundColor: '#1a237e !important',
            color: 'white'
          }
        }}
      />
    </Box>
  );
};

export default Pagination; 