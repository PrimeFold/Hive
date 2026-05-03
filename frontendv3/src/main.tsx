import ReactDOM from "react-dom/client";
import React from "react";


import { RouterProvider } from "@tanstack/react-router";
import { router } from "./utils/router";



ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);