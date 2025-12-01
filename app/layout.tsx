"use client";

import { Provider } from "react-redux";
import { store } from "../src/store/store"
import './globals.css';


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <Provider store={store}>
          {children}
        </Provider>
      </body>
    </html>
  );
}
