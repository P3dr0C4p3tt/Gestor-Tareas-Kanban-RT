// app/dashboard/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DashboardClient } from "./dashboard-client";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const boards = await prisma.board.findMany({
    where: {
      members: {
        some: {
          userId: session.user.id,
        },
      },
    },
    include: {
      columns: {
        include: {
          tasks: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const dashboardBoards = boards.map((board) => ({
    ...board,
    columns: board.columns.map((column) => ({
      ...column,
      cards: column.tasks,
    })),
  })) as any;

  return <DashboardClient boards={dashboardBoards} user={session.user} />;
}