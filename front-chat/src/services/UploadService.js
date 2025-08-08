import { httpClient } from "../config/AxiosHelper";

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await httpClient.post(`/api/v1/uploads`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data; // { url, fileName, contentType, sizeBytes }
};
