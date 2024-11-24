import { createContext, useEffect, useState } from 'react'
import { Switch } from '@/components/ui/switch'
import { useTheme } from '@/hooks/theme'
import DarkMode from '@/assets/svgs/DarkMode'

type Theme = 'dark' | 'light' | 'system'

type ThemeProviderProps = {
  children: React.ReactNode,
  defaultTheme?: Theme,
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme,
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null
}

export const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'ui-theme',
  ...props
}: ThemeProviderProps) {

  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches ? 'dark' : 'light';
      
      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    }
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export function DarkModeSwitch() {
  const { theme, setTheme } = useTheme();

  return (
    <div className='flex items-center space-x-2'>
      <Switch
        id='dark-mode'
        onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
        checked={theme === 'dark' ? true : (
            theme === 'light' ? false : (
              window.matchMedia('(prefers-color-scheme: dark)')
                .matches ? true : false
            )
          )
        }
        className='h-6 w-10'
      ><DarkMode className='h-full p-[0.1rem] m-auto' /></Switch>
    </div>
  );
}
