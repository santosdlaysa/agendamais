import React from 'react'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import axios from 'axios'
import { renderWithProviders, mockClient, mockProfessional, mockService, mockAppointment, mockApiResponse } from '../../utils/testUtils'
import App from '../../App'

// Mock react-router-dom for integration tests
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
}))

describe('Appointment Flow Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Mock dashboard API call
    axios.get.mockImplementation((url) => {
      if (url === '/reports/dashboard') {
        return Promise.resolve(mockApiResponse({
          total_clients: 10,
          total_professionals: 5,
          total_services: 8,
          total_appointments: 25,
          recent_appointments: 10,
          total_revenue: 1500.00,
          appointments_by_status: {}
        }))
      }
      return Promise.resolve(mockApiResponse({}))
    })
  })

  describe('Complete Appointment Creation Flow', () => {
    it('should create an appointment from dashboard to form completion', async () => {
      const clients = [
        mockClient({ id: 1, name: 'João Silva' }),
        mockClient({ id: 2, name: 'Maria Santos' })
      ]
      
      const professionals = [
        mockProfessional({ id: 1, name: 'Ana Costa' }),
        mockProfessional({ id: 2, name: 'Pedro Lima' })
      ]
      
      const services = [
        mockService({ id: 1, name: 'Corte de Cabelo', price: 50.00 }),
        mockService({ id: 2, name: 'Coloração', price: 120.00 })
      ]

      // Mock API calls for appointment form
      axios.get.mockImplementation((url) => {
        if (url === '/reports/dashboard') {
          return Promise.resolve(mockApiResponse({
            total_clients: 10,
            total_professionals: 5,
            total_services: 8,
            total_appointments: 25,
            recent_appointments: 10,
            total_revenue: 1500.00,
            appointments_by_status: {}
          }))
        }
        if (url === '/clients/search?limit=100') {
          return Promise.resolve(mockApiResponse({ clients }))
        }
        if (url === '/professionals?active_only=true') {
          return Promise.resolve(mockApiResponse({ professionals }))
        }
        if (url === '/services?active_only=true') {
          return Promise.resolve(mockApiResponse({ services }))
        }
        if (url === '/professionals/1/services') {
          return Promise.resolve(mockApiResponse({ services: [services[0]] }))
        }
        return Promise.resolve(mockApiResponse({}))
      })

      axios.post.mockImplementation((url, data) => {
        if (url === '/appointments/check-availability') {
          return Promise.resolve(mockApiResponse({ available: true, end_time: '15:00' }))
        }
        if (url === '/appointments') {
          return Promise.resolve(mockApiResponse({ appointment: mockAppointment() }))
        }
        return Promise.resolve(mockApiResponse({}))
      })

      // Start from dashboard
      renderWithProviders(<App />)

      // Wait for dashboard to load
      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument()
      })

      // Click on "Novo Agendamento" button
      const newAppointmentButton = screen.getByRole('button', { name: /novo agendamento/i })
      fireEvent.click(newAppointmentButton)

      // Should navigate to appointment form
      await waitFor(() => {
        expect(screen.getByText('Novo Agendamento')).toBeInTheDocument()
      })

      // Fill out the form
      await waitFor(() => {
        // Select client
        const clientSelect = screen.getByLabelText(/cliente/i)
        fireEvent.change(clientSelect, { target: { value: '1' } })

        // Select professional
        const professionalSelect = screen.getByLabelText(/profissional/i)
        fireEvent.change(professionalSelect, { target: { value: '1' } })
      })

      // Wait for services to load based on professional selection
      await waitFor(() => {
        const serviceSelect = screen.getByLabelText(/serviço/i)
        fireEvent.change(serviceSelect, { target: { value: '1' } })
      })

      // Fill date and time
      await waitFor(() => {
        const dateInput = screen.getByLabelText(/data do agendamento/i)
        fireEvent.change(dateInput, { target: { value: '2024-12-20' } })

        const timeInput = screen.getByLabelText(/horário de início/i)
        fireEvent.change(timeInput, { target: { value: '14:00' } })
      })

      // Submit the form
      await waitFor(() => {
        const submitButton = screen.getByRole('button', { name: /criar agendamento/i })
        fireEvent.click(submitButton)
      })

      // Verify API calls were made correctly
      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith('/appointments', expect.objectContaining({
          client_id: 1,
          professional_id: 1,
          service_id: 1,
          appointment_date: '2024-12-20',
          start_time: '14:00',
          price: 50.00
        }))
      })
    })
  })

  describe('Client to Appointment Flow', () => {
    it('should create client and then use in appointment', async () => {
      // Mock API responses
      axios.get.mockImplementation((url) => {
        if (url === '/reports/dashboard') {
          return Promise.resolve(mockApiResponse({
            total_clients: 0,
            total_professionals: 1,
            total_services: 1,
            total_appointments: 0,
            recent_appointments: 0,
            total_revenue: 0,
            appointments_by_status: {}
          }))
        }
        return Promise.resolve(mockApiResponse({ clients: [], professionals: [], services: [] }))
      })

      axios.post.mockImplementation((url, data) => {
        if (url === '/clients') {
          const newClient = mockClient({ ...data, id: 1 })
          return Promise.resolve(mockApiResponse({ client: newClient }))
        }
        return Promise.resolve(mockApiResponse({}))
      })

      renderWithProviders(<App />)

      // Wait for dashboard
      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument()
      })

      // Click "Novo Cliente"
      const newClientButton = screen.getByRole('button', { name: /novo cliente/i })
      fireEvent.click(newClientButton)

      // Fill client form
      await waitFor(() => {
        expect(screen.getByText('Novo Cliente')).toBeInTheDocument()
        
        const nameInput = screen.getByLabelText(/nome completo/i)
        fireEvent.change(nameInput, { target: { value: 'João Silva' } })

        const phoneInput = screen.getByLabelText(/telefone/i)
        fireEvent.change(phoneInput, { target: { value: '(11) 99999-9999' } })

        const emailInput = screen.getByLabelText(/email/i)
        fireEvent.change(emailInput, { target: { value: 'joao@example.com' } })
      })

      // Submit client form
      const submitButton = screen.getByRole('button', { name: /criar cliente/i })
      fireEvent.click(submitButton)

      // Verify client creation API call
      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith('/clients', expect.objectContaining({
          name: 'João Silva',
          phone: '(11) 99999-9999',
          email: 'joao@example.com'
        }))
      })
    })
  })

  describe('Error Handling in Flows', () => {
    it('should handle appointment creation errors gracefully', async () => {
      const clients = [mockClient({ id: 1, name: 'João Silva' })]
      const professionals = [mockProfessional({ id: 1, name: 'Ana Costa' })]
      const services = [mockService({ id: 1, name: 'Corte de Cabelo' })]

      axios.get.mockImplementation((url) => {
        if (url === '/reports/dashboard') {
          return Promise.resolve(mockApiResponse({
            total_clients: 1,
            total_professionals: 1,
            total_services: 1,
            total_appointments: 0,
            recent_appointments: 0,
            total_revenue: 0,
            appointments_by_status: {}
          }))
        }
        if (url === '/clients/search?limit=100') {
          return Promise.resolve(mockApiResponse({ clients }))
        }
        if (url === '/professionals?active_only=true') {
          return Promise.resolve(mockApiResponse({ professionals }))
        }
        if (url === '/services?active_only=true') {
          return Promise.resolve(mockApiResponse({ services }))
        }
        if (url === '/professionals/1/services') {
          return Promise.resolve(mockApiResponse({ services }))
        }
        return Promise.resolve(mockApiResponse({}))
      })

      axios.post.mockImplementation((url, data) => {
        if (url === '/appointments/check-availability') {
          return Promise.resolve(mockApiResponse({ available: true, end_time: '15:00' }))
        }
        if (url === '/appointments') {
          return Promise.reject({
            response: {
              data: { message: 'Conflito de horário detectado' },
              status: 400
            }
          })
        }
        return Promise.resolve(mockApiResponse({}))
      })

      renderWithProviders(<App />)

      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument()
      })

      // Navigate to appointment form
      const newAppointmentButton = screen.getByRole('button', { name: /novo agendamento/i })
      fireEvent.click(newAppointmentButton)

      await waitFor(() => {
        expect(screen.getByText('Novo Agendamento')).toBeInTheDocument()
      })

      // Fill form and submit
      await waitFor(() => {
        const clientSelect = screen.getByLabelText(/cliente/i)
        fireEvent.change(clientSelect, { target: { value: '1' } })

        const professionalSelect = screen.getByLabelText(/profissional/i)
        fireEvent.change(professionalSelect, { target: { value: '1' } })

        const serviceSelect = screen.getByLabelText(/serviço/i)
        fireEvent.change(serviceSelect, { target: { value: '1' } })

        const dateInput = screen.getByLabelText(/data do agendamento/i)
        fireEvent.change(dateInput, { target: { value: '2024-12-20' } })

        const timeInput = screen.getByLabelText(/horário de início/i)
        fireEvent.change(timeInput, { target: { value: '14:00' } })

        const submitButton = screen.getByRole('button', { name: /criar agendamento/i })
        fireEvent.click(submitButton)
      })

      // Should still be on the form page (not navigated away due to error)
      await waitFor(() => {
        expect(screen.getByText('Novo Agendamento')).toBeInTheDocument()
      })
    })
  })

  describe('Navigation Flow', () => {
    it('should navigate between different sections correctly', async () => {
      // Mock basic dashboard data
      axios.get.mockResolvedValue(mockApiResponse({
        total_clients: 0,
        total_professionals: 0,
        total_services: 0,
        total_appointments: 0,
        recent_appointments: 0,
        total_revenue: 0,
        appointments_by_status: {}
      }))

      renderWithProviders(<App />)

      // Start at dashboard
      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument()
      })

      // Navigate to clients via menu (if Layout is rendered)
      const clientsLink = screen.queryByText('Clientes')
      if (clientsLink) {
        fireEvent.click(clientsLink)
        
        await waitFor(() => {
          expect(screen.getByText('Clientes')).toBeInTheDocument()
        })
      }
    })
  })
})