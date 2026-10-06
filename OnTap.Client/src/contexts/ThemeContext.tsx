import { createContext } from 'react';
import type { ReactNode } from 'react';

export const ThemeContext = createContext(false);

export function ThemeProvider({ children }: { children: ReactNode }) {
    return (
        <ThemeContext value={true}>
            {children}
        </ThemeContext>
    );
}