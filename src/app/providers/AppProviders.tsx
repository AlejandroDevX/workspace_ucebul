import { QueryClientProvider } from '@tanstack/react-query'
import {
  ThemeProvider,
  ucebulDarkTheme,
  ucebulLightTheme,
} from 'foundation-ui'
import type { PropsWithChildren } from 'react'
import { AppBootstrap } from '@/app/providers/AppBootstrap'
import { queryClient } from '@/lib/query-client'

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        defaultThemeId={ucebulLightTheme.id}
        themes={[ucebulLightTheme, ucebulDarkTheme]}
      >
        <AppBootstrap />
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  )
}
