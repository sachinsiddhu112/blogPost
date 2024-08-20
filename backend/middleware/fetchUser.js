import jwt from 'jsonwebtoken'

export const fetchUser = async(req,res,next) => {
    //getting user auth token
    const authToken = req.header('authToken');
    //no auth token ,means not authenticated.
    if(!authToken){
        res.status(401).json({error:"Please authenticate using valide token"});
        return;
    }

    try{
        //getting the user id ,data={user:{id}}
         const data = jwt.verify(authToken,"myblogpost");
         req.user =data.user
         //calling to next function in route(post upload endpoint)
         next();
    }
    catch(error) {
        console.log("fetchuser error",error);
        res.status(500).json({error:"Server side error"});
    }
}