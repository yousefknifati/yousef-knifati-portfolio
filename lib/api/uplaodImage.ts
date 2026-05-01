import api from "@/lib/config/axiosInstance";

export type UploadImageResponse = {
  url: string;
  id?: string;
  fileName?: string;
};

export async function uploadImage(
  file: File,
  isVideo: boolean = false
): Promise<UploadImageResponse> {
  const formData = new FormData();

  // If your backend expects a different field name (e.g. "file" or "File"), change "Image" accordingly.
  formData.append("Image", file);

  const response = await api.post<UploadImageResponse>(
    "/api/Image/UploadImage",
    formData,
    {
      params: {
        IsVideo: isVideo,
      },
    }
  );

  return response.data;
}
