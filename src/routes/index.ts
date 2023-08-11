import { lazy } from 'react';

export const Category = lazy(() => import('../pages/Category'));
export const SubCategory = lazy(() => import('../pages/SubCategory'));
export const Brands = lazy(() => import('../pages/Brands'));
export const Products = lazy(() => import('../pages/Products'));
export const Chart = lazy(() => import('../pages/Chart'));
export const FormElements = lazy(() => import('../pages/Form/FormElements'));
export const FormLayout = lazy(() => import('../pages/Form/FormLayout'));
export const Profile = lazy(() => import('../pages/Profile'));
export const Settings = lazy(() => import('../pages/Settings'));
export const Tables = lazy(() => import('../pages/Tables'));
export const Alerts = lazy(() => import('../pages/UiElements/Alerts'));
export const Buttons = lazy(() => import('../pages/UiElements/Buttons'));
export const Home = lazy(() => import('../pages/Dashboard/Home'));
