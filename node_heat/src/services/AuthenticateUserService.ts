

/**
 * O que eu vou precisar fazer nesse serviço?
 * Qual é o fluxo? Qual a regra de negocio para esse serviço? (resposta a baixo)
 * 
 * 1 - Receber o code(string)
 * 2 - Recuperar o access_token no github
 * 2.1 - Recuperar infos do user no github
 * 3 - Verificar se o usuario existe no DB
 * 4 - ---- SIM = Gerar um token
 *    ----- NAO = Criar o usuario no DB, gerar um token
 * 5 - Retornar o token com as infos do user
 */

import axios from "axios"
import prismaClient from '../prisma'
import {sign} from 'jsonwebtoken'

interface IAccessTokenResponse {
    access_token:string;
}

interface IUserResponse {
    avatar_url:string;
    login:string;
    id:number;
    name:string;
}

class AuthenticateUserService {

    async execute(code:string){

        const url = "https://github.com/login/oauth/access_token"

        const { data:accessTokenResponse } = await axios.post<IAccessTokenResponse>(url,null,{
            params:{
                client_id:process.env.GITHUB_CLIENT_ID,
                client_secret:process.env.GITHUB_CLIENT_SECRET,
                code,
            },
            headers:{
                "Accept":"application/json"
            }
        })

        const response = await axios.get<IUserResponse>('https://api.github.com/user',{
            headers:{
                authorization:`Bearer ${accessTokenResponse.access_token}`
            }
        })
        
        const {login, id, avatar_url,name}= response.data
        
        let user = await prismaClient.user.findFirst({
            where:{
                github_id:id
            }
        })
        if(!user){
            user = await prismaClient.user.create({
                data:{
                    github_id:id,
                    login,
                    avatar_url,
                    name,
                }
            })
        }

        const token = sign(
            {
                user: {
                    name: user.name,
                    avatar_url: user.avatar_url,
                    id: user.id
                }
            },
                process.env.JWT_SECRET,
            {
                subject: user.id,
                expiresIn: "1d"
            }
        )

        return {token,user};

    }
}

export {AuthenticateUserService}