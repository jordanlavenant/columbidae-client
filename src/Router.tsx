import { BrowserRouter, Routes, Route } from 'react-router-dom'
import FeedPage from './pages/FeedPage'
import UserPage from './pages/UserPage'
import PostPage from './pages/PostPage'
import type { ReactNode } from 'react'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  // TODO: implement useAuth() hook and redirect to login if not authenticated @jordanlavenant @tacostroisviandes
  // TODO: interact with backend to verify auth status

  // Placeholder for future authentication logic
  return <>{children}</>
}

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Feed page */}
        <Route path="/" element={
          <ProtectedRoute>
            <FeedPage />
          </ProtectedRoute>
        } />

        {/* User page */}
        <Route path="/:username/" element={
          <ProtectedRoute>
            <UserPage />
          </ProtectedRoute>
        } />

        {/* Post page */}
        <Route path="/p/:id/" element={<PostPage />} />

        {/* Login page */}
        <Route path="/login" element={<LoginPage />} />

        {/* Register page */}
        <Route path="/register" element={<RegisterPage />} /> 
      </Routes>
    </BrowserRouter>
  )
}

export default Router
