import {Request, response, Response} from 'express'
import { CreateMessageService } from '../services/CreateMessageService';


class CreateMessageController {
    async handle(request:Request,response:Response){

        const {message} = request.body;
        const {user_id} = request

        const service = new CreateMessageService()
        
        try {

            const result = await service.execute(message,user_id)
            
            return response.json(result)

        } catch(err){
            return response.json(err.message)
        }
        
        
        
    }
}

export {CreateMessageController}