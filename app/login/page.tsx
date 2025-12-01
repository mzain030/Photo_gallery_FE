"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLoginMutation } from "@/src/store/authApi";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().required("Required"),
});

export default function LoginForm() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    setIsLoginMode(pathname === "/login");
  }, [pathname]);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6 text-black">
        Login
      </h2>

      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={async (values, { setFieldError }) => {
          try {
            const res: any = await login(values).unwrap();

            localStorage.setItem("access_token", res.access);
            localStorage.setItem("refresh_token", res.refresh);

            router.push("/gallery");
          } catch (err: any) {
            const errorMsg = err?.data?.detail ?? err.message ?? "Login failed";
            setFieldError("email", errorMsg);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Email</label>
              <Field
                name="email"
                type="email"
                placeholder="Enter your email"
                className="w-full p-3 text-black border border-gray-300 outline-none focus:border-cyan-500"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-600 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Password</label>
              <Field
                name="password"
                type="password"
                placeholder="Enter your password"
                className="w-full p-3 text-black border border-gray-300 outline-none focus:border-cyan-500"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-600 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full p-3 bg-gradient-to-r from-blue-700 via-cyan-600 to-cyan-200 text-white rounded-full text-lg font-medium hover:opacity-90 transition cursor-pointer"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </Form>
        )}
      </Formik>
    </div>

  );
}