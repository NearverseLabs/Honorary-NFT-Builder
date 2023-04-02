import React from "react";

import { FaTwitter, FaDiscord } from "react-icons/fa";

import FlexBetween from "components/FlexBetween";

import { AppBar, Box, Toolbar, useTheme } from "@mui/material";
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
          <Box component="img" src={Logo} />
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
