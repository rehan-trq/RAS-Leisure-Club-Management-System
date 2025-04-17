
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
  // If environment variables are missing, display a clear error message
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-destructive/10">
          <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg">
            <h1 className="text-xl font-bold text-destructive mb-4">Supabase Configuration Error</h1>
            <p className="mb-4">
              This application requires Supabase environment variables to be set:
            </p>
            <ul className="list-disc pl-5 mb-4 text-sm">
              <li className="mb-1"><code className="bg-muted p-1 rounded">VITE_SUPABASE_URL</code></li>
              <li className="mb-1"><code className="bg-muted p-1 rounded">VITE_SUPABASE_ANON_KEY</code></li>
            </ul>
            <p className="text-sm text-muted-foreground">
              Please add these environment variables to your project configuration.
              You can obtain these values from your Supabase project dashboard.
            </p>
          </div>
        </div>
      </BrowserRouter>
    </React.StrictMode>
  )
  
  console.error('Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
} else {
  // If environment variables are available, render the app normally
  renderApp()
}
