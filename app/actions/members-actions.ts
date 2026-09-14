"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function addBoardMember(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "No autorizado." };

  const boardId = formData.get("boardId") as string;
  const email = formData.get("email") as string;
  const role = (formData.get("role") as Role) || "MEMBER";

  if (!email || !email.includes("@")) {
    return { success: false, error: "Ingresa un correo electrónico válido." };
  }

  try {
    const userToInvite = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!userToInvite) {
      return { success: false, error: "No se encontró ningún usuario registrado con ese correo." };
    }

    const currentMember = await prisma.boardMember.findUnique({
      where: { userId_boardId: { userId: session.user.id, boardId } },
    });

    if (!currentMember || (currentMember.role !== "OWNER")) {
      return { success: false, error: "No tienes permisos para agregar miembros a este tablero." };
    }

    const existingMember = await prisma.boardMember.findUnique({
      where: { userId_boardId: { userId: userToInvite.id, boardId } },
    });

    if (existingMember) {
      return { success: false, error: "El usuario ya es miembro de este tablero." };
    }

    await prisma.boardMember.create({
      data: {
        boardId,
        userId: userToInvite.id,
        role: role,
      },
    });

    revalidatePath(`/board/${boardId}`);
    return { success: true };
  } catch (error) {
    console.error("Error al añadir miembro:", error);
    return { success: false, error: "Ocurrió un error al procesar la invitación." };
  }
}

export async function updateMemberRole(boardId: string, targetUserId: string, newRole: Role) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "No autorizado." };

  const currentMember = await prisma.boardMember.findUnique({
    where: { userId_boardId: { userId: session.user.id, boardId } },
  });

  if (!currentMember || (currentMember.role !== "ADMIN" && currentMember.role !== "OWNER")) {
    return { success: false, error: "Sin permisos para cambiar roles." };
  }

  if (newRole === "ADMIN" && currentMember.role !== "OWNER") {
    return { success: false, error: "Solo el propietario puede asignar administradores." };
  }

  try {
    await prisma.boardMember.update({
      where: { userId_boardId: { userId: targetUserId, boardId } },
      data: { role: newRole },
    });

    revalidatePath(`/board/${boardId}`);
    return { success: true };
  } catch (error) {
    console.error("Error al actualizar rol:", error);
    return { success: false, error: "Error al actualizar el rol en la base de datos." };
  }
}

export async function removeBoardMember(boardId: string, targetUserId: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "No autorizado." };

  // Prevenir que un usuario se elimine a sí mismo
  if (targetUserId === session.user.id) {
    return { success: false, error: "No puedes eliminarte a ti mismo del tablero." };
  }

  const currentMember = await prisma.boardMember.findUnique({
    where: { userId_boardId: { userId: session.user.id, boardId } },
  });

  if (!currentMember || (currentMember.role !== "OWNER")) {
    return { success: false, error: "Sin permisos para eliminar miembros." };
  }

  try {
    await prisma.boardMember.delete({
      where: { userId_boardId: { userId: targetUserId, boardId } },
    });

    revalidatePath(`/board/${boardId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: "Error al eliminar el miembro." };
  }
}