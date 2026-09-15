"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CreateBoardModal } from "@/components/create-board-modal";
import { deleteBoard } from "@/app/actions/board-actions";
import { SignOutButton } from "@/components/sign-out-button";
import { toast } from "sonner";

interface Board {
  id: string;
  title: string;
  columns: {
    tasks?: { id: string }[];
    cards?: { id: string }[];
  }[];
}

interface UserProps {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export function DashboardClient({ boards, user }: { boards: Board[]; user: UserProps }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async (e: React.MouseEvent, boardId: string) => {
  e.preventDefault();

  if (!confirm("¿Seguro que deseas eliminar este tablero?")) return;

  const toastId = toast.loading("Eliminando tablero...");

  const result = await deleteBoard(boardId);

  if (result.success) {
    toast.success("Tablero eliminado correctamente", { id: toastId });
  } else {
    toast.error(result.error || "Error al eliminar el tablero", { id: toastId });
  }
};
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b px-6 py-3 flex items-center justify-between shadow-sm">
        <h1 className="text-lg font-bold text-gray-800">Mis Tableros</h1>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name || "Avatar"}
                width={32}
                height={32}
                className="rounded-full border border-gray-200"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                {user.name?.[0] || user.email?.[0] || "U"}
              </div>
            )}

            <div className="flex flex-col">
              <span className="text-xs font-semibold text-gray-800 leading-tight">
                {user.name || "Usuario"}
              </span>
              <span className="text-[10px] text-gray-400 leading-tight">
                {user.email}
              </span>
            </div>
          </div>

          <div className="h-4 w-px bg-gray-200" />

          <SignOutButton />
        </div>
      </header>

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-gray-600">
            Selecciona un tablero para comenzar a trabajar o crea uno nuevo.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-xs font-semibold hover:bg-blue-700 transition-colors shadow-sm"
          >
            + Nuevo Tablero
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/30 transition-all group"
          >
            <span className="text-2xl font-light group-hover:scale-110 transition-transform">
              +
            </span>
            <span className="text-xs font-medium mt-1">Crear nuevo tablero</span>
          </button>

          {boards.map((board) => {
            const totalCards = board.columns.reduce(
              (acc, col) => acc + (col.tasks?.length || col.cards?.length || 0),
              0
            );

            return (
              <Link
                key={board.id}
                href={`/board/${board.id}`}
                className="h-32 bg-white border border-gray-200 rounded-lg p-4 flex flex-col justify-between hover:border-blue-400 hover:shadow-md transition-all relative group"
              >
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm line-clamp-1">
                    {board.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    {totalCards} {totalCards === 1 ? "tarea" : "tareas"} en total
                  </p>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <span className="text-[10px] text-blue-600 font-medium">
                    Ver tablero →
                  </span>
                  <button
                    onClick={(e) => handleDelete(e, board.id)}
                    className="text-gray-300 hover:text-red-600 p-1 transition-colors opacity-0 group-hover:opacity-100"
                    title="Eliminar tablero"
                  >
                    🗑️
                  </button>
                </div>
              </Link>
            );
          })}
        </div>
      </main>

      <CreateBoardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}