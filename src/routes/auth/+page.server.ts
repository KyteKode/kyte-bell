import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
    const { user } = await safeGetSession();

    if (user) {
        redirect(303, '/');
    }

    return {};
};

export const actions: Actions = {
    login: async ({ request, locals: { supabase } }) => {
        const formData = await request.formData();
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            return fail(400, { error: error.message });
        }

        redirect(303, "/");
    },
    signup: async ({ request, locals: { supabase } }) => {
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
    },
    logout: async ({ locals: { supabase } }) => {
        await supabase.auth.signOut();
        throw redirect(303, "/");
    }
};