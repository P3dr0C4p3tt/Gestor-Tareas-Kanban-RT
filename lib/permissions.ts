import { Role } from "@prisma/client";

export const PERMISSIONS = {
  // Un Admin puede editar, invocar miembros, cambiar colores, eliminar filas/tablero
  CAN_MANAGE_BOARD: [Role.OWNER], 
  // Admin y Member pueden crear/mover/editar tarjetas
  CAN_EDIT_CARDS: [Role.OWNER, Role.MEMBER], 
  // Todos (incluyendo Viewer) pueden ver el tablero
  CAN_VIEW_BOARD: [Role.OWNER, Role.MEMBER, Role.VIEWER], 
};

export function hasPermission(userRole: Role, allowedRoles: Role[]): boolean {
  return allowedRoles.includes(userRole);
}