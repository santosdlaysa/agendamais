import React from 'react'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import axios from 'axios'
import { renderWithProviders, mockClient, mockApiResponse, mockApiError } from '../../utils/testUtils'
import Clients from '../Clients'

// Mock the useNavigate hook
const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

describe('Clients Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Loading State', () => {
    it('should show loading spinner while fetching clients', () => {
      axios.get.mockImplementation(() => new Promise(() => {}))
      
      renderWithProviders(<Clients />)
      
      expect(screen.getByTestId('mock-icon')).toBeInTheDocument()
    })
  })

  describe('Empty State', () => {
    it('should show empty state when no clients exist', async () => {
      axios.get.mockResolvedValue(mockApiResponse({
        clients: [],
        pagination: { page: 1, pages: 1, total: 0 }
      }))

      renderWithProviders(<Clients />)

      await waitFor(() => {
        expect(screen.getByText('Nenhum cliente cadastrado')).toBeInTheDocument()
        expect(screen.getByText('Comece cadastrando o primeiro cliente do seu negócio')).toBeInTheDocument()
      })
    })

    it('should show "not found" message when search returns no results', async () => {
      // First call returns empty results, second call (after search) returns empty
      axios.get
        .mockResolvedValueOnce(mockApiResponse({
          clients: [],
          pagination: { page: 1, pages: 1, total: 0 }
        }))
        .mockResolvedValueOnce(mockApiResponse({
          clients: [],
          pagination: { page: 1, pages: 1, total: 0 }
        }))

      renderWithProviders(<Clients />)

      await waitFor(() => {
        expect(screen.getByText('Nenhum cliente cadastrado')).toBeInTheDocument()
      })

      const searchInput = screen.getByPlaceholderText('Buscar clientes por nome, telefone ou email...')
      fireEvent.change(searchInput, { target: { value: 'inexistente' } })

      await waitFor(() => {
        expect(screen.getByText('Nenhum cliente encontrado')).toBeInTheDocument()
        expect(screen.getByText('Tente ajustar os termos de busca')).toBeInTheDocument()
      })
    })
  })

  describe('Clients List', () => {
    const mockClients = [
      mockClient({ id: 1, name: 'João Silva' }),
      mockClient({ id: 2, name: 'Maria Santos', phone: '(11) 88888-8888' }),
    ]

    it('should render list of clients correctly', async () => {
      axios.get.mockResolvedValue(mockApiResponse({
        clients: mockClients,
        pagination: { page: 1, pages: 1, total: 2 }
      }))

      renderWithProviders(<Clients />)

      await waitFor(() => {
        expect(screen.getByText('João Silva')).toBeInTheDocument()
        expect(screen.getByText('Maria Santos')).toBeInTheDocument()
        expect(screen.getByText('(11) 99999-9999')).toBeInTheDocument()
        expect(screen.getByText('(11) 88888-8888')).toBeInTheDocument()
      })
    })

    it('should display client statistics when available', async () => {
      const clientWithStats = mockClient({
        stats: {
          total_appointments: 10,
          completed_appointments: 8,
          last_appointment_date: '2024-01-15'
        }
      })

      axios.get.mockResolvedValue(mockApiResponse({
        clients: [clientWithStats],
        pagination: { page: 1, pages: 1, total: 1 }
      }))

      renderWithProviders(<Clients />)

      await waitFor(() => {
        expect(screen.getByText('10 agendamentos')).toBeInTheDocument()
        expect(screen.getByText('8 concluídos')).toBeInTheDocument()
        expect(screen.getByText(/Último:/)).toBeInTheDocument()
      })
    })

    it('should display client notes when available', async () => {
      const clientWithNotes = mockClient({
        notes: 'Cliente VIP, prefere horário da manhã'
      })

      axios.get.mockResolvedValue(mockApiResponse({
        clients: [clientWithNotes],
        pagination: { page: 1, pages: 1, total: 1 }
      }))

      renderWithProviders(<Clients />)

      await waitFor(() => {
        expect(screen.getByText('Cliente VIP, prefere horário da manhã')).toBeInTheDocument()
      })
    })
  })

  describe('Search Functionality', () => {
    it('should call API with search parameters when user types in search box', async () => {
      axios.get.mockResolvedValue(mockApiResponse({
        clients: [],
        pagination: { page: 1, pages: 1, total: 0 }
      }))

      renderWithProviders(<Clients />)

      const searchInput = screen.getByPlaceholderText('Buscar clientes por nome, telefone ou email...')
      fireEvent.change(searchInput, { target: { value: 'João' } })

      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('search=João'))
      })
    })

    it('should reset to page 1 when searching', async () => {
      axios.get.mockResolvedValue(mockApiResponse({
        clients: [],
        pagination: { page: 1, pages: 1, total: 0 }
      }))

      renderWithProviders(<Clients />)

      const searchInput = screen.getByPlaceholderText('Buscar clientes por nome, telefone ou email...')
      fireEvent.change(searchInput, { target: { value: 'test' } })

      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('page=1'))
      })
    })
  })

  describe('Pagination', () => {
    it('should show pagination controls when there are multiple pages', async () => {
      axios.get.mockResolvedValue(mockApiResponse({
        clients: [mockClient()],
        pagination: { page: 1, pages: 3, total: 60 }
      }))

      renderWithProviders(<Clients />)

      await waitFor(() => {
        expect(screen.getByText('Página 1 de 3 (60 clientes no total)')).toBeInTheDocument()
        expect(screen.getByText('Anterior')).toBeInTheDocument()
        expect(screen.getByText('Próxima')).toBeInTheDocument()
      })
    })

    it('should not show pagination when there is only one page', async () => {
      axios.get.mockResolvedValue(mockApiResponse({
        clients: [mockClient()],
        pagination: { page: 1, pages: 1, total: 1 }
      }))

      renderWithProviders(<Clients />)

      await waitFor(() => {
        expect(screen.queryByText('Anterior')).not.toBeInTheDocument()
        expect(screen.queryByText('Próxima')).not.toBeInTheDocument()
      })
    })
  })

  describe('Actions', () => {
    it('should navigate to new client form when "Novo Cliente" button is clicked', async () => {
      axios.get.mockResolvedValue(mockApiResponse({
        clients: [],
        pagination: { page: 1, pages: 1, total: 0 }
      }))

      renderWithProviders(<Clients />)

      const newClientButton = screen.getByRole('button', { name: /novo cliente/i })
      fireEvent.click(newClientButton)

      expect(mockNavigate).toHaveBeenCalledWith('/clients/new')
    })

    it('should navigate to edit form when edit button is clicked', async () => {
      axios.get.mockResolvedValue(mockApiResponse({
        clients: [mockClient({ id: 1 })],
        pagination: { page: 1, pages: 1, total: 1 }
      }))

      renderWithProviders(<Clients />)

      await waitFor(() => {
        const editButton = screen.getByTitle('Editar cliente')
        fireEvent.click(editButton)
        expect(mockNavigate).toHaveBeenCalledWith('/clients/1/edit')
      })
    })
  })

  describe('Delete Functionality', () => {
    it('should show confirmation dialog when delete button is clicked', async () => {
      const client = mockClient({ id: 1, name: 'João Silva' })
      axios.get.mockResolvedValue(mockApiResponse({
        clients: [client],
        pagination: { page: 1, pages: 1, total: 1 }
      }))

      // Mock window.confirm
      const mockConfirm = jest.spyOn(window, 'confirm').mockReturnValue(false)

      renderWithProviders(<Clients />)

      await waitFor(() => {
        const deleteButton = screen.getByTitle('Excluir cliente')
        fireEvent.click(deleteButton)
        expect(mockConfirm).toHaveBeenCalledWith('Tem certeza que deseja excluir o cliente "João Silva"?')
      })

      mockConfirm.mockRestore()
    })

    it('should delete client and refresh list when confirmed', async () => {
      const client = mockClient({ id: 1, name: 'João Silva' })
      axios.get.mockResolvedValue(mockApiResponse({
        clients: [client],
        pagination: { page: 1, pages: 1, total: 1 }
      }))
      axios.delete.mockResolvedValue(mockApiResponse({}))

      // Mock window.confirm to return true
      const mockConfirm = jest.spyOn(window, 'confirm').mockReturnValue(true)

      renderWithProviders(<Clients />)

      await waitFor(() => {
        const deleteButton = screen.getByTitle('Excluir cliente')
        fireEvent.click(deleteButton)
      })

      await waitFor(() => {
        expect(axios.delete).toHaveBeenCalledWith('/clients/1')
        expect(axios.get).toHaveBeenCalledTimes(2) // Initial load + refresh after delete
      })

      mockConfirm.mockRestore()
    })

    it('should handle delete error gracefully', async () => {
      const client = mockClient({ id: 1, name: 'João Silva' })
      axios.get.mockResolvedValue(mockApiResponse({
        clients: [client],
        pagination: { page: 1, pages: 1, total: 1 }
      }))
      axios.delete.mockRejectedValue(mockApiError('Erro ao excluir cliente'))

      const mockConfirm = jest.spyOn(window, 'confirm').mockReturnValue(true)

      renderWithProviders(<Clients />)

      await waitFor(() => {
        const deleteButton = screen.getByTitle('Excluir cliente')
        fireEvent.click(deleteButton)
      })

      await waitFor(() => {
        expect(axios.delete).toHaveBeenCalledWith('/clients/1')
      })

      mockConfirm.mockRestore()
    })
  })

  describe('Summary Statistics', () => {
    it('should display summary statistics when clients exist', async () => {
      const clients = [
        mockClient({ 
          stats: { 
            total_appointments: 5, 
            completed_appointments: 4 
          } 
        }),
        mockClient({ 
          stats: { 
            total_appointments: 3, 
            completed_appointments: 2 
          } 
        }),
      ]

      axios.get.mockResolvedValue(mockApiResponse({
        clients,
        pagination: { page: 1, pages: 1, total: 2 }
      }))

      renderWithProviders(<Clients />)

      await waitFor(() => {
        expect(screen.getByText('2')).toBeInTheDocument() // Total clients
        expect(screen.getByText('6')).toBeInTheDocument() // Total completed appointments (4+2)
        expect(screen.getByText('8')).toBeInTheDocument() // Total appointments (5+3)
      })
    })

    it('should not show summary when no clients exist', async () => {
      axios.get.mockResolvedValue(mockApiResponse({
        clients: [],
        pagination: { page: 1, pages: 1, total: 0 }
      }))

      renderWithProviders(<Clients />)

      await waitFor(() => {
        expect(screen.queryByText('Total de Clientes')).not.toBeInTheDocument()
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      axios.get.mockRejectedValue(mockApiError('Erro na API'))

      renderWithProviders(<Clients />)

      // Component should still render without crashing
      await waitFor(() => {
        expect(screen.getByText('Clientes')).toBeInTheDocument()
      })
    })
  })
})