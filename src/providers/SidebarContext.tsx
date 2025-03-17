import {createContext, Dispatch, ReactNode, SetStateAction, useState} from "react"
import { Tab } from "../../utils/types"
type tabType = {
    tab:Tab,
    setTab:Dispatch<SetStateAction<Tab>>
}
const initialState:tabType = {
    tab:Tab.POSTS,
    setTab: () => {}
}
const SidebarContext = createContext<tabType>(initialState);
function SideContextProvider ({children}:{children:ReactNode}){
    const [tab, setTab] = useState(Tab.POSTS)
    return (
        <SidebarContext.Provider value={{tab, setTab}}>
            {children}
        </SidebarContext.Provider>
    )
}





export {SidebarContext,SideContextProvider}