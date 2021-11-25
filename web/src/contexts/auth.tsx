import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/api";



type User = {
    id:string;
    name:string;
    login:string;
    avatar_url:string;
}

type AuthContextData = {
    user: User | null;
    signInUrl:string;
    signOut:()=>void;
}

type IAuthProvider = {
    children:ReactNode
}

type AuthResponse = {
    token:string;
    user:{
        id:string;
        avatar_url:string;
        name:string;
        login:string;
    }
}

export const AuthContext = createContext({} as AuthContextData)

export function AuthProvider(props:IAuthProvider){

    const [user,setUser] = useState<User | null>(null)

    const signInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=bafae0e9a1caa2d5dbf4`

    async function signIn(githubCode:string){
        const response = await api.post<AuthResponse>("authenticate",{
            code:githubCode
        })

        const {token, user } = response.data
        //O Token eu vou salvar em local storage para que mesmo que o usuario saia, ele ainda consiga acessar
        localStorage.setItem('@dowhile:token',token)


        api.defaults.headers.common.authorization = `Bearer ${token}`
        setUser(user)
    }

    function signOut(){
        setUser(null)
        localStorage.removeItem('@dowhile:token')
    }

    useEffect(()=>{
        const url = window.location.href//pegando a url da pag, se ja aconteceu o login, ela terá o code
        const hasGithubCode = url.includes('?code=')

        if(hasGithubCode){
            const [urlWithoutCode,githubCode] = url.split('?code=')
            
            window.history.pushState({},'',urlWithoutCode);//Para que o codigo nao apareça para o usuario na tela

            signIn(githubCode)
        }

    },[])


    useEffect(()=>{
        const token = localStorage.getItem('@dowhile:token')
        
        if(token){
            api.defaults.headers.common.authorization = `Bearer ${token}`

            api.get<User>('profile').then(resp => {
                setUser(resp.data)
            })
        }
    },[])

    return (
        <AuthContext.Provider value={{signInUrl,user,signOut}}>
            {props.children}
        </AuthContext.Provider>
    )
}