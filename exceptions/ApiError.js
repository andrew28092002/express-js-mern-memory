export class ApiError extends Error{
    constructor(status, message, errors=[]){
        super(message)
        this.status = status
        this.errors = errors
    }

    static Unauthorized(){
        return new ApiError(401, 'Unauthorizated')
    }

    static BadRequest(message, errors=[]){
        return new ApiError(400, message, errors)
    }

    static NotFound(message){
        return new ApiError(404, message)
    }
}
