import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { KanbanBoard } from "@/components/kanban-board";
import { BoardHeader } from "@/components/board-header";

interface BoardPageProps {
  params: Promise<{ boardId: string }>;
}

export default async function BoardPage({ params }: BoardPageProps) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;
  const { boardId } = await params;

  const board = await prisma.board.findFirst({
    where: {
      id: boardId,
      members: { some: { userId } },
    },
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
      columns: {
        include: {
          tasks: true,
        },
      },
    },
  });

  if (!board) redirect("/dashboard");

  const currentMember = board.members.find((m) => m.userId === userId);
  if (!currentMember) redirect("/dashboard");

  const userRole: "OWNER" | "MEMBER" | "VIEWER" =
    currentMember.role === "ADMIN" ? "OWNER" : currentMember.role;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <BoardHeader
        boardId={board.id}
        title={board.title}
        members={board.members}
        userRole={userRole}
      />

      <main className="flex-1 p-6 overflow-x-auto">
        <KanbanBoard
          boardId={board.id}
          userRole={userRole}
          initialColumns={board.columns.map(({ tasks, ...column }) => ({
            ...column,
            name: column.title,
            cards: tasks,
          }))}
        />
      </main>
    </div>
  );
}