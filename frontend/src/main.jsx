import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { SubscriptionProvider } from './contexts/SubscriptionContext.jsx'
import { OnboardingProvider } from './contexts/OnboardingContext.jsx'
import { ProfessionalAuthProvider } from './contexts/ProfessionalAuthContext.jsx'
import { SuperAdminProvider } from './contexts/SuperAdminContext.jsx'
import { NotificationProvider } from './contexts/NotificationContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SubscriptionProvider>
          <OnboardingProvider>
            <ProfessionalAuthProvider>
              <SuperAdminProvider>
                <NotificationProvider>
                  <App />
                </NotificationProvider>
              </SuperAdminProvider>
            </ProfessionalAuthProvider>
          </OnboardingProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </SubscriptionProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)