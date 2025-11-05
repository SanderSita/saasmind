"use server";

import { supabaseAdmin } from "@/utils/supabase/admin";

// Upload an image File to Supabase Storage and return a public URL.
// bucketName: default to 'chat-images' — ensure this bucket exists in your Supabase project.
export async function uploadImage(file, projectId, bucketName = "chat-images") {
	try {
		console.log("upload image called");
		if (!file) return null;

		const timestamp = Date.now();
		const safeName = file.name.replace(/[^a-zA-Z0-9_.-]/g, "_");
		const path = `${projectId || "public"}/${timestamp}_${safeName}`;

		// upload the file (File/Blob) to storage
		const { data: uploadData, error: uploadError } =
			await supabaseAdmin.storage
				.from(bucketName)
				.upload(path, file, { cacheControl: "3600", upsert: false });

		if (uploadError) {
			console.error("Supabase upload error:", uploadError);
			throw uploadError;
		}

		// get a public URL for the uploaded file
		const { data: publicData, error: publicError } =
			await supabaseAdmin.storage.from(bucketName).getPublicUrl(path);

		if (publicError) {
			console.error("Supabase getPublicUrl error:", publicError);
			throw publicError;
		}

		return publicData?.publicUrl ?? null;
	} catch (err) {
		console.error("uploadImage error:", err);
		return null;
	}
}
