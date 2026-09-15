"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";

export async function createCard(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("No autorizado.");
  }

  const title = formData.get("title") as string;
  const columnId = formData.get("columnId") as string;
  const boardId = formData.get("boardId") as string;

  if (!title || title.trim() === "") {
    return { success: false, error: "El título de la tarjeta no puede estar vacío." };
  }

  try {
    const cardsCount = await prisma.task.count({
      where: { columnId },
    });

    await prisma.task.create({
      data: {
        title: title.trim(),
        columnId,
        creatorId: session.user.id,
        order: cardsCount,
      },
    });

    revalidatePath(`/board/${boardId}`);

    return { success: true };
  } catch (error) {
    console.error("Error al crear la tarjeta:", error);
    return { success: false, error: "Ocurrió un error al crear la tarjeta." };
  }
}
export async function updateCardOrder(
  cards: { id: string; order: number; columnId: string }[],
  boardId: string
) {
  try {
    const updates = cards.map((card) =>
      prisma.task.update({
        where: { id: card.id },
        data: { order: card.order, columnId: card.columnId },
      })
    );

    await prisma.$transaction(updates);
    revalidatePath(`/board/${boardId}`);
    return { success: true };
  } catch (error) {
    console.error("Error al reordenar tarjetas:", error);
    return { success: false };
  }
}

export async function updateCardDetails(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "No autorizado." };
  }

  const cardId = formData.get("cardId") as string;
  const boardId = formData.get("boardId") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const priority = formData.get("priority") as "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  const labelColor = formData.get("labelColor") as string;
  const dueDateRaw = formData.get("dueDate") as string;

  if (!cardId || !title || title.trim() === "") {
    return { success: false, error: "El ID y el título son requeridos." };
  }

  const member = await prisma.boardMember.findUnique({
    where: {
      userId_boardId: {
        userId: session.user.id,
        boardId: boardId,
      },
    },
  });

  if (!member || !hasPermission(member.role, PERMISSIONS.CAN_EDIT_CARDS)) {
    return { success: false, error: "No tienes permisos para modificar esta tarjeta." };
  }

  try {
    const updatedCard = await prisma.task.update({
      where: { id: cardId },
      data: {
        title: title.trim(),
        description: description ? description.trim() : null,
        priority: priority || "MEDIUM",
        labelColor: labelColor || null,
        dueDate: dueDateRaw ? new Date(dueDateRaw) : null,
      },
    });

    revalidatePath(`/board/${boardId}`);
    return { success: true, card: updatedCard };
  } catch (error) {
    console.error("Error al actualizar la tarjeta:", error);
    return { success: false, error: "No se pudo actualizar la tarjeta." };
  }
}

export async function deleteCard(cardId: string, boardId: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "No autorizado." };

  try {
    await prisma.task.delete({
      where: { id: cardId },
    });

    revalidatePath(`/board/${boardId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: "Error al eliminar la tarjeta." };
  }
}

