import { Routes, Route, Navigate } from 'react-router-dom'
import FeedPage from './pages/FeedPage'
import UserPage from './pages/UserPage'
import PostPage from './pages/PostPage'
import type { ReactNode } from 'react'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import { useAuth } from './hooks/use-auth'
import AccountEditPage from './pages/AccountEditPage'

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    // TODO: skeleton loader
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

const Router = () => {
  return (
    <Routes>
      {/* Feed page */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <FeedPage />
          </ProtectedRoute>
        }
      />

      {/* Login page */}
      <Route path="/login" element={<LoginPage />} />

      {/* Register page */}
      <Route path="/register" element={<RegisterPage />} />

      {/* User page */}
      <Route
        path="/:username/"
        element={
          <ProtectedRoute>
            <UserPage />
          </ProtectedRoute>
        }
      />

      {/* Account edit */}
      <Route
        path="/account/edit"
        element={
          <ProtectedRoute>
            <AccountEditPage />
          </ProtectedRoute>
        }
      />

      {/* Post page */}
      <Route
        path="/p/:id/"
        element={
          <ProtectedRoute>
            <PostPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default Router
