// app/actions/column-actions.ts
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createColumn(boardId: string, name: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "No autorizado." };
  }

  if (!name || name.trim() === "") {
    return { success: false, error: "El nombre de la columna es obligatorio." };
  }

  try {
    const columnsCount = await prisma.column.count({
      where: { boardId },
    });

    await prisma.column.create({
      data: {
        title: name.trim(),
        boardId,
        order: columnsCount,
      },
    });

    revalidatePath(`/board/${boardId}`);
    return { success: true };
  } catch (error) {
    console.error("Error al crear columna:", error);
    return { success: false, error: "No se pudo crear la columna." };
  }
}

export async function deleteColumn(columnId: string, boardId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "No autorizado." };
  }

  try {
    await prisma.column.delete({
      where: { id: columnId },
    });

    revalidatePath(`/board/${boardId}`);
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar columna:", error);
    return { success: false, error: "No se pudo eliminar la columna." };
  }
}