import React, { createContext, useContext, useState, ReactNode } from "react";


type ThemeContextType = {
  isDarkMode: boolean;
  color : string;
  fontsize : number;
  toggleTheme: () => void;
  changeColor: (newColor: string) => void;
  changeFontSize: (newFontSize : number) => void;
};

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [color, setColor] = useState('#5abdb2') ;
  const [fontsize, setFontSize] = useState(14);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };
  const changeColor = (newcolor: string) => {
    setColor(newcolor);
  }
  const changeFontSize = (newfontsize:number) => {
    setFontSize(newfontsize);
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, color, fontsize, toggleTheme, changeColor, changeFontSize}}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

