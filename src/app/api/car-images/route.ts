import crypto from "node:crypto";
import { getSessionUser } from "@/lib/auth";
import { getSupabaseStorageClient } from "@/lib/supabase-storage";

const BUCKET = "car-images";
const MAX_FILE_SIZE = 4 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return Response.json({ error: "You must be logged in to upload an image." }, { status: 401 });
  }

  const formData = await request.formData();
  const image = formData.get("image");

  if (!(image instanceof File) || image.size === 0) {
    return Response.json({ error: "Please select an image to upload." }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(image.type)) {
    return Response.json({ error: "Upload a JPG, PNG, or WebP image." }, { status: 415 });
  }

  if (image.size > MAX_FILE_SIZE) {
    return Response.json({ error: "Image must be 4 MB or smaller." }, { status: 413 });
  }

  const extension = image.type === "image/jpeg" ? "jpg" : image.type.split("/")[1];
  const objectPath = `${user.id}/${crypto.randomUUID()}.${extension}`;
  const supabase = getSupabaseStorageClient();
  const { error } = await supabase.storage.from(BUCKET).upload(objectPath, image, {
    contentType: image.type,
    cacheControl: "31536000",
    upsert: false,
  });

  if (error) {
    console.error("Car image upload failed:", error.message);
    return Response.json({ error: "Image upload failed. Please try again." }, { status: 502 });
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(objectPath);
  return Response.json({ url: data.publicUrl });
}
