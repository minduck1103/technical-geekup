import { createBrowserRouter } from 'react-router-dom';

import Layout from '../components/Layout';
import Home from '../pages/Home';
import AlbumList from '../pages/albums/AlbumList';
import AlbumDetail from '../pages/albums/AlbumDetail';
import UserList from '../pages/users/UserList';
import UserDetail from '../pages/users/UserDetail';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'albums',
        element: <AlbumList />
      },
      {
        path: 'albums/:id',
        element: <AlbumDetail />
      },
      {
        path: 'users',
        element: <UserList />
      },
      {
        path: 'users/:id',
        element: <UserDetail />
      }
    ]
  }
]);

export default router; 