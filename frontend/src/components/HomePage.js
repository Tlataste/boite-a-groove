import React from "react";
import Box from "@mui/material/Box";
import Menu from "./Menu";

export default function HomePage() {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        background: "linear-gradient(to right, #F59225, #F8431D)",
      }}
    >
      <Menu />
    </Box>
  );
}
