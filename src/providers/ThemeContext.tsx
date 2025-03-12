import {createContext, useState,Dispatch, SetStateAction} from "react";
type ThemeContext = {
    theme: boolean,
    setTheme:Dispatch<SetStateAction<boolean>>
}
const Context = createContext<ThemeContext>({
    theme: false,
    setTheme:()=>{}
})
export default function ThemeContextProvider({children}:{children:React.ReactNode}){
    const [theme, setTheme] = useState(false)
    return (
        <Context.Provider value={{theme, setTheme}}>
            {children}
        </Context.Provider>
    )
}

export {Context as ThemeContext}