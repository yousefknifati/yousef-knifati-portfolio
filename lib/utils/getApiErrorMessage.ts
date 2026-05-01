import axios from "axios";

type ApiErrorShape = {
  errorMessage?: string;
  message?: string;
};

export function getApiErrorMessage(err: unknown, fallback = "Something went wrong.") {
  if (axios.isAxiosError<ApiErrorShape>(err)) {
    return (
      err.response?.data?.errorMessage ??
      err.response?.data?.message ??
      err.message ??
      fallback
    );
  }

  if (err instanceof Error) return err.message || fallback;

  return fallback;
}
