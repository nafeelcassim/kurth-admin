import type { AxiosError } from "axios";

type ApiErrorPayload = {
  message?: string;
  error?: string;
  statusCode?: number;
};

export function getApiErrorMessage(error: unknown): string {
  const axiosError = error as AxiosError<ApiErrorPayload>;
  return (
    axiosError?.response?.data?.message ||
    axiosError?.message ||
    "Something went wrong"
  );
}
