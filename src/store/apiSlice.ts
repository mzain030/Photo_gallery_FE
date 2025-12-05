
import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";

interface RefreshResponse {
  access: string;
}

const baseQuery = fetchBaseQuery({
  baseUrl: "http://127.0.0.1:8000/api/",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}> =
  async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result?.error?.status === 401) {
      const refresh_token = localStorage.getItem("refresh_token");
      if (refresh_token) {
        const refreshResult = await baseQuery(
          { url: "auth/refresh/", method: "POST", body: { refresh: refresh_token } },
          api,
          extraOptions
        ) as { data?: RefreshResponse };

        if (refreshResult?.data?.access) {
          localStorage.setItem("access_token", refreshResult.data.access);
          result = await baseQuery(args, api, extraOptions);
        } else {
          localStorage.clear();
          window.location.href = "/login"; // force logout
        }
      }
    }

    return result;
  };

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Auth"],
  endpoints: () => ({}),
});
