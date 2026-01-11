import { createContext, useContext, type ReactNode } from 'react'

const EndpointProviderContext = createContext<string>('')

type EndpointProviderProps = {
  children: ReactNode
  endpoint: string
}

export const EndpointProvider = ({
  children,
  endpoint,
}: EndpointProviderProps) => {
  return (
    <EndpointProviderContext.Provider value={endpoint}>
      {children}
    </EndpointProviderContext.Provider>
  )
}

export const useEndpoint = () => {
  const context = useContext(EndpointProviderContext)
  if (context === undefined) {
    throw new Error('useEndpoint must be used within a EndpointProvider')
  }
  return context
}
