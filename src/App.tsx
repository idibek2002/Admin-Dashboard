import { Suspense, lazy, useEffect, useState } from 'react';
import {
  Route,
  RouterProvider,
  Routes,
  createBrowserRouter,
} from 'react-router-dom';
import SignIn from './pages/Authentication/SignIn';
import Loader from './common/Loader';
import {
  Alerts,
  Brands,
  Buttons,
  Category,
  Chart,
  FormElements,
  FormLayout,
  Home,
  Products,
  Profile,
  Settings,
  SubCategory,
  Tables,
} from './routes';
import AuthCheck from './utils/AuthCheck';
import ProtectRoute from './utils/ProtectedRoute';

const DefaultLayout = lazy(() => import('./layout/DefaultLayout'));

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <AuthCheck>
          <SignIn />/
        </AuthCheck>
      ),
    },
    {
      path: 'dashboard',
      element: (
        <ProtectRoute>
          <DefaultLayout />/
        </ProtectRoute>
      ),
      children: [
        {
          index: true,
          element: <Home />,
        },
        { path: 'category', element: <Category /> },
        { path: 'subcategory', element: <SubCategory /> },
        { path: 'brands', element: <Brands /> },
        { path: 'products', element: <Products /> },
        {
          path: 'profile',
          element: <Profile />,
        },
        {
          path: 'form-elements',
          element: <FormElements />,
        },
        {
          path: 'form-layouts',
          element: <FormLayout />,
        },
        {
          path: 'tables',
          element: <Tables />,
        },
        {
          path: 'settings',
          element: <Settings />,
        },
        {
          path: 'chart',
          element: <Chart />,
        },
        {
          path: 'ui/alerts',
          element: <Alerts />,
        },
        {
          path: 'ui/buttons',
          element: <Buttons />,
        },
      ],
    },
  ]);

  return (
    <>
      <Suspense fallback={<Loader />}>
        <RouterProvider router={router} />
      </Suspense>
    </>
  );
}

export default App;
