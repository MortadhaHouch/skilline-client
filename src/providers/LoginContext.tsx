import {createContext, useState,Dispatch, SetStateAction} from "react";
type loginContext = {
    isLoggedIn: boolean,
    setIsLoggedIn:Dispatch<SetStateAction<boolean>>
}

const LoginContext = createContext<loginContext>({
    isLoggedIn: false,
    setIsLoggedIn: () => {}
});

export default LoginContext

export const LoginProvider = ({children}: { children: React.ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    return (
        <LoginContext.Provider value={{isLoggedIn, setIsLoggedIn}}>{children}</LoginContext.Provider>
    )
}