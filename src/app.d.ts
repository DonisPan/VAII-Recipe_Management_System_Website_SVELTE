// See https://svelte.dev/docs/kit/types#app.d.ts
import {SupabaseClient, Session} from "@supabase/supabase-js";

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			currentUser: string | null;
			currentRole: string | null;
			currentEmail: string | null;
			currentName: string | null;
		}
		 interface PageData {
			 supabase: SupabaseClient
			 session: Session | null
		 }
	}
}

export {};
