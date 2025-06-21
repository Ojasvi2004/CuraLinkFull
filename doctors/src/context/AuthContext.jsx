import { useEffect } from 'react';
import {createContext,useState} from 'react';
import { useSearchParams } from 'react-router-dom';

const AuthContext=createContext();

const AuthProvider=({children})=>{
    const [token,settoken]=useState(useEffect(
        ()=>{localStorage.getItem('token')? localStorage.getItem('token'):null },[]
    ));


    return(
        <AuthContext.Provider value={{token,settoken}}>
            {children}
        </AuthContext.Provider>
    )
};

export {AuthContext,AuthProvider};