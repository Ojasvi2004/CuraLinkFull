const jwt =require("jsonwebtoken");

const UserAuth=(req,res,next)=>{

    const authHeader=req.headers["authorization"];
    const token=authHeader && authHeader.split(" ")[1];

    if (!token) 
    {
        return res.status(401).json({success:false,message:"Unauthorized access"})
    }

    try {
        
        const decoded=jwt.verify(token,process.env.SECRET_KEY);
       req._id=decoded._id;

       next();



    } catch (error) {
        return res.status(403).json({success:false,message:error})
    }
}

module.exports=UserAuth;