import { createContext } from "react";

export const AuthContext = createContext({
    isLoggedIn : false,
    login : () => {},
    logout: () => {},
    IdHandler: () => {},
    UserId: '',
    UserData: '',
    Messages: '',
    MessageHandler: ()=>{},
    UserDataHandler: ()=>{}
}); 
