import React from 'react'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import axios from 'axios'
import { renderWithProviders, mockClient, mockApiResponse, mockApiError } from '../../utils/testUtils'
import ClientForm from '../ClientForm'

// Mock the useNavigate and useParams hooks
const mockNavigate = jest.fn()
const mockUseParams = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => mockUseParams(),
}))

describe('ClientForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseParams.mockReturnValue({})
  })

  describe('Create Mode', () => {
    it('should render create form with empty fields', () => {
      renderWithProviders(<ClientForm />)

      expect(screen.getByText('Novo Cliente')).toBeInTheDocument()
      expect(screen.getByText('Preencha os dados do novo cliente')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /criar cliente/i })).toBeInTheDocument()

      // Check form fields are empty
      expect(screen.getByLabelText(/nome completo/i)).toHaveValue('')
      expect(screen.getByLabelText(/telefone/i)).toHaveValue('')
      expect(screen.getByLabelText(/email/i)).toHaveValue('')
      expect(screen.getByLabelText(/notas e observações/i)).toHaveValue('')
    })

    it('should show tips section in create mode', () => {
      renderWithProviders(<ClientForm />)

      expect(screen.getByText('💡 Dicas para cadastro')).toBeInTheDocument()
      expect(screen.getByText('• Apenas o nome é obrigatório')).toBeInTheDocument()
      expect(screen.getByText('• Telefone e email facilitam o contato')).toBeInTheDocument()
    })
  })

  describe('Edit Mode', () => {
    it('should render edit form and load existing client data', async () => {
      mockUseParams.mockReturnValue({ id: '1' })
      const client = mockClient({
        name: 'João Silva',
        phone: '(11) 99999-9999',
        email: 'joao@example.com',
        notes: 'Cliente VIP'
      })
      
      axios.get.mockResolvedValue(mockApiResponse({ client }))

      renderWithProviders(<ClientForm />)

      // Initially shows loading
      expect(screen.getByTestId('mock-icon')).toBeInTheDocument()

      await waitFor(() => {
        expect(screen.getByText('Editar Cliente')).toBeInTheDocument()
        expect(screen.getByText('Atualize as informações do cliente')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /atualizar cliente/i })).toBeInTheDocument()
      })

      // Check form fields are populated
      expect(screen.getByDisplayValue('João Silva')).toBeInTheDocument()
      expect(screen.getByDisplayValue('(11) 99999-9999')).toBeInTheDocument()
      expect(screen.getByDisplayValue('joao@example.com')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Cliente VIP')).toBeInTheDocument()
    })

    it('should handle error when loading client data', async () => {
      mockUseParams.mockReturnValue({ id: '1' })
      axios.get.mockRejectedValue(mockApiError('Cliente não encontrado', 404))

      renderWithProviders(<ClientForm />)

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/clients')
      })
    })

    it('should not show tips section in edit mode', async () => {
      mockUseParams.mockReturnValue({ id: '1' })
      axios.get.mockResolvedValue(mockApiResponse({ client: mockClient() }))

      renderWithProviders(<ClientForm />)

      await waitFor(() => {
        expect(screen.queryByText('💡 Dicas para cadastro')).not.toBeInTheDocument()
      })
    })
  })

  describe('Form Validation', () => {
    it('should show error when name is empty', async () => {
      renderWithProviders(<ClientForm />)

      const submitButton = screen.getByRole('button', { name: /criar cliente/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Nome é obrigatório')).toBeInTheDocument()
      })

      expect(axios.post).not.toHaveBeenCalled()
    })

    it('should show error when email format is invalid', async () => {
      renderWithProviders(<ClientForm />)

      fireEvent.change(screen.getByLabelText(/nome completo/i), {
        target: { value: 'João Silva' }
      })
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'invalid-email' }
      })

      const submitButton = screen.getByRole('button', { name: /criar cliente/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Email deve ter um formato válido')).toBeInTheDocument()
      })

      expect(axios.post).not.toHaveBeenCalled()
    })

    it('should show error when phone format is invalid', async () => {
      renderWithProviders(<ClientForm />)

      fireEvent.change(screen.getByLabelText(/nome completo/i), {
        target: { value: 'João Silva' }
      })
      fireEvent.change(screen.getByLabelText(/telefone/i), {
        target: { value: 'invalid-phone-format!' }
      })

      const submitButton = screen.getByRole('button', { name: /criar cliente/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Telefone deve conter apenas números e símbolos válidos')).toBeInTheDocument()
      })

      expect(axios.post).not.toHaveBeenCalled()
    })

    it('should clear errors when user starts typing', async () => {
      renderWithProviders(<ClientForm />)

      // First submit to show error
      const submitButton = screen.getByRole('button', { name: /criar cliente/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Nome é obrigatório')).toBeInTheDocument()
      })

      // Start typing in name field
      fireEvent.change(screen.getByLabelText(/nome completo/i), {
        target: { value: 'J' }
      })

      await waitFor(() => {
        expect(screen.queryByText('Nome é obrigatório')).not.toBeInTheDocument()
      })
    })
  })

  describe('Form Submission', () => {
    it('should create new client successfully', async () => {
      axios.post.mockResolvedValue(mockApiResponse({ client: mockClient() }))

      renderWithProviders(<ClientForm />)

      // Fill form
      fireEvent.change(screen.getByLabelText(/nome completo/i), {
        target: { value: 'João Silva' }
      })
      fireEvent.change(screen.getByLabelText(/telefone/i), {
        target: { value: '(11) 99999-9999' }
      })
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'joao@example.com' }
      })
      fireEvent.change(screen.getByLabelText(/notas e observações/i), {
        target: { value: 'Cliente regular' }
      })

      // Submit form
      const submitButton = screen.getByRole('button', { name: /criar cliente/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith('/clients', {
          name: 'João Silva',
          phone: '(11) 99999-9999',
          email: 'joao@example.com',
          notes: 'Cliente regular'
        })
        expect(mockNavigate).toHaveBeenCalledWith('/clients')
      })
    })

    it('should update existing client successfully', async () => {
      mockUseParams.mockReturnValue({ id: '1' })
      const client = mockClient()
      axios.get.mockResolvedValue(mockApiResponse({ client }))
      axios.put.mockResolvedValue(mockApiResponse({ client }))

      renderWithProviders(<ClientForm />)

      await waitFor(() => {
        expect(screen.getByDisplayValue(client.name)).toBeInTheDocument()
      })

      // Update name
      fireEvent.change(screen.getByLabelText(/nome completo/i), {
        target: { value: 'João Silva Santos' }
      })

      // Submit form
      const submitButton = screen.getByRole('button', { name: /atualizar cliente/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(axios.put).toHaveBeenCalledWith('/clients/1', {
          name: 'João Silva Santos',
          phone: client.phone,
          email: client.email,
          notes: client.notes
        })
        expect(mockNavigate).toHaveBeenCalledWith('/clients')
      })
    })

    it('should handle null values for optional fields', async () => {
      axios.post.mockResolvedValue(mockApiResponse({ client: mockClient() }))

      renderWithProviders(<ClientForm />)

      // Fill only required field
      fireEvent.change(screen.getByLabelText(/nome completo/i), {
        target: { value: 'João Silva' }
      })

      const submitButton = screen.getByRole('button', { name: /criar cliente/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith('/clients', {
          name: 'João Silva',
          phone: null,
          email: null,
          notes: null
        })
      })
    })

    it('should handle API errors during submission', async () => {
      axios.post.mockRejectedValue(mockApiError('Email já está em uso', 400))

      renderWithProviders(<ClientForm />)

      fireEvent.change(screen.getByLabelText(/nome completo/i), {
        target: { value: 'João Silva' }
      })

      const submitButton = screen.getByRole('button', { name: /criar cliente/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalled()
      })

      // Should not navigate on error
      expect(mockNavigate).not.toHaveBeenCalled()
    })

    it('should disable submit button during submission', async () => {
      axios.post.mockImplementation(() => new Promise(resolve => 
        setTimeout(() => resolve(mockApiResponse({})), 100)
      ))

      renderWithProviders(<ClientForm />)

      fireEvent.change(screen.getByLabelText(/nome completo/i), {
        target: { value: 'João Silva' }
      })

      const submitButton = screen.getByRole('button', { name: /criar cliente/i })
      fireEvent.click(submitButton)

      // Button should show loading state
      await waitFor(() => {
        expect(screen.getByText('Salvando...')).toBeInTheDocument()
        expect(submitButton).toBeDisabled()
      })
    })
  })

  describe('Navigation', () => {
    it('should navigate back when cancel button is clicked', () => {
      renderWithProviders(<ClientForm />)

      const cancelButton = screen.getByRole('button', { name: /cancelar/i })
      fireEvent.click(cancelButton)

      expect(mockNavigate).toHaveBeenCalledWith('/clients')
    })

    it('should navigate back when back arrow is clicked', () => {
      renderWithProviders(<ClientForm />)

      const backButton = screen.getByRole('button', { name: '' }) // ArrowLeft icon button
      fireEvent.click(backButton)

      expect(mockNavigate).toHaveBeenCalledWith('/clients')
    })
  })

  describe('Accessibility', () => {
    it('should have proper labels for form fields', () => {
      renderWithProviders(<ClientForm />)

      expect(screen.getByLabelText(/nome completo/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/telefone/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/notas e observações/i)).toBeInTheDocument()
    })

    it('should associate error messages with form fields', async () => {
      renderWithProviders(<ClientForm />)

      const submitButton = screen.getByRole('button', { name: /criar cliente/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        const nameInput = screen.getByLabelText(/nome completo/i)
        const errorMessage = screen.getByText('Nome é obrigatório')
        expect(nameInput).toBeInvalid()
        expect(errorMessage).toBeInTheDocument()
      })
    })
  })
})