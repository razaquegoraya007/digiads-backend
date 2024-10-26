import React from "react";
import { AppBar, Toolbar, Typography, Container, Box } from "@mui/material";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Layout = ({ children }) => {
  return (
    <>
      <html>
        <body>
          <Container maxWidth="md" sx={{ mt: 4 }}>
            <Box component="main">{children}</Box>
          </Container>

          <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar
          />
        </body>
      </html>
    </>
  );
};

export default Layout;
