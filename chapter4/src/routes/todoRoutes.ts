import express, { type Request, type Response } from 'express';
import { prisma } from '../lib/prisma.js';

const todoRoutes = express.Router();

todoRoutes.get('/', async (req: Request, res: Response) => {
  try {
    const todos = await prisma.todo.findMany({
      where: {
        userId: (req as any).userId
      }
    });
    res.json(todos);
  } catch (err: any) {
    console.error('Get todos error:', err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});

todoRoutes.post('/', async (req: Request, res: Response) => {
  try {
    if (!req.body || !req.body.task) {
      return res.status(400).json({ message: "Task is required" });
    }

    const { task } = req.body;

    const todo = await prisma.todo.create({
      data: {
        task: task as string,
        userId: (req as any).userId
      }
    });

    res.json(todo);
  } catch (err: any) {
    console.error('Create todo error:', err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});

todoRoutes.put('/:id', async (req: Request, res: Response) => {
  try {
    const { completed } = req.body || {};
    const { id } = req.params;

    const todo = await prisma.todo.findUnique({
      where: { id: parseInt(id as string) }
    });

    if (!todo) {
      return res.status(404).json({ message: "Todo not found!!" });
    }

    // Check if user owns this todo
    if (todo.userId !== (req as any).userId) {
      return res.status(403).json({ message: "Forbidden: You don't own this todo" });
    }

    await prisma.todo.update({
      where: { id: parseInt(id as string) },
      data: { completed: !!completed }
    });

    res.json({ message: "Todo Updated" });
  } catch (err: any) {
    console.error('Update todo error:', err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});

todoRoutes.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const todo = await prisma.todo.findUnique({
      where: { id: parseInt(id as string) }
    });

    if (!todo) {
      return res.status(404).json({ message: "Todo not found!!" });
    }

    // Check if user owns this todo
    if (todo.userId !== (req as any).userId) {
      return res.status(403).json({ message: "Forbidden: You don't own this todo" });
    }

    await prisma.todo.delete({
      where: { id: parseInt(id as string) }
    });

    res.json({ message: "Todo Deleted" });
  } catch (err: any) {
    console.error('Delete todo error:', err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});

export default todoRoutes;
