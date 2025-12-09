import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).send({ message: "Token not Provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN as string) as any;
    (req as any).userId = decoded.id; 
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

export default authMiddleware;
