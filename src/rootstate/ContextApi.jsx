import React, { createContext, useState } from 'react'

export const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
    const [isDarkTheme, setIsDarkTheme] = useState(false)
    const [logged, setIsLoagged] = useState(false)
    const [profileDetails, setProfileDetails] = useState(null)

    const toggleTheme = (value) => setIsDarkTheme(value === "MusicPlayer" ? true : false)
    return (
        <ThemeContext.Provider value={{ isDarkTheme, toggleTheme, logged, setIsLoagged, setProfileDetails, profileDetails }}>
            {children}
        </ThemeContext.Provider>
    )
}