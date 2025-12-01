import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result: any = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    console.log("Access token expired... Trying refresh");

    const refresh_token = localStorage.getItem("refresh_token");

    // If refresh token exists
    if (refresh_token) {
      const refreshResult: any = await baseQuery(
        {
          url: "auth/refresh/",
          method: "POST",
          body: { refresh: refresh_token },
        },
        api,
        extraOptions
      );

      if (refreshResult?.data) {
        // Save new access token
        localStorage.setItem("access_token", refreshResult.data.access);

        // Retry original request with new token
        result = await baseQuery(args, api, extraOptions);
      } else {
        console.log("Refresh failed. Logging out...");
        localStorage.clear();
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


