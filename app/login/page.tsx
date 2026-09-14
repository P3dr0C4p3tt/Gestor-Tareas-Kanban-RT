import { auth, signIn, signOut } from "@/auth";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function LoginPage({
  searchParams,
    }: {
      searchParams: Promise<{ error?: string }>;
    }) {
      const session = await auth();
      const { error } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-center space-y-6">
        
        {/* Mensaje si se canceló la autenticación */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg">
            Se canceló el inicio de sesión. Por favor, intenta de nuevo.
          </div>
        )}

        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bienvenido a Kanban</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gestiona tus proyectos de forma colaborativa
          </p>
        </div>

        {session?.user ? (
          /* Opciones cuando YA EXISTE una sesión activa */
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-3 p-3 bg-gray-50 border rounded-lg text-left">
              {session.user.image && (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "Usuario"}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              )}
              <div className="truncate">
                <p className="text-sm font-semibold text-gray-900">
                  {session.user.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {session.user.email}
                </p>
              </div>
            </div>

            {/* Opción 1: Continuar al Dashboard */}
            <form
              action={async () => {
                "use server";
                redirect("/dashboard");
              }}
            >
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg transition-colors shadow-sm"
              >
                Continuar al Dashboard →
              </button>
            </form>

            {/* Opción 2: Cerrar sesión e iniciar con otra cuenta */}
            <form
              action={async () => {
                "use server";
                // Forzamos el cierre de sesión y la redirección con re-autenticación de GitHub
                await signOut({ redirectTo: "/login" });
              }}
            >
              <button
                type="submit"
                className="w-full py-2 px-4 bg-white hover:bg-gray-50 text-gray-700 font-medium text-xs rounded-lg border transition-colors"
              >
                Usar otra cuenta de GitHub
              </button>
            </form>
          </div>
        ) : (
          /* Botón estándar de inicio de sesión */
          <form
            action={async () => {
              "use server";
              await signIn("github", { redirectTo: "/dashboard" }, { prompt: "consent" });
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-900 hover:bg-gray-800 text-white font-medium text-sm rounded-lg transition-colors shadow-sm"
            >
              Iniciar sesión con GitHub
            </button>
          </form>
        )}
      </div>
    </div>
  );
}