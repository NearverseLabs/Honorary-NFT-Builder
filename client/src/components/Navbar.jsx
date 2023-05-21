import React from "react";

import { FaTwitter, FaDiscord } from "react-icons/fa";

import FlexBetween from "components/FlexBetween";

import { AppBar, Box, Toolbar, Typography, useTheme } from "@mui/material";
// import the svg logo
import Logo from "assets/logo.png";

const Navbar = ({ user, isSidebarOpen, setIsSidebarOpen }) => {
  const theme = useTheme();

  return (
    <AppBar
      sx={{
        position: "static",
        background: theme.palette.primary[400],
        boxShadow: "none",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* LEFT SIDE */}
        <FlexBetween>
          {/* <Box component="img" src={Logo} /> */}
          <Typography sx={{
            fontFamily:"Zen Dots",
            fontStyle:"normal",
            fontWeight: "400",
            fontSize:"24px",
            textAlign:"center",
            background: "linear-gradient(89.64deg, #D8C74F 19.51%, #3BAB6E 63.86%, #3CBE78 101.29%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textFillColor: "transparent",
          }}>Felix Collective</Typography>
        </FlexBetween>

        {/* RIGHT SIDE */}
        <FlexBetween gap="1.5rem">
          <FaDiscord size="21px" color="#fff" />
          <FaTwitter size="21px" color="#fff" />
        </FlexBetween>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
