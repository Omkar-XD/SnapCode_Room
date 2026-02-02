'use client'

import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [currentTheme, setCurrentTheme] = useState<string>('')

  useEffect(() => {
    setMounted(true)
    // Determine current theme accounting for system preference
    if (theme === 'system') {
      setCurrentTheme(systemTheme || 'light')
    } else {
      setCurrentTheme(theme || 'light')
    }
  }, [theme, systemTheme])

  if (!mounted) {
    return <div className="w-10 h-10" />
  }

  const handleThemeToggle = () => {
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleThemeToggle}
      className="rounded-full bg-transparent hover:bg-secondary"
      title={`Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {currentTheme === 'dark' ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
