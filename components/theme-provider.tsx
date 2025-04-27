"use client"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"
import { useEffect } from "react"
import { useStore } from "@/lib/store"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const { themePreference, setThemePreference } = useStore()

  // Sync theme changes with store
  useEffect(() => {
    // If there's a theme preference in the store, use it
    if (themePreference) {
      const { setTheme } = props
      if (typeof setTheme === "function") {
        setTheme(themePreference)
      }
    }
  }, [themePreference])

  // Handle theme changes
  const handleThemeChange = (theme: string) => {
    setThemePreference(theme)
  }

  return (
    <NextThemesProvider {...props} onValueChange={handleThemeChange}>
      {children}
    </NextThemesProvider>
  )
}

