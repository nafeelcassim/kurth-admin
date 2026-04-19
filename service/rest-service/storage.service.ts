import { api } from "../http.service";

type AdminUploadUrlResponse = {
  url: string;
  fields: Record<string, string>;
  key: string;
};

export const StorageService = {
  getAdminUploadUrl: async (args: { folder: string; contentType: string }) => {
    const res = await api.get<AdminUploadUrlResponse>("/storage/admin-upload-url", {
      params: {
        key: args.folder,
        contentType: args.contentType,
      },
    });
    return res.data;
  },
};

export async function uploadToPresignedPost(args: {
  url: string;
  fields: Record<string, string>;
  file: File;
}) {
  const form = new FormData();

  Object.entries(args.fields).forEach(([k, v]) => {
    form.append(k, v);
  });

  form.append("file", args.file);

  const res = await fetch(args.url, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    throw new Error(`Upload failed (${res.status})`);
  }
}
