"use client";

import { useState } from "react";
import Link from "next/link";
import { MembersModal } from "@/components/members-modal";

interface BoardHeaderProps {
  boardId: string;
  title: string;
  members: any[];
  userRole?: string;
}

export function BoardHeader({ 
  boardId, 
  title, 
  members, 
  userRole
}: BoardHeaderProps) {
  const [isMembersOpen, setIsMembersOpen] = useState(false);

  return (
    <>
      <header className="bg-white border-b px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard"
            className="text-xs font-medium text-gray-500 hover:text-gray-800 transition-colors"
          >
            ← Volver al Dashboard
          </Link>
          <span className="text-gray-300">|</span>
          <h1 className="text-lg font-bold text-gray-800">{title}</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMembersOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-800 bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-50 transition-colors"
          >
            👥 Miembros ({members.length})
          </button>
        </div>
      </header>

      <MembersModal
        boardId={boardId}
        members={members}
        userRole={userRole || "VIEWER"}
        isOpen={isMembersOpen}
        onClose={() => setIsMembersOpen(false)}
      />
    </>
  );
}