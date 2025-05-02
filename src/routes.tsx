
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';

// Import pages
// Note: We're using placeholders for pages that might not exist
// You would need to create these components or import existing ones
const Home = React.lazy(() => import('./pages/Home'));
const Profile = React.lazy(() => import('./pages/Profile'));
const ReelDetail = React.lazy(() => import('./pages/ReelDetail'));
const Favorites = React.lazy(() => import('./pages/Favorites'));
const Search = React.lazy(() => import('./pages/Search'));
const Settings = React.lazy(() => import('./pages/Settings'));
const Leaderboard = React.lazy(() => import('./pages/Leaderboard'));
const Login = React.lazy(() => import('./pages/Login'));
const NotFound = React.lazy(() => import('./pages/NotFound'));
const Legal = React.lazy(() => import('./pages/Legal'));

const AppRoutes = () => {
  return (
    <React.Suspense fallback={<div className="w-full h-screen flex items-center justify-center">Loading...</div>}>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected routes within Layout */}
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="profile/:id" element={<Profile />} />
          <Route path="profile" element={<Profile />} />
          <Route path="reel/:id" element={<ReelDetail />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="search" element={<Search />} />
          <Route path="settings" element={<Settings />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="legal" element={<Legal />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </React.Suspense>
  );
};

export default AppRoutes;
