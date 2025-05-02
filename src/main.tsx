
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './contexts/AuthContext.tsx'
import { BookingProvider } from './contexts/BookingContext.tsx'
import { toast } from 'sonner'

// Check for required environment variables before rendering
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create query client
const queryClient = new QueryClient();

// Create a function to render the app
const renderApp = () => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <BookingProvider>
              <App />
            </BookingProvider>
          </AuthProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </React.StrictMode>,
  )
}

// Check if Supabase environment variables are available
if (!supabaseUrl || !supabaseAnonKey) {
  // If environment variables are missing, still render the app
  // The auth context will gracefully handle missing Supabase config
  console.warn('Missing Supabase environment variables. Some features will be limited until you connect to Supabase.')
  renderApp()
} else {
  // If environment variables are available, render the app normally
  renderApp()
}
