import { createBrowserRouter } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import Home from '../features/home/pages/Home';

// Routes are added here as new pages are built.
const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <Home /> },
      // TODO: /expos, /exhibitors, /schedule, /login, /register
    ],
  },
]);

export default router;
