import jwt from "jsonwebtoken";

export const requireAuth = (req, res, next) =>{
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({message:"Unauthorized"})
    }
    const token = authHeader.split(" ")[1];
    let decoded;
    try{
        decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    }
    catch(err){
        return res.status(401).json({message:"Invalid token"})
    }
    req.user = {id:decoded.sub, role:decoded.role};
    next();
}

export const requireRole = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)){
        return res.status(403).json({message:"Forbidden"})
    }
    next();
}