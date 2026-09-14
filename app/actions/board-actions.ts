"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createBoard(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("No autorizado. Debes iniciar sesión.");
  }

  const userId = session.user.id;

  const title = formData.get("title") as string;

  if (!title || title.trim() === "") {
    throw new Error("El título del tablero es obligatorio.");
  }

  try {
    const newBoard = await prisma.$transaction(async (tx) => {
      const board = await tx.board.create({
        data: {
          title: title.trim(),
        },
      });

      await tx.boardMember.create({
        data: {
          userId,
          boardId: board.id,
          role: "OWNER",
        },
      });

      await tx.column.createMany({
        data: [
          { title: "Por hacer", order: 0, boardId: board.id },
          { title: "En progreso", order: 1, boardId: board.id },
          { title: "Completado", order: 2, boardId: board.id },
        ],
      });

      return board;
    });

    revalidatePath("/dashboard");

    return { success: true, boardId: newBoard.id };
  } catch (error) {
    console.error("Error al crear el tablero:", error);
    return { success: false, error: "Ocurrió un error al crear el tablero." };
  }
}

export async function deleteBoard(boardId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "No autorizado." };
  }

  try {
    await prisma.board.delete({
      where: {
        id: boardId,
        members: {
          some: {
            userId: session.user.id,
          },
        },
      },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar tablero:", error);
    return { success: false, error: "No se pudo eliminar el tablero." };
  }
}

export async function getUserBoards() {
  const session = await auth();

  if (!session?.user?.id) {
    return [];
  }

  const boards = await prisma.board.findMany({
    where: {
      members: {
        some: {
          userId: session.user.id,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      columns: {
        select: { id: true },
      },
    },
  });

  return boards;
}