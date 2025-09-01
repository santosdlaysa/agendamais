import React from 'react'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../contexts/AuthContext'

// Mock AuthContext for tests
const MockAuthProvider = ({ children }) => {
  const mockValue = {
    user: { id: 1, name: 'Test User', email: 'test@example.com' },
    loading: false,
    isAuthenticated: true,
    login: jest.fn(),
    logout: jest.fn(),
    register: jest.fn(),
    getCurrentUser: jest.fn(),
    changePassword: jest.fn(),
  }

  return (
    <AuthProvider value={mockValue}>
      {children}
    </AuthProvider>
  )
}

// Custom render function that includes providers
export const renderWithProviders = (ui, options = {}) => {
  const Wrapper = ({ children }) => (
    <BrowserRouter>
      <MockAuthProvider>
        {children}
      </MockAuthProvider>
    </BrowserRouter>
  )

  return render(ui, { wrapper: Wrapper, ...options })
}

// Mock data generators
export const mockClient = (overrides = {}) => ({
  id: 1,
  name: 'João Silva',
  phone: '(11) 99999-9999',
  email: 'joao@example.com',
  notes: 'Cliente regular',
  created_at: '2024-01-01T00:00:00Z',
  stats: {
    total_appointments: 5,
    completed_appointments: 4,
    last_appointment_date: '2024-01-15',
  },
  ...overrides,
})

export const mockProfessional = (overrides = {}) => ({
  id: 1,
  name: 'Maria Santos',
  role: 'Cabeleireira',
  phone: '(11) 88888-8888',
  email: 'maria@example.com',
  color: '#3B82F6',
  active: true,
  services: [
    { id: 1, name: 'Corte de Cabelo', price: 50.00 },
    { id: 2, name: 'Coloração', price: 120.00 },
  ],
  stats: {
    total_appointments: 10,
    completed_appointments: 8,
  },
  ...overrides,
})

export const mockService = (overrides = {}) => ({
  id: 1,
  name: 'Corte de Cabelo',
  description: 'Corte moderno e personalizado',
  price: 50.00,
  duration: 60,
  active: true,
  professionals: [
    { id: 1, name: 'Maria Santos' },
    { id: 2, name: 'Ana Costa' },
  ],
  ...overrides,
})

export const mockAppointment = (overrides = {}) => ({
  id: 1,
  client: { id: 1, name: 'João Silva' },
  professional: { id: 1, name: 'Maria Santos', color: '#3B82F6' },
  service: { id: 1, name: 'Corte de Cabelo', price: 50.00, duration: 60 },
  appointment_date: '2024-12-20',
  start_time: '14:00:00',
  end_time: '15:00:00',
  status: 'scheduled',
  price: 50.00,
  notes: 'Cliente prefere corte mais curto',
  ...overrides,
})

// Mock API responses
export const mockApiResponse = (data, status = 200) => ({
  data,
  status,
  statusText: 'OK',
  headers: {},
  config: {},
})

export const mockApiError = (message = 'API Error', status = 500) => {
  const error = new Error(message)
  error.response = {
    data: { message },
    status,
    statusText: status === 404 ? 'Not Found' : 'Internal Server Error',
  }
  return error
}

// Wait utilities
export const waitForLoadingToFinish = () => 
  new Promise(resolve => setTimeout(resolve, 0))

// Form test utilities
export const fillAndSubmitForm = async (getByLabelText, getByRole, formData) => {
  Object.entries(formData).forEach(([key, value]) => {
    const field = getByLabelText(new RegExp(key, 'i'))
    fireEvent.change(field, { target: { value } })
  })
  
  const submitButton = getByRole('button', { name: /salvar|criar|atualizar/i })
  fireEvent.click(submitButton)
}