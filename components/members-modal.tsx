// components/members-modal.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { addBoardMember, updateMemberRole, removeBoardMember } from "@/app/actions/members-actions";
import { toast } from "sonner";
import { Role } from "@prisma/client";

interface MemberInfo {
  id: string;
  userId: string;
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  role: string;
}

export function MembersModal({
  boardId,
  members,
  userRole,
  isOpen,
  onClose,
}: {
  boardId: string;
  members: MemberInfo[];
  userRole: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<Role>("MEMBER");

  if (!isOpen) return null;

  const canManage = userRole === "ADMIN" || userRole === "OWNER";

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const toastId = toast.loading("Enviando invitación...");
    const result = await addBoardMember(formData);
    setLoading(false);

    if (result.success) {
      toast.success("Miembro agregado exitosamente", { id: toastId });
      onClose();
    } else {
      toast.error(result.error || "No se pudo invitar al usuario", { id: toastId });
    }
  }

  const handleRoleChange = async (targetUserId: string, newRole: Role) => {
    const toastId = toast.loading("Actualizando rol...");
    const res = await updateMemberRole(boardId, targetUserId, newRole);
    if (res.success) {
      toast.success("Rol actualizado", { id: toastId });
    } else {
      toast.error(res.error, { id: toastId });
    }
  };

  const handleRemoveMember = async (targetUserId: string) => {
    if (!confirm("¿Seguro que deseas remover a este miembro del tablero?")) return;

    const toastId = toast.loading("Removiendo miembro...");
    const res = await removeBoardMember(boardId, targetUserId);
    if (res.success) {
      toast.success("Miembro removido", { id: toastId });
    } else {
      toast.error(res.error, { id: toastId });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl border border-gray-100 space-y-5">
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-base font-bold text-gray-800">Miembros del tablero</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 font-bold">
            ✕
          </button>
        </div>

        {canManage && (
          <form action={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Invitar por correo
              </label>
              <div className="flex gap-2">
                <input type="hidden" name="boardId" value={boardId} />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="usuario@ejemplo.com"
                  className="w-full px-3 py-2 border rounded-md text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as Role)}
                  className="text-xs border rounded-md px-2 py-1.5 bg-gray-50 focus:outline-none text-gray-700 font-medium"
                >
                  <option value="VIEWER">Lector</option>
                  <option value="MEMBER">Miembro</option>
                  <option value="ADMIN">Admin</option>
                </select>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? "..." : "Invitar"}
                </button>
              </div>
            </div>
          </form>
        )}

        <div className="space-y-2 pt-2 border-t">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Colaboradores ({members.length})
          </label>
          <div className="space-y-3 max-h-56 overflow-y-auto">
            {members.map((m) => (
              <div key={m.id} className="flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5">
                  {m.user?.image ? (
                    <Image
                      src={m.user.image}
                      alt={m.user.name || "Avatar"}
                      width={28}
                      height={28}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                      {m.user?.name?.[0] || m.user?.email?.[0] || "U"}
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-gray-800 leading-tight">
                      {m.user?.name || "Usuario"}
                    </span>
                    <span className="text-[10px] text-gray-400 leading-tight">
                      {m.user?.email || "Sin email"}
                    </span>
                  </div>
                </div>

                {canManage ? (
                  <div className="flex items-center gap-1.5">
                    {m.role === "OWNER" ? (
                      <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold uppercase">
                        Propietario
                      </span>
                    ) : (
                      <>
                        <select
                          defaultValue={m.role}
                          onChange={(e) => handleRoleChange(m.userId, e.target.value as Role)}
                          className="text-[10px] border rounded px-1.5 py-0.5 bg-gray-50 text-gray-700 font-medium focus:outline-none"
                        >
                          <option value="VIEWER">Lector</option>
                          <option value="MEMBER">Miembro</option>
                          <option value="ADMIN">Admin</option>
                        </select>

                        <button
                          onClick={() => handleRemoveMember(m.userId)}
                          className="text-gray-400 hover:text-red-600 text-xs px-1 font-bold"
                          title="Remover miembro"
                        >
                          ✕
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-medium uppercase">
                    {m.role}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
