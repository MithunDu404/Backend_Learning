import express, { type Request, type Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';

const authRoutes = express.Router();

authRoutes.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { username }
    });

    if (!user) {
      return res.status(404).send({ message: "User not Found!!" });
    }

    const isValid = bcrypt.compareSync(password, user.password);

    if (!isValid) {
      return res.status(401).send({ message: "Wrong Password!!" });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_TOKEN as string,
      { expiresIn: '24h' }
    );

    res.json({ token });
  } catch (err: any) {
    console.log(err.message);
    res.status(503).json({ message: "Service Unavailable", error: err.message });
  }
});

authRoutes.post('/register', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const encryptPass = bcrypt.hashSync(password, 8);

  try {
    const user = await prisma.user.create({
      data: {
        username: username as string,
        password: encryptPass
      }
    });

    await prisma.todo.create({
      data: {
        task: "Hello :) I am your first TODO (Dummy)!",
        userId: user.id
      }
    });

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_TOKEN as string,
      { expiresIn: '24h' }
    );

    res.json({ token });
  } catch (err: any) {
    console.log(err.message);
    
    // Handle unique constraint violation (username already exists)
    if (err.code === 'P2002' && err.meta?.target?.includes('username')) {
      return res.status(409).json({ message: "Username already exists" });
    }
    
    res.status(503).json({ message: "Service Unavailable", error: err.message });
  }
});

export default authRoutes;
