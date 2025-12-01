

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLoginMutation, useSignupMutation } from "@/src/store/authApi";
import { useDispatch } from "react-redux";
import { setTokens } from "@/src/store/authSlice";

// ----------------- Validation Schemas -----------------
const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().required("Required"),
});

const SignupSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(6, "Password too short").required("Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Required"),
});

// ----------------- Main Component -----------------
export default function LoginForm({ defaultMode = "login" }) {
  const [isLoginMode, setIsLoginMode] = useState(defaultMode === "login");
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [signup, { isLoading: isSignupLoading }] = useSignupMutation();
  const dispatch = useDispatch();
  const router = useRouter();

  return (
    <div className="w-[430px] bg-white p-8 rounded-2xl shadow-lg mx-auto mt-10">
      {/* Header */}
      <h2 className="text-3xl font-semibold text-center mb-4">
        {isLoginMode ? "Login" : "Sign Up"}
      </h2>

      {/* Toggle Tabs */}
      <div className="relative flex h-12 mb-6 border border-gray-300 rounded-full overflow-hidden">
        <button
          className={`w-1/2 text-lg font-medium z-10 ${
            isLoginMode ? "text-white" : "text-black"
          }`}
          onClick={() => setIsLoginMode(true)}
        >
          Login
        </button>

        <button
          className={`w-1/2 text-lg font-medium z-10 ${
            !isLoginMode ? "text-white" : "text-black"
          }`}
          onClick={() => setIsLoginMode(false)}
        >
          Signup
        </button>

        <div
          className={`absolute top-0 h-full w-1/2 rounded-full bg-gradient-to-r from-blue-700 via-cyan-600 to-cyan-200 transition-all ${
            isLoginMode ? "left-0" : "left-1/2"
          }`}
        ></div>
      </div>

      {/* Formik Form */}
      <Formik
        initialValues={
          isLoginMode
            ? { email: "", password: "" }
            : { name: "", email: "", password: "", confirmPassword: "" }
        }
        validationSchema={isLoginMode ? LoginSchema : SignupSchema}
        onSubmit={async (values, { setFieldError }) => {
          try {
            let res;

            if (isLoginMode) {
              res = await login({
                email: values.email,
                password: values.password,
              }).unwrap();
            } else {
              res = await signup({
                name: values.name,
                email: values.email,
                password: values.password,
                confirmPassword: values.confirmPassword, // required by backend
              }).unwrap();
            }

            // Save both access & refresh tokens
            if (res.access && res.refresh) {
              dispatch(
                setTokens({
                  access: res.access,
                  refresh: res.refresh,
                })
              );
            }

            router.push("/gallery"); // Redirect after success
          } catch (err: any) {
            const errorMsg = err?.data?.error || err?.data?.detail || "Invalid credentials";
            setFieldError("email", errorMsg);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            {!isLoginMode && (
              <div>
                <label className="block text-sm font-medium">Name</label>
                <Field
                  name="name"
                  className="w-full p-3 border-b-2 border-gray-300 outline-none focus:border-cyan-500"
                />
                <ErrorMessage
                  name="name"
                  className="text-red-600 text-sm"
                  component="div"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium">Email</label>
              <Field
                name="email"
                type="email"
                className="w-full p-3 border-b-2 border-gray-300 outline-none focus:border-cyan-500"
              />
              <ErrorMessage
                name="email"
                className="text-red-600 text-sm"
                component="div"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Password</label>
              <Field
                name="password"
                type="password"
                className="w-full p-3 border-b-2 border-gray-300 outline-none focus:border-cyan-500"
              />
              <ErrorMessage
                name="password"
                className="text-red-600 text-sm"
                component="div"
              />
            </div>

            {!isLoginMode && (
              <div>
                <label className="block text-sm font-medium">
                  Confirm Password
                </label>
                <Field
                  name="confirmPassword"
                  type="password"
                  className="w-full p-3 border-b-2 border-gray-300 outline-none focus:border-cyan-500"
                />
                <ErrorMessage
                  name="confirmPassword"
                  className="text-red-600 text-sm"
                  component="div"
                />
              </div>
            )}

            {isLoginMode && (
              <div className="text-right">
                <a href="#" className="text-cyan-600 hover:underline">
                  Forgot password?
                </a>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || isLoginLoading || isSignupLoading}
              className="w-full p-3 bg-gradient-to-r from-blue-700 via-cyan-600 to-cyan-200 text-white rounded-full text-lg font-medium hover:opacity-90 transition"
            >
              {isLoginMode
                ? isLoginLoading
                  ? "Logging in..."
                  : "Login"
                : isSignupLoading
                ? "Signing up..."
                : "Signup"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
