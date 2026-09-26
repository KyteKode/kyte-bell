import { fail } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions: Actions = {
    default: async ({ request, locals: { supabase } }) => {
        const formData = await request.formData();
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const displayName = formData.get("displayName") as string;

        const { data, error } = await supabase.auth.signUp({ email, password });

        if (error) {
            return fail(400, { error: error.message });
        }

        const userId = data.user?.id;

        if (!userId) {
            return fail(400, { error: "signup succeeded but no user was returned" });
        }

        const { error: profileError } = await supabase
            .from("profiles")
            .insert({ user_id: userId, display_name: displayName });

        if (profileError) {
            return fail(400, { error: profileError.message });
        }

        return { success: true };
    }
};