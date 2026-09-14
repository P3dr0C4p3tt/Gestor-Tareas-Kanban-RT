import { signIn } from "@/auth";

export function LoginButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("github", { redirectTo: "/dashboard" });
      }}
    >
      <button
        type="submit"
        className="px-4 py-2 bg-black text-white rounded-md font-medium hover:bg-gray-800 transition-colors"
      >
        Iniciar sesión con GitHub
      </button>
    </form>
  );
}