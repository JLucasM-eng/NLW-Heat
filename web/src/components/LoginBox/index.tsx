import styles from './styles.module.scss'
import {VscGithubInverted} from 'react-icons/vsc'
import { useEffect } from 'react'
import { api } from '../../services/api'


type AuthResponse = {
    token:string;
    user:{
        id:string;
        avatar_url:string;
        name:string;
        login:string;
    }
}
export function LoginBox(){

    const signInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=bafae0e9a1caa2d5dbf4`

    async function signIn(githubCode:string){
        const response = await api.post<AuthResponse>("authenticate",{
            code:githubCode
        })

        const {token, user } = response.data
        //O Token eu vou salvar em local storage para que mesmo que o usuario saia, ele ainda consiga acessar
        localStorage.setItem('@dowhile:token',token)

        console.log("usuario",user)
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
    return (
        <div className={styles.loginBoxWrapper}>
            <strong>Entre e compartilhe a sua mensagem</strong>
            <a href={signInUrl} className={styles.signInWithGitHub}>
                <VscGithubInverted size="24" /> Entrar com GitHub
            </a>
        </div>
    )
}