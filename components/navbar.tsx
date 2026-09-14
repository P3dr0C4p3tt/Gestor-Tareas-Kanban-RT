// components/navbar.tsx
import { auth, signOut } from "@/auth";
import Image from "next/image";

export async function Navbar() {
  const session = await auth();

  return (
    <header className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold text-blue-600">KanbanRT</span>
        </div>

        <div className="flex items-center space-x-4">
          {session?.user && (
            <div className="flex items-center space-x-3">
              {session.user.image && (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "Avatar"}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              )}
              <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                {session.user.name}
              </span>
            </div>
          )}

          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button
              type="submit"
              className="text-xs px-3 py-1.5 border rounded-md text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}