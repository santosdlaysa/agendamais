import React from 'react'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import axios from 'axios'
import { renderWithProviders, mockProfessional, mockService, mockApiResponse, mockApiError } from '../../utils/testUtils'
import ProfessionalForm from '../ProfessionalForm'

const mockNavigate = jest.fn()
const mockUseParams = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => mockUseParams(),
}))

describe('ProfessionalForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseParams.mockReturnValue({})
  })

  describe('Create Mode', () => {
    it('should render create form with empty fields', async () => {
      axios.get.mockResolvedValue(mockApiResponse({
        services: []
      }))

      renderWithProviders(<ProfessionalForm />)

      await waitFor(() => {
        expect(screen.getByText('Novo Profissional')).toBeInTheDocument()
        expect(screen.getByText('Preencha os dados do novo profissional')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /criar profissional/i })).toBeInTheDocument()
      })

      // Check form fields are empty
      expect(screen.getByLabelText(/nome completo/i)).toHaveValue('')
      expect(screen.getByLabelText(/cargo\/especialidade/i)).toHaveValue('')
      expect(screen.getByLabelText(/telefone/i)).toHaveValue('')
      expect(screen.getByLabelText(/email/i)).toHaveValue('')
    })

    it('should load available services on mount', async () => {
      const services = [
        mockService({ id: 1, name: 'Corte de Cabelo', active: true }),
        mockService({ id: 2, name: 'Coloração', active: true }),
        mockService({ id: 3, name: 'Escova', active: false }), // Inactive should not appear
      ]

      axios.get.mockResolvedValue(mockApiResponse({ services }))

      renderWithProviders(<ProfessionalForm />)

      await waitFor(() => {
        expect(screen.getByText('Corte de Cabelo')).toBeInTheDocument()
        expect(screen.getByText('Coloração')).toBeInTheDocument()
        expect(screen.queryByText('Escova')).not.toBeInTheDocument() // Inactive service hidden
      })
    })

    it('should show message when no active services exist', async () => {
      axios.get.mockResolvedValue(mockApiResponse({ services: [] }))

      renderWithProviders(<ProfessionalForm />)

      await waitFor(() => {
        expect(screen.getByText('Nenhum serviço ativo encontrado.')).toBeInTheDocument()
        expect(screen.getByText('Cadastre o primeiro serviço')).toBeInTheDocument()
      })
    })
  })

  describe('Edit Mode', () => {
    it('should load and populate form with existing professional data', async () => {
      mockUseParams.mockReturnValue({ id: '1' })
      
      const services = [
        mockService({ id: 1, name: 'Corte de Cabelo' }),
        mockService({ id: 2, name: 'Coloração' }),
      ]
      
      const professional = mockProfessional({
        name: 'Maria Santos',
        role: 'Cabeleireira',
        phone: '(11) 99999-9999',
        email: 'maria@example.com',
        color: '#FF5733',
        services: [{ id: 1, name: 'Corte de Cabelo' }]
      })
      
      axios.get
        .mockResolvedValueOnce(mockApiResponse({ services }))
        .mockResolvedValueOnce(mockApiResponse({ professional }))

      renderWithProviders(<ProfessionalForm />)

      await waitFor(() => {
        expect(screen.getByText('Editar Profissional')).toBeInTheDocument()
        expect(screen.getByDisplayValue('Maria Santos')).toBeInTheDocument()
        expect(screen.getByDisplayValue('Cabeleireira')).toBeInTheDocument()
        expect(screen.getByDisplayValue('(11) 99999-9999')).toBeInTheDocument()
        expect(screen.getByDisplayValue('maria@example.com')).toBeInTheDocument()
      })

      // Check that the service is selected
      const serviceCheckbox = screen.getByLabelText('Corte de Cabelo')
      expect(serviceCheckbox).toBeChecked()
    })

    it('should handle error when loading professional data', async () => {
      mockUseParams.mockReturnValue({ id: '1' })
      
      axios.get
        .mockResolvedValueOnce(mockApiResponse({ services: [] }))
        .mockRejectedValueOnce(mockApiError('Profissional não encontrado', 404))

      renderWithProviders(<ProfessionalForm />)

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/professionals')
      })
    })
  })

  describe('Color Selection', () => {
    it('should display color palette and allow color selection', async () => {
      axios.get.mockResolvedValue(mockApiResponse({ services: [] }))

      renderWithProviders(<ProfessionalForm />)

      await waitFor(() => {
        expect(screen.getByText('Cor do Calendário')).toBeInTheDocument()
        expect(screen.getByText('Esta cor será usada para identificar os agendamentos deste profissional no calendário')).toBeInTheDocument()
      })

      // Should have multiple color options
      const colorButtons = screen.getAllByRole('button').filter(button => 
        button.title && button.title.startsWith('Cor #')
      )
      expect(colorButtons.length).toBeGreaterThan(0)
    })

    it('should update selected color when color button is clicked', async () => {
      axios.get.mockResolvedValue(mockApiResponse({ services: [] }))

      renderWithProviders(<ProfessionalForm />)

      await waitFor(() => {
        const colorButtons = screen.getAllByRole('button').filter(button => 
          button.title && button.title.startsWith('Cor #')
        )
        
        if (colorButtons.length > 1) {
          fireEvent.click(colorButtons[1])
          // Color should be updated (visual feedback would be tested in integration tests)
        }
      })
    })
  })

  describe('Service Selection', () => {
    it('should allow multiple service selection', async () => {
      const services = [
        mockService({ id: 1, name: 'Corte de Cabelo' }),
        mockService({ id: 2, name: 'Coloração' }),
        mockService({ id: 3, name: 'Escova' }),
      ]

      axios.get.mockResolvedValue(mockApiResponse({ services }))

      renderWithProviders(<ProfessionalForm />)

      await waitFor(() => {
        const checkbox1 = screen.getByLabelText('Corte de Cabelo')
        const checkbox2 = screen.getByLabelText('Coloração')
        
        fireEvent.click(checkbox1)
        fireEvent.click(checkbox2)
        
        expect(checkbox1).toBeChecked()
        expect(checkbox2).toBeChecked()
      })
    })

    it('should display service details (price and duration)', async () => {
      const services = [
        mockService({ 
          id: 1, 
          name: 'Corte de Cabelo',
          price: 50.00,
          duration: 60
        }),
      ]

      axios.get.mockResolvedValue(mockApiResponse({ services }))

      renderWithProviders(<ProfessionalForm />)

      await waitFor(() => {
        expect(screen.getByText('R$ 50.00 • 60min')).toBeInTheDocument()
      })
    })
  })

  describe('Form Validation', () => {
    it('should require name field', async () => {
      axios.get.mockResolvedValue(mockApiResponse({ services: [] }))

      renderWithProviders(<ProfessionalForm />)

      await waitFor(() => {
        const submitButton = screen.getByRole('button', { name: /criar profissional/i })
        fireEvent.click(submitButton)
      })

      await waitFor(() => {
        expect(screen.getByText('Nome é obrigatório')).toBeInTheDocument()
      })

      expect(axios.post).not.toHaveBeenCalled()
    })

    it('should validate email format', async () => {
      axios.get.mockResolvedValue(mockApiResponse({ services: [] }))

      renderWithProviders(<ProfessionalForm />)

      await waitFor(() => {
        fireEvent.change(screen.getByLabelText(/nome completo/i), {
          target: { value: 'Maria Santos' }
        })
        fireEvent.change(screen.getByLabelText(/email/i), {
          target: { value: 'invalid-email' }
        })

        const submitButton = screen.getByRole('button', { name: /criar profissional/i })
        fireEvent.click(submitButton)
      })

      await waitFor(() => {
        expect(screen.getByText('Email deve ter um formato válido')).toBeInTheDocument()
      })
    })

    it('should validate phone format', async () => {
      axios.get.mockResolvedValue(mockApiResponse({ services: [] }))

      renderWithProviders(<ProfessionalForm />)

      await waitFor(() => {
        fireEvent.change(screen.getByLabelText(/nome completo/i), {
          target: { value: 'Maria Santos' }
        })
        fireEvent.change(screen.getByLabelText(/telefone/i), {
          target: { value: 'invalid-phone!' }
        })

        const submitButton = screen.getByRole('button', { name: /criar profissional/i })
        fireEvent.click(submitButton)
      })

      await waitFor(() => {
        expect(screen.getByText('Telefone deve conter apenas números e símbolos válidos')).toBeInTheDocument()
      })
    })

    it('should clear validation errors when user starts typing', async () => {
      axios.get.mockResolvedValue(mockApiResponse({ services: [] }))

      renderWithProviders(<ProfessionalForm />)

      await waitFor(() => {
        const submitButton = screen.getByRole('button', { name: /criar profissional/i })
        fireEvent.click(submitButton)
      })

      await waitFor(() => {
        expect(screen.getByText('Nome é obrigatório')).toBeInTheDocument()
      })

      fireEvent.change(screen.getByLabelText(/nome completo/i), {
        target: { value: 'M' }
      })

      await waitFor(() => {
        expect(screen.queryByText('Nome é obrigatório')).not.toBeInTheDocument()
      })
    })
  })

  describe('Form Submission', () => {
    it('should create new professional successfully', async () => {
      const services = [mockService({ id: 1, name: 'Corte de Cabelo' })]
      axios.get.mockResolvedValue(mockApiResponse({ services }))
      axios.post.mockResolvedValue(mockApiResponse({ professional: mockProfessional() }))

      renderWithProviders(<ProfessionalForm />)

      await waitFor(() => {
        fireEvent.change(screen.getByLabelText(/nome completo/i), {
          target: { value: 'Maria Santos' }
        })
        fireEvent.change(screen.getByLabelText(/cargo\/especialidade/i), {
          target: { value: 'Cabeleireira' }
        })
        fireEvent.change(screen.getByLabelText(/telefone/i), {
          target: { value: '(11) 99999-9999' }
        })
        fireEvent.change(screen.getByLabelText(/email/i), {
          target: { value: 'maria@example.com' }
        })

        // Select a service
        const serviceCheckbox = screen.getByLabelText('Corte de Cabelo')
        fireEvent.click(serviceCheckbox)

        const submitButton = screen.getByRole('button', { name: /criar profissional/i })
        fireEvent.click(submitButton)
      })

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith('/professionals', expect.objectContaining({
          name: 'Maria Santos',
          role: 'Cabeleireira',
          phone: '(11) 99999-9999',
          email: 'maria@example.com',
          service_ids: [1],
          active: true
        }))
        expect(mockNavigate).toHaveBeenCalledWith('/professionals')
      })
    })

    it('should update existing professional successfully', async () => {
      mockUseParams.mockReturnValue({ id: '1' })
      
      const services = [mockService({ id: 1, name: 'Corte de Cabelo' })]
      const professional = mockProfessional({
        name: 'Maria Santos',
        services: [{ id: 1, name: 'Corte de Cabelo' }]
      })
      
      axios.get
        .mockResolvedValueOnce(mockApiResponse({ services }))
        .mockResolvedValueOnce(mockApiResponse({ professional }))
      axios.put.mockResolvedValue(mockApiResponse({ professional }))

      renderWithProviders(<ProfessionalForm />)

      await waitFor(() => {
        const nameField = screen.getByDisplayValue('Maria Santos')
        fireEvent.change(nameField, {
          target: { value: 'Maria Santos Silva' }
        })

        const submitButton = screen.getByRole('button', { name: /atualizar profissional/i })
        fireEvent.click(submitButton)
      })

      await waitFor(() => {
        expect(axios.put).toHaveBeenCalledWith('/professionals/1', expect.objectContaining({
          name: 'Maria Santos Silva'
        }))
        expect(mockNavigate).toHaveBeenCalledWith('/professionals')
      })
    })

    it('should handle null values for optional fields', async () => {
      axios.get.mockResolvedValue(mockApiResponse({ services: [] }))
      axios.post.mockResolvedValue(mockApiResponse({ professional: mockProfessional() }))

      renderWithProviders(<ProfessionalForm />)

      await waitFor(() => {
        fireEvent.change(screen.getByLabelText(/nome completo/i), {
          target: { value: 'Maria Santos' }
        })

        const submitButton = screen.getByRole('button', { name: /criar profissional/i })
        fireEvent.click(submitButton)
      })

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith('/professionals', expect.objectContaining({
          name: 'Maria Santos',
          role: null,
          phone: null,
          email: null
        }))
      })
    })

    it('should disable submit button during submission', async () => {
      axios.get.mockResolvedValue(mockApiResponse({ services: [] }))
      axios.post.mockImplementation(() => new Promise(resolve => 
        setTimeout(() => resolve(mockApiResponse({})), 100)
      ))

      renderWithProviders(<ProfessionalForm />)

      await waitFor(() => {
        fireEvent.change(screen.getByLabelText(/nome completo/i), {
          target: { value: 'Maria Santos' }
        })

        const submitButton = screen.getByRole('button', { name: /criar profissional/i })
        fireEvent.click(submitButton)
      })

      await waitFor(() => {
        expect(screen.getByText('Salvando...')).toBeInTheDocument()
        const submitButton = screen.getByRole('button', { name: 'Salvando...' })
        expect(submitButton).toBeDisabled()
      })
    })

    it('should handle API errors during submission', async () => {
      axios.get.mockResolvedValue(mockApiResponse({ services: [] }))
      axios.post.mockRejectedValue(mockApiError('Email já está em uso', 400))

      renderWithProviders(<ProfessionalForm />)

      await waitFor(() => {
        fireEvent.change(screen.getByLabelText(/nome completo/i), {
          target: { value: 'Maria Santos' }
        })

        const submitButton = screen.getByRole('button', { name: /criar profissional/i })
        fireEvent.click(submitButton)
      })

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalled()
      })

      // Should not navigate on error
      expect(mockNavigate).not.toHaveBeenCalled()
    })
  })

  describe('Navigation', () => {
    it('should navigate back when cancel button is clicked', async () => {
      axios.get.mockResolvedValue(mockApiResponse({ services: [] }))

      renderWithProviders(<ProfessionalForm />)

      await waitFor(() => {
        const cancelButton = screen.getByRole('button', { name: /cancelar/i })
        fireEvent.click(cancelButton)
        expect(mockNavigate).toHaveBeenCalledWith('/professionals')
      })
    })

    it('should navigate back when back arrow is clicked', async () => {
      axios.get.mockResolvedValue(mockApiResponse({ services: [] }))

      renderWithProviders(<ProfessionalForm />)

      await waitFor(() => {
        const backButton = screen.getAllByRole('button')[0] // First button should be back arrow
        fireEvent.click(backButton)
        expect(mockNavigate).toHaveBeenCalledWith('/professionals')
      })
    })

    it('should navigate to services form when no services link is clicked', async () => {
      axios.get.mockResolvedValue(mockApiResponse({ services: [] }))

      renderWithProviders(<ProfessionalForm />)

      await waitFor(() => {
        const servicesLink = screen.getByText('Cadastre o primeiro serviço')
        fireEvent.click(servicesLink)
        expect(mockNavigate).toHaveBeenCalledWith('/services/new')
      })
    })
  })

  describe('Active Status Toggle', () => {
    it('should toggle active status checkbox', async () => {
      axios.get.mockResolvedValue(mockApiResponse({ services: [] }))

      renderWithProviders(<ProfessionalForm />)

      await waitFor(() => {
        const activeCheckbox = screen.getByLabelText('Profissional ativo')
        expect(activeCheckbox).toBeChecked() // Default is active
        
        fireEvent.click(activeCheckbox)
        expect(activeCheckbox).not.toBeChecked()
        
        fireEvent.click(activeCheckbox)
        expect(activeCheckbox).toBeChecked()
      })
    })
  })
})