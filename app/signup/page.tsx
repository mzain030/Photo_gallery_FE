
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useSignupMutation } from "@/src/store/authApi";

const SignupSchema = Yup.object().shape({
name: Yup.string().required("Name is required"),
email: Yup.string().email("Invalid email").required("Email is required"),
password: Yup.string().min(6, "Password too short").required("Password is required"),
confirmPassword: Yup.string()
.oneOf([Yup.ref("password")], "Passwords must match")
.required("Confirm password is required"),
});

export default function SignupForm() {
const router = useRouter();
const [signup, { isLoading }] = useSignupMutation();

return ( 
<div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md"> 
  <h2 className="text-2xl font-bold text-center mb-6 text-black">Sign Up</h2>

  <Formik
    initialValues={{ name: "", email: "", password: "", confirmPassword: "" }}
    validationSchema={SignupSchema}
    onSubmit={async (values, { setFieldError }) => {
      try {
        const res: any = await signup(values).unwrap();
        localStorage.setItem("access_token", res.access);
        localStorage.setItem("refresh_token", res.refresh);
        router.push("/login");
      } catch (err: any) {
        const errorMsg = err?.data?.detail ?? err.message ?? "Signup failed";
        setFieldError("email", errorMsg);
      }
    }}
  >
    {({ isSubmitting }) => (
      <Form className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <Field
            name="name"
            type="text"
            placeholder="Enter your name"
            className="w-full p-3 text-black border border-gray-300 outline-none focus:border-cyan-500"
          />
          <ErrorMessage name="name" component="div" className="text-red-600 text-sm" />
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <Field
            name="email"
            type="email"
            placeholder="Enter your email"
            className="w-full p-3 text-black border border-gray-300 outline-none focus:border-cyan-500"
          />
          <ErrorMessage name="email" component="div" className="text-red-600 text-sm" />
        </div>

        <div>
          <label className="block text-sm font-medium">Password</label>
          <Field
            name="password"
            type="password"
            placeholder="Enter your password"
            className="w-full p-3 text-black border border-gray-300 outline-none focus:border-cyan-500"
          />
          <ErrorMessage name="password" component="div" className="text-red-600 text-sm" />
        </div>

        <div>
          <label className="block text-sm font-medium">Confirm Password</label>
          <Field
            name="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            className="w-full p-3 text-black border border-gray-300 outline-none focus:border-cyan-500"
          />
          <ErrorMessage name="confirmPassword" component="div" className="text-red-600 text-sm" />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="w-full p-3 bg-gradient-to-r from-blue-700 via-cyan-600 to-cyan-200 text-white rounded-full text-lg font-medium hover:opacity-90 transition cursor-pointer"
        >
          {isLoading ? "Signing up..." : "Sign Up"}
        </button>
      </Form>
    )}
  </Formik>
</div>
);
}






