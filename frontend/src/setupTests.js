import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'

// Mock axios
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: {} })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
  put: jest.fn(() => Promise.resolve({ data: {} })),
  delete: jest.fn(() => Promise.resolve({ data: {} })),
  create: jest.fn(() => ({
    get: jest.fn(() => Promise.resolve({ data: {} })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
    put: jest.fn(() => Promise.resolve({ data: {} })),
    delete: jest.fn(() => Promise.resolve({ data: {} })),
    interceptors: {
      request: {
        use: jest.fn(),
        eject: jest.fn(),
      },
      response: {
        use: jest.fn(),
        eject: jest.fn(),
      },
    },
  })),
  defaults: {
    baseURL: '',
  },
  interceptors: {
    request: {
      use: jest.fn(),
      eject: jest.fn(),
    },
    response: {
      use: jest.fn(),
      eject: jest.fn(),
    },
  },
}))

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
  loading: jest.fn(),
  dismiss: jest.fn(),
  toast: jest.fn(),
  default: {
    success: jest.fn(),
    error: jest.fn(),
    loading: jest.fn(),
    dismiss: jest.fn(),
  },
}))

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useParams: () => ({}),
  useLocation: () => ({ pathname: '/' }),
}))

// Mock Lucide React icons
jest.mock('lucide-react', () => {
  const mockIcon = (props) => {
    const React = require('react')
    return React.createElement('svg', { ...props, 'data-testid': 'mock-icon' })
  }

  return {
    ArrowLeft: mockIcon,
    Calendar: mockIcon,
    Clock: mockIcon,
    Users: mockIcon,
    User: mockIcon,
    UserCheck: mockIcon,
    Briefcase: mockIcon,
    DollarSign: mockIcon,
    Edit: mockIcon,
    Trash2: mockIcon,
    Plus: mockIcon,
    Search: mockIcon,
    Save: mockIcon,
    X: mockIcon,
    Phone: mockIcon,
    Mail: mockIcon,
    FileText: mockIcon,
    Eye: mockIcon,
    EyeOff: mockIcon,
    TrendingUp: mockIcon,
    LogOut: mockIcon,
    Filter: mockIcon,
    CheckCircle: mockIcon,
    XCircle: mockIcon,
    AlertTriangle: mockIcon,
    AlertCircle: mockIcon,
    MoreVertical: mockIcon,
    Palette: mockIcon,
  }
})

// Cleanup after each test case
afterEach(() => {
  cleanup()
})