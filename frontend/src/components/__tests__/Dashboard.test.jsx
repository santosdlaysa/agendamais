import React from 'react'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import axios from 'axios'
import { renderWithProviders, mockApiResponse, mockApiError } from '../../utils/testUtils'
import Dashboard from '../Dashboard'

const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

describe('Dashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Loading State', () => {
    it('should show loading spinner while fetching dashboard data', () => {
      axios.get.mockImplementation(() => new Promise(() => {}))
      
      renderWithProviders(<Dashboard />)
      
      const spinner = document.querySelector('.animate-spin')
      expect(spinner).toBeInTheDocument()
      expect(spinner).toHaveClass('rounded-full', 'h-16', 'w-16', 'border-b-2', 'border-periwinkle-600')
    })
  })

  describe('Dashboard Statistics', () => {
    it('should display all statistics cards with correct data', async () => {
      const dashboardData = {
        total_clients: 45,
        total_professionals: 8,
        total_services: 12,
        total_appointments: 156,
        recent_appointments: 23,
        total_revenue: 4750.50,
        appointments_by_status: {
          scheduled: 12,
          completed: 8,
          cancelled: 3
        }
      }

      axios.get.mockResolvedValue(mockApiResponse(dashboardData))

      renderWithProviders(<Dashboard />)

      await waitFor(() => {
        expect(screen.getByText('45')).toBeInTheDocument() // Total clients
        expect(screen.getAllByText('8')).toHaveLength(2) // Professionals and completed appointments
        expect(screen.getAllByText('12')).toHaveLength(2) // Services count appears in both cards and status
        expect(screen.getByText('156')).toBeInTheDocument() // Total appointments
        expect(screen.getByText('23')).toBeInTheDocument() // Recent appointments
        expect(screen.getByText('R$ 4750.50')).toBeInTheDocument() // Revenue
      })

      // Check card titles
      expect(screen.getByText('Total de Clientes')).toBeInTheDocument()
      expect(screen.getByText('Profissionais')).toBeInTheDocument()
      expect(screen.getByText('Serviços')).toBeInTheDocument()
      expect(screen.getByText('Agendamentos')).toBeInTheDocument()
      expect(screen.getByText('Últimos 30 dias')).toBeInTheDocument()
      expect(screen.getByText('Receita Total')).toBeInTheDocument()
    })

    it('should handle zero values correctly', async () => {
      const emptyDashboard = {
        total_clients: 0,
        total_professionals: 0,
        total_services: 0,
        total_appointments: 0,
        recent_appointments: 0,
        total_revenue: 0,
        appointments_by_status: {}
      }

      axios.get.mockResolvedValue(mockApiResponse(emptyDashboard))

      renderWithProviders(<Dashboard />)

      await waitFor(() => {
        const zeroValues = screen.getAllByText('0')
        expect(zeroValues.length).toBeGreaterThanOrEqual(5) // At least 5 zero values
        expect(screen.getByText('R$ 0.00')).toBeInTheDocument()
      })
    })
  })

  describe('Status Overview', () => {
    it('should display appointments by status when data is available', async () => {
      const dashboardData = {
        total_clients: 10,
        total_professionals: 5,
        total_services: 8,
        total_appointments: 25,
        recent_appointments: 10,
        total_revenue: 1500.00,
        appointments_by_status: {
          scheduled: 12,
          completed: 8,
          cancelled: 3
        }
      }

      axios.get.mockResolvedValue(mockApiResponse(dashboardData))

      renderWithProviders(<Dashboard />)

      await waitFor(() => {
        expect(screen.getByText('Agendamentos por Status')).toBeInTheDocument()
        // Check status counts in the status overview section
        const statusSection = screen.getByText('Agendamentos por Status').closest('div')
        expect(statusSection).toHaveTextContent('12') // Scheduled count
        expect(statusSection).toHaveTextContent('8') // Completed count
        expect(statusSection).toHaveTextContent('3') // Cancelled count
        
        expect(screen.getByText('Agendados')).toBeInTheDocument()
        expect(screen.getByText('Concluídos')).toBeInTheDocument()
        expect(screen.getByText('Cancelados')).toBeInTheDocument()
      })
    })

    it('should not show status overview when no status data exists', async () => {
      const dashboardData = {
        total_clients: 10,
        total_professionals: 5,
        total_services: 8,
        total_appointments: 25,
        recent_appointments: 10,
        total_revenue: 1500.00,
        appointments_by_status: {}
      }

      axios.get.mockResolvedValue(mockApiResponse(dashboardData))

      renderWithProviders(<Dashboard />)

      await waitFor(() => {
        expect(screen.queryByText('Agendamentos por Status')).not.toBeInTheDocument()
      })
    })
  })

  describe('Quick Actions', () => {
    beforeEach(() => {
      const dashboardData = {
        total_clients: 10,
        total_professionals: 5,
        total_services: 8,
        total_appointments: 25,
        recent_appointments: 10,
        total_revenue: 1500.00,
        appointments_by_status: {}
      }

      axios.get.mockResolvedValue(mockApiResponse(dashboardData))
    })

    it('should display all quick action buttons', async () => {
      renderWithProviders(<Dashboard />)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /novo cliente/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /novo profissional/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /novo serviço/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /novo agendamento/i })).toBeInTheDocument()
      })
    })

    it('should navigate to clients form when "Novo Cliente" is clicked', async () => {
      renderWithProviders(<Dashboard />)

      await waitFor(() => {
        const newClientButton = screen.getByRole('button', { name: /novo cliente/i })
        fireEvent.click(newClientButton)
        expect(mockNavigate).toHaveBeenCalledWith('/clients/new')
      })
    })

    it('should navigate to professionals form when "Novo Profissional" is clicked', async () => {
      renderWithProviders(<Dashboard />)

      await waitFor(() => {
        const newProfessionalButton = screen.getByRole('button', { name: /novo profissional/i })
        fireEvent.click(newProfessionalButton)
        expect(mockNavigate).toHaveBeenCalledWith('/professionals/new')
      })
    })

    it('should navigate to services form when "Novo Serviço" is clicked', async () => {
      renderWithProviders(<Dashboard />)

      await waitFor(() => {
        const newServiceButton = screen.getByRole('button', { name: /novo serviço/i })
        fireEvent.click(newServiceButton)
        expect(mockNavigate).toHaveBeenCalledWith('/services/new')
      })
    })

    it('should navigate to appointments form when "Novo Agendamento" is clicked', async () => {
      renderWithProviders(<Dashboard />)

      await waitFor(() => {
        const newAppointmentButton = screen.getByRole('button', { name: /novo agendamento/i })
        fireEvent.click(newAppointmentButton)
        expect(mockNavigate).toHaveBeenCalledWith('/appointments/new')
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      axios.get.mockRejectedValue(mockApiError('Erro na API'))

      renderWithProviders(<Dashboard />)

      await waitFor(() => {
        // Dashboard should still render the title even on error
        expect(screen.getByText('Dashboard')).toBeInTheDocument()
        expect(screen.getByText('Visão geral do sistema de agendamento')).toBeInTheDocument()
      })

      // Should still show action buttons
      expect(screen.getByRole('button', { name: /novo cliente/i })).toBeInTheDocument()
    })

    it('should display default values when API returns invalid data', async () => {
      axios.get.mockResolvedValue(mockApiResponse({
        // Missing some required fields
        total_clients: undefined,
        total_professionals: null,
        appointments_by_status: null
      }))

      renderWithProviders(<Dashboard />)

      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument()
        // Should handle undefined/null values without crashing
      })
    })
  })

  describe('Revenue Formatting', () => {
    it('should format revenue correctly with decimal places', async () => {
      const testCases = [
        { revenue: 1234.56, expected: 'R$ 1234.56' },
        { revenue: 1000, expected: 'R$ 1000.00' },
        { revenue: 0.99, expected: 'R$ 0.99' },
        { revenue: 10000.1, expected: 'R$ 10000.10' },
      ]

      for (const testCase of testCases) {
        const dashboardData = {
          total_clients: 0,
          total_professionals: 0,
          total_services: 0,
          total_appointments: 0,
          recent_appointments: 0,
          total_revenue: testCase.revenue,
          appointments_by_status: {}
        }

        axios.get.mockResolvedValue(mockApiResponse(dashboardData))

        const { unmount } = renderWithProviders(<Dashboard />)

        await waitFor(() => {
          expect(screen.getByText(testCase.expected)).toBeInTheDocument()
        })

        unmount()
      }
    })
  })

  describe('Component Structure', () => {
    it('should have proper heading structure', async () => {
      const dashboardData = {
        total_clients: 10,
        total_professionals: 5,
        total_services: 8,
        total_appointments: 25,
        recent_appointments: 10,
        total_revenue: 1500.00,
        appointments_by_status: {
          scheduled: 5,
          completed: 3
        }
      }

      axios.get.mockResolvedValue(mockApiResponse(dashboardData))

      renderWithProviders(<Dashboard />)

      await waitFor(() => {
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Dashboard')
        expect(screen.getByRole('heading', { level: 3, name: /ações rápidas/i })).toBeInTheDocument()
        expect(screen.getByRole('heading', { level: 3, name: /agendamentos por status/i })).toBeInTheDocument()
      })
    })

    it('should have proper section organization', async () => {
      const dashboardData = {
        total_clients: 10,
        total_professionals: 5,
        total_services: 8,
        total_appointments: 25,
        recent_appointments: 10,
        total_revenue: 1500.00,
        appointments_by_status: {}
      }

      axios.get.mockResolvedValue(mockApiResponse(dashboardData))

      renderWithProviders(<Dashboard />)

      await waitFor(() => {
        // Check that all main sections are present
        expect(screen.getByText('Dashboard')).toBeInTheDocument()
        expect(screen.getByText('Visão geral do sistema de agendamento')).toBeInTheDocument()
        expect(screen.getByText('Ações Rápidas')).toBeInTheDocument()
      })
    })
  })

  describe('Data Fetching', () => {
    it('should call the correct API endpoint', async () => {
      const dashboardData = {
        total_clients: 10,
        total_professionals: 5,
        total_services: 8,
        total_appointments: 25,
        recent_appointments: 10,
        total_revenue: 1500.00,
        appointments_by_status: {}
      }

      axios.get.mockResolvedValue(mockApiResponse(dashboardData))

      renderWithProviders(<Dashboard />)

      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith('/reports/dashboard')
      })
    })

    it('should only fetch data once on component mount', async () => {
      const dashboardData = {
        total_clients: 10,
        total_professionals: 5,
        total_services: 8,
        total_appointments: 25,
        recent_appointments: 10,
        total_revenue: 1500.00,
        appointments_by_status: {}
      }

      axios.get.mockResolvedValue(mockApiResponse(dashboardData))

      renderWithProviders(<Dashboard />)

      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument()
      })

      expect(axios.get).toHaveBeenCalledTimes(1)
    })
  })

  describe('Accessibility', () => {
    it('should have proper button labels and roles', async () => {
      const dashboardData = {
        total_clients: 10,
        total_professionals: 5,
        total_services: 8,
        total_appointments: 25,
        recent_appointments: 10,
        total_revenue: 1500.00,
        appointments_by_status: {}
      }

      axios.get.mockResolvedValue(mockApiResponse(dashboardData))

      renderWithProviders(<Dashboard />)

      await waitFor(() => {
        const buttons = screen.getAllByRole('button')
        expect(buttons.length).toBe(4) // 4 quick action buttons

        buttons.forEach(button => {
          expect(button).toHaveTextContent(/novo/i)
        })
      })
    })

    it('should have meaningful text content for screen readers', async () => {
      const dashboardData = {
        total_clients: 10,
        total_professionals: 5,
        total_services: 8,
        total_appointments: 25,
        recent_appointments: 10,
        total_revenue: 1500.00,
        appointments_by_status: {
          scheduled: 5,
          completed: 3,
          cancelled: 1
        }
      }

      axios.get.mockResolvedValue(mockApiResponse(dashboardData))

      renderWithProviders(<Dashboard />)

      await waitFor(() => {
        // Statistics should have descriptive labels
        expect(screen.getByText('Total de Clientes')).toBeInTheDocument()
        expect(screen.getByText('Profissionais')).toBeInTheDocument()
        expect(screen.getByText('Serviços')).toBeInTheDocument()
        expect(screen.getByText('Agendamentos')).toBeInTheDocument()
        expect(screen.getByText('Receita Total')).toBeInTheDocument()
      })
    })
  })
})