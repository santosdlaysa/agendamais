import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import axios from 'axios'
import { AuthProvider, useAuth } from '../../contexts/AuthContext'
import { mockApiResponse, mockApiError } from '../../utils/testUtils'

// Test component to use the auth context
const TestComponent = () => {
  const { 
    user, 
    loading, 
    isAuthenticated, 
    login, 
    logout, 
    register,
    getCurrentUser,
    changePassword
  } = useAuth()

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <div data-testid="auth-state">
        {isAuthenticated ? `Logged in as ${user?.name}` : 'Not logged in'}
      </div>
      <button onClick={() => login('test@example.com', 'password')}>
        Login
      </button>
      <button onClick={() => register('Test User', 'test@example.com', 'password')}>
        Register
      </button>
      <button onClick={logout}>
        Logout
      </button>
      <button onClick={getCurrentUser}>
        Get Current User
      </button>
      <button onClick={() => changePassword('old', 'new')}>
        Change Password
      </button>
    </div>
  )
}

describe('AuthContext Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('Initial State', () => {
    it('should start with loading state and then show not authenticated', async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      // Initially loading
      expect(screen.getByText('Loading...')).toBeInTheDocument()

      // After loading, should show not authenticated
      await waitFor(() => {
        expect(screen.getByTestId('auth-state')).toHaveTextContent('Not logged in')
      })
    })

    it('should restore user from localStorage if token exists', async () => {
      const user = { id: 1, name: 'Test User', email: 'test@example.com' }
      localStorage.setItem('token', 'test-token')
      localStorage.setItem('user', JSON.stringify(user))

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('auth-state')).toHaveTextContent('Logged in as Test User')
      })
    })

    it('should handle corrupted localStorage data gracefully', async () => {
      localStorage.setItem('token', 'test-token')
      localStorage.setItem('user', 'invalid-json')

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('auth-state')).toHaveTextContent('Not logged in')
        expect(localStorage.getItem('token')).toBeNull()
        expect(localStorage.getItem('user')).toBeNull()
      })
    })
  })

  describe('Login Functionality', () => {
    it('should login successfully and store user data', async () => {
      const user = { id: 1, name: 'Test User', email: 'test@example.com' }
      const token = 'access-token-123'
      
      axios.post.mockResolvedValue(mockApiResponse({
        access_token: token,
        user
      }))

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('auth-state')).toHaveTextContent('Not logged in')
      })

      const loginButton = screen.getByText('Login')
      fireEvent.click(loginButton)

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith('/auth/login', {
          email: 'test@example.com',
          password: 'password'
        })

        expect(screen.getByTestId('auth-state')).toHaveTextContent('Logged in as Test User')
        expect(localStorage.getItem('token')).toBe(token)
        expect(JSON.parse(localStorage.getItem('user'))).toEqual(user)
      })
    })

    it('should handle login errors', async () => {
      axios.post.mockRejectedValue(mockApiError('Invalid credentials', 401))

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('auth-state')).toHaveTextContent('Not logged in')
      })

      const loginButton = screen.getByText('Login')
      fireEvent.click(loginButton)

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalled()
        expect(screen.getByTestId('auth-state')).toHaveTextContent('Not logged in')
        expect(localStorage.getItem('token')).toBeNull()
      })
    })
  })

  describe('Register Functionality', () => {
    it('should register successfully', async () => {
      axios.post.mockResolvedValue(mockApiResponse({
        message: 'User created successfully'
      }))

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        const registerButton = screen.getByText('Register')
        fireEvent.click(registerButton)
      })

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith('/auth/register', {
          name: 'Test User',
          email: 'test@example.com',
          password: 'password'
        })
      })
    })

    it('should handle register errors', async () => {
      axios.post.mockRejectedValue(mockApiError('Email already exists', 400))

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        const registerButton = screen.getByText('Register')
        fireEvent.click(registerButton)
      })

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalled()
      })
    })
  })

  describe('Logout Functionality', () => {
    it('should logout and clear stored data', async () => {
      const user = { id: 1, name: 'Test User', email: 'test@example.com' }
      localStorage.setItem('token', 'test-token')
      localStorage.setItem('user', JSON.stringify(user))

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('auth-state')).toHaveTextContent('Logged in as Test User')
      })

      const logoutButton = screen.getByText('Logout')
      fireEvent.click(logoutButton)

      await waitFor(() => {
        expect(screen.getByTestId('auth-state')).toHaveTextContent('Not logged in')
        expect(localStorage.getItem('token')).toBeNull()
        expect(localStorage.getItem('user')).toBeNull()
      })
    })
  })

  describe('Get Current User', () => {
    it('should fetch and update current user data', async () => {
      const initialUser = { id: 1, name: 'Test User', email: 'test@example.com' }
      const updatedUser = { id: 1, name: 'Updated User', email: 'test@example.com' }
      
      localStorage.setItem('token', 'test-token')
      localStorage.setItem('user', JSON.stringify(initialUser))

      axios.get.mockResolvedValue(mockApiResponse({ user: updatedUser }))

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('auth-state')).toHaveTextContent('Logged in as Test User')
      })

      const getCurrentUserButton = screen.getByText('Get Current User')
      fireEvent.click(getCurrentUserButton)

      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith('/auth/me')
        expect(screen.getByTestId('auth-state')).toHaveTextContent('Logged in as Updated User')
        expect(JSON.parse(localStorage.getItem('user'))).toEqual(updatedUser)
      })
    })

    it('should logout user if getCurrentUser fails', async () => {
      const user = { id: 1, name: 'Test User', email: 'test@example.com' }
      localStorage.setItem('token', 'test-token')
      localStorage.setItem('user', JSON.stringify(user))

      axios.get.mockRejectedValue(mockApiError('Unauthorized', 401))

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('auth-state')).toHaveTextContent('Logged in as Test User')
      })

      const getCurrentUserButton = screen.getByText('Get Current User')
      fireEvent.click(getCurrentUserButton)

      await waitFor(() => {
        expect(screen.getByTestId('auth-state')).toHaveTextContent('Not logged in')
        expect(localStorage.getItem('token')).toBeNull()
        expect(localStorage.getItem('user')).toBeNull()
      })
    })
  })

  describe('Change Password', () => {
    it('should change password successfully', async () => {
      const user = { id: 1, name: 'Test User', email: 'test@example.com' }
      localStorage.setItem('token', 'test-token')
      localStorage.setItem('user', JSON.stringify(user))

      axios.post.mockResolvedValue(mockApiResponse({
        message: 'Password changed successfully'
      }))

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        const changePasswordButton = screen.getByText('Change Password')
        fireEvent.click(changePasswordButton)
      })

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith('/auth/change-password', {
          current_password: 'old',
          new_password: 'new'
        })
      })
    })

    it('should handle change password errors', async () => {
      const user = { id: 1, name: 'Test User', email: 'test@example.com' }
      localStorage.setItem('token', 'test-token')
      localStorage.setItem('user', JSON.stringify(user))

      axios.post.mockRejectedValue(mockApiError('Current password is incorrect', 400))

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        const changePasswordButton = screen.getByText('Change Password')
        fireEvent.click(changePasswordButton)
      })

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalled()
      })
    })
  })

  describe('Axios Interceptors', () => {
    it('should add authorization header to requests when token exists', async () => {
      localStorage.setItem('token', 'test-token')

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      // Test that the interceptor is working by making a request
      const mockRequest = { headers: {} }
      const interceptor = axios.interceptors.request.use.mock.calls[0][0]
      const result = interceptor(mockRequest)

      expect(result.headers.Authorization).toBe('Bearer test-token')
    })

    it('should not add authorization header when no token exists', async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      const mockRequest = { headers: {} }
      const interceptor = axios.interceptors.request.use.mock.calls[0][0]
      const result = interceptor(mockRequest)

      expect(result.headers.Authorization).toBeUndefined()
    })
  })

  describe('Context Error Handling', () => {
    it('should throw error when useAuth is used outside provider', () => {
      // Mock console.error to avoid test output pollution
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

      expect(() => {
        render(<TestComponent />)
      }).toThrow('useAuth deve ser usado dentro de um AuthProvider')

      consoleSpy.mockRestore()
    })
  })
})