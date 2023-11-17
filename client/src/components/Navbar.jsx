import React from "react";

import { FaDiscord } from "react-icons/fa";
import { TfiWorld } from "react-icons/tfi";

import FlexBetween from "components/FlexBetween";

import { AppBar, Box, Toolbar } from "@mui/material";
// import the svg logo
import Logo from "assets/logo.png";

const Navbar = ({ user, isSidebarOpen, setIsSidebarOpen }) => {
  return (
    <AppBar
      sx={{
        position: "static",
        background: "transparent",
        boxShadow: "none",
        padding: "0, 2rem",
        mt: "1rem",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* LEFT SIDE */}
        <FlexBetween>
          <Box
            component="img"
            sx={{
              position: "relative",
              zIndex: "1",
            }}
            width={"200px"}
            height={"80px"}
            src={Logo}
          />
          {/* <Typography
            sx={{
              fontFamily: "Zen Dots",
              fontStyle: "normal",
              fontWeight: "400",
              fontSize: "24px",
              textAlign: "center",
              background:
                "linear-gradient(89.64deg, #D8C74F 19.51%, #3BAB6E 63.86%, #3CBE78 101.29%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textFillColor: "transparent",
            }}
          >
            Felix Collective
          </Typography> */}
        </FlexBetween>

        {/* RIGHT SIDE */}
        <FlexBetween
          gap="1rem"
          sx={{
            mt: "18px",
          }}
        >
          <a
            href="https://discord.gg/FsWnvJzRp7"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaDiscord size="30px" color="#fff" />
          </a>
          <a
            href="https://twitter.com/FelixCollective"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              width={"30px"}
              viewBox="0 0 24 24"
              aria-hidden="true"
              class="r-1nao33i r-4qtqp9 r-yyyyoo r-16y2uox r-8kz0gk r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-lrsllp"
            >
              <g>
                <path
                  fill="white"
                  d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                ></path>
              </g>
            </svg>
          </a>
          <a
            href="https://www.felixcollective.app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <TfiWorld size="30px" color="#fff" />
          </a>
        </FlexBetween>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
