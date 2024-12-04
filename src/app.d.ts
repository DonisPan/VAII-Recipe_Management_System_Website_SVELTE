// See https://svelte.dev/docs/kit/types#app.d.ts
// for information aboutP these interfaces
import {SupabaseClient, Session}	 from "@supabase/supabase-js";

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			currentUser: string;
			currentRole: string;
		}
		 interface PageData {
			 supabase: SupabaseClient
			 session: Session | null
		 }
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
