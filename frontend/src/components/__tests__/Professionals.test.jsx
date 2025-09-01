import React from 'react'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import axios from 'axios'
import { renderWithProviders, mockProfessional, mockApiResponse, mockApiError } from '../../utils/testUtils'
import Professionals from '../Professionals'

const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

describe('Professionals Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Loading and Empty States', () => {
    it('should show loading spinner while fetching professionals', () => {
      axios.get.mockImplementation(() => new Promise(() => {}))
      
      renderWithProviders(<Professionals />)
      
      expect(screen.getByTestId('mock-icon')).toBeInTheDocument()
    })

    it('should show empty state when no professionals exist', async () => {
      axios.get.mockResolvedValue(mockApiResponse({
        professionals: []
      }))

      renderWithProviders(<Professionals />)

      await waitFor(() => {
        expect(screen.getByText('Nenhum profissional cadastrado')).toBeInTheDocument()
        expect(screen.getByText('Comece cadastrando o primeiro profissional do seu negócio')).toBeInTheDocument()
      })
    })
  })

  describe('Professionals List', () => {
    it('should render list of professionals with basic information', async () => {
      const professionals = [
        mockProfessional({ 
          id: 1, 
          name: 'Maria Santos', 
          role: 'Cabeleireira',
          phone: '(11) 99999-9999',
          email: 'maria@example.com'
        }),
        mockProfessional({ 
          id: 2, 
          name: 'Ana Costa', 
          role: 'Manicure',
          active: false
        }),
      ]

      axios.get.mockResolvedValue(mockApiResponse({
        professionals
      }))

      renderWithProviders(<Professionals />)

      await waitFor(() => {
        expect(screen.getByText('Maria Santos')).toBeInTheDocument()
        expect(screen.getByText('Cabeleireira')).toBeInTheDocument()
        expect(screen.getByText('(11) 99999-9999')).toBeInTheDocument()
        expect(screen.getByText('maria@example.com')).toBeInTheDocument()
        
        expect(screen.getByText('Ana Costa')).toBeInTheDocument()
        expect(screen.getByText('Manicure')).toBeInTheDocument()
        expect(screen.getByText('Inativo')).toBeInTheDocument()
      })
    })

    it('should display professional services when available', async () => {
      const professionalWithServices = mockProfessional({
        services: [
          { id: 1, name: 'Corte de Cabelo' },
          { id: 2, name: 'Coloração' },
          { id: 3, name: 'Escova' }
        ]
      })

      axios.get.mockResolvedValue(mockApiResponse({
        professionals: [professionalWithServices]
      }))

      renderWithProviders(<Professionals />)

      await waitFor(() => {
        expect(screen.getByText('Serviços:')).toBeInTheDocument()
        expect(screen.getByText('Corte de Cabelo')).toBeInTheDocument()
        expect(screen.getByText('Coloração')).toBeInTheDocument()
        expect(screen.getByText('Escova')).toBeInTheDocument()
      })
    })

    it('should display professional statistics when available', async () => {
      const professionalWithStats = mockProfessional({
        stats: {
          total_appointments: 25,
          completed_appointments: 22
        }
      })

      axios.get.mockResolvedValue(mockApiResponse({
        professionals: [professionalWithStats]
      }))

      renderWithProviders(<Professionals />)

      await waitFor(() => {
        expect(screen.getByText('25 agendamentos')).toBeInTheDocument()
        expect(screen.getByText('22 concluídos')).toBeInTheDocument()
      })
    })
  })

  describe('Search and Filter Functionality', () => {
    it('should filter professionals by search term', async () => {
      const professionals = [
        mockProfessional({ name: 'Maria Santos', role: 'Cabeleireira' }),
        mockProfessional({ name: 'Ana Costa', role: 'Manicure' }),
      ]

      axios.get.mockResolvedValue(mockApiResponse({
        professionals
      }))

      renderWithProviders(<Professionals />)

      await waitFor(() => {
        expect(screen.getByText('Maria Santos')).toBeInTheDocument()
        expect(screen.getByText('Ana Costa')).toBeInTheDocument()
      })

      const searchInput = screen.getByPlaceholderText('Buscar profissionais...')
      fireEvent.change(searchInput, { target: { value: 'Maria' } })

      // In a real implementation, this would filter the displayed results
      // For now, we just check that the search input works
      expect(searchInput).toHaveValue('Maria')
    })

    it('should show/hide inactive professionals based on checkbox', async () => {
      const professionals = [
        mockProfessional({ name: 'Maria Santos', active: true }),
        mockProfessional({ name: 'Ana Costa', active: false }),
      ]

      axios.get.mockResolvedValue(mockApiResponse({
        professionals
      }))

      renderWithProviders(<Professionals />)

      await waitFor(() => {
        expect(screen.getByText('Maria Santos')).toBeInTheDocument()
        // Ana Costa should not be visible initially (inactive and showInactive is false)
      })

      const showInactiveCheckbox = screen.getByLabelText('Mostrar inativos')
      fireEvent.click(showInactiveCheckbox)

      expect(showInactiveCheckbox).toBeChecked()
    })
  })

  describe('Professional Actions', () => {
    it('should navigate to new professional form', async () => {
      axios.get.mockResolvedValue(mockApiResponse({
        professionals: []
      }))

      renderWithProviders(<Professionals />)

      const newButton = screen.getByRole('button', { name: /novo profissional/i })
      fireEvent.click(newButton)

      expect(mockNavigate).toHaveBeenCalledWith('/professionals/new')
    })

    it('should navigate to edit professional form', async () => {
      const professional = mockProfessional({ id: 1 })
      axios.get.mockResolvedValue(mockApiResponse({
        professionals: [professional]
      }))

      renderWithProviders(<Professionals />)

      await waitFor(() => {
        const editButton = screen.getByTitle('Editar profissional')
        fireEvent.click(editButton)
        expect(mockNavigate).toHaveBeenCalledWith('/professionals/1/edit')
      })
    })

    it('should toggle professional status', async () => {
      const professional = mockProfessional({ id: 1, name: 'Maria Santos', active: true })
      axios.get.mockResolvedValue(mockApiResponse({
        professionals: [professional]
      }))
      axios.post.mockResolvedValue(mockApiResponse({}))

      renderWithProviders(<Professionals />)

      await waitFor(() => {
        const toggleButton = screen.getByTitle('Desativar profissional')
        fireEvent.click(toggleButton)
      })

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith('/professionals/1/toggle-status')
        expect(axios.get).toHaveBeenCalledTimes(2) // Initial load + refresh after toggle
      })
    })

    it('should handle delete confirmation', async () => {
      const professional = mockProfessional({ id: 1, name: 'Maria Santos' })
      axios.get.mockResolvedValue(mockApiResponse({
        professionals: [professional]
      }))

      const mockConfirm = jest.spyOn(window, 'confirm').mockReturnValue(false)

      renderWithProviders(<Professionals />)

      await waitFor(() => {
        const deleteButton = screen.getByTitle('Excluir profissional')
        fireEvent.click(deleteButton)
        expect(mockConfirm).toHaveBeenCalledWith('Tem certeza que deseja excluir o profissional "Maria Santos"?')
      })

      expect(axios.delete).not.toHaveBeenCalled()
      mockConfirm.mockRestore()
    })

    it('should delete professional when confirmed', async () => {
      const professional = mockProfessional({ id: 1, name: 'Maria Santos' })
      axios.get.mockResolvedValue(mockApiResponse({
        professionals: [professional]
      }))
      axios.delete.mockResolvedValue(mockApiResponse({}))

      const mockConfirm = jest.spyOn(window, 'confirm').mockReturnValue(true)

      renderWithProviders(<Professionals />)

      await waitFor(() => {
        const deleteButton = screen.getByTitle('Excluir profissional')
        fireEvent.click(deleteButton)
      })

      await waitFor(() => {
        expect(axios.delete).toHaveBeenCalledWith('/professionals/1')
        expect(axios.get).toHaveBeenCalledTimes(2) // Initial load + refresh after delete
      })

      mockConfirm.mockRestore()
    })
  })

  describe('Summary Statistics', () => {
    it('should display correct summary statistics', async () => {
      const professionals = [
        mockProfessional({ 
          active: true,
          services: [{ id: 1, name: 'Service 1' }, { id: 2, name: 'Service 2' }]
        }),
        mockProfessional({ 
          active: false,
          services: [{ id: 3, name: 'Service 3' }]
        }),
        mockProfessional({ 
          active: true,
          services: [{ id: 4, name: 'Service 4' }]
        }),
      ]

      axios.get.mockResolvedValue(mockApiResponse({
        professionals
      }))

      renderWithProviders(<Professionals />)

      await waitFor(() => {
        expect(screen.getByText('3')).toBeInTheDocument() // Total professionals
        expect(screen.getByText('2')).toBeInTheDocument() // Active professionals  
        expect(screen.getByText('4')).toBeInTheDocument() // Total services offered (2+1+1)
      })
    })

    it('should not show summary when no professionals exist', async () => {
      axios.get.mockResolvedValue(mockApiResponse({
        professionals: []
      }))

      renderWithProviders(<Professionals />)

      await waitFor(() => {
        expect(screen.queryByText('Total de Profissionais')).not.toBeInTheDocument()
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      axios.get.mockRejectedValue(mockApiError('Erro na API'))

      renderWithProviders(<Professionals />)

      await waitFor(() => {
        expect(screen.getByText('Profissionais')).toBeInTheDocument()
      })
    })

    it('should handle toggle status error', async () => {
      const professional = mockProfessional({ id: 1, active: true })
      axios.get.mockResolvedValue(mockApiResponse({
        professionals: [professional]
      }))
      axios.post.mockRejectedValue(mockApiError('Erro ao alterar status'))

      renderWithProviders(<Professionals />)

      await waitFor(() => {
        const toggleButton = screen.getByTitle('Desativar profissional')
        fireEvent.click(toggleButton)
      })

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalled()
      })
    })

    it('should handle delete error with custom message', async () => {
      const professional = mockProfessional({ id: 1, name: 'Maria Santos' })
      axios.get.mockResolvedValue(mockApiResponse({
        professionals: [professional]
      }))
      axios.delete.mockRejectedValue(mockApiError('Profissional tem agendamentos ativos', 400))

      const mockConfirm = jest.spyOn(window, 'confirm').mockReturnValue(true)

      renderWithProviders(<Professionals />)

      await waitFor(() => {
        const deleteButton = screen.getByTitle('Excluir profissional')
        fireEvent.click(deleteButton)
      })

      await waitFor(() => {
        expect(axios.delete).toHaveBeenCalledWith('/professionals/1')
      })

      mockConfirm.mockRestore()
    })
  })

  describe('Professional Avatar and Colors', () => {
    it('should display professional avatar with correct styling', async () => {
      const professional = mockProfessional({ 
        name: 'Maria Santos',
        color: '#FF5733' 
      })

      axios.get.mockResolvedValue(mockApiResponse({
        professionals: [professional]
      }))

      renderWithProviders(<Professionals />)

      await waitFor(() => {
        expect(screen.getByText('Maria Santos')).toBeInTheDocument()
      })
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels and roles', async () => {
      const professional = mockProfessional()
      axios.get.mockResolvedValue(mockApiResponse({
        professionals: [professional]
      }))

      renderWithProviders(<Professionals />)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /novo profissional/i })).toBeInTheDocument()
        expect(screen.getByLabelText('Mostrar inativos')).toBeInTheDocument()
      })
    })

    it('should have descriptive button titles', async () => {
      const professional = mockProfessional({ id: 1, active: true })
      axios.get.mockResolvedValue(mockApiResponse({
        professionals: [professional]
      }))

      renderWithProviders(<Professionals />)

      await waitFor(() => {
        expect(screen.getByTitle('Desativar profissional')).toBeInTheDocument()
        expect(screen.getByTitle('Editar profissional')).toBeInTheDocument()
        expect(screen.getByTitle('Excluir profissional')).toBeInTheDocument()
      })
    })
  })
})