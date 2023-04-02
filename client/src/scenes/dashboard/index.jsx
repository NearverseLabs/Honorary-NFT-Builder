import { Download, Twitter } from "@mui/icons-material";
import {
  Box,
  Typography,
  useTheme,
  FormControl,
  MenuItem,
  Select,
  useMediaQuery,
  Button,
} from "@mui/material";
import { options } from "components/options";
import { AllOptions } from "components/options/mapping";
import React, { useState } from "react";

function drawWindow(windowWidth, windowHeight, divs) {
  // Create a canvas element
  const canvas = document.createElement("canvas");

  // Set the canvas dimensions to match the window dimensions
  canvas.width = windowWidth;
  canvas.height = windowHeight;

  // Get the canvas context
  const context = canvas.getContext("2d");

  // Draw a background rectangle
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, windowWidth, windowHeight);

  // Loop through the divs and draw each one
  divs.forEach((div) => {
    // Get the div's position and dimensions
    const rect = div.getBoundingClientRect();

    // Draw the div
    context.fillStyle = "#000000";
    context.fillRect(rect.left, rect.top, rect.width, rect.height);
  });

  // Return the canvas
  return canvas;
}

const Dashboard = () => {
  const theme = useTheme();
  const [background, setBackground] = useState("Yellow");
  const [eyes, setEyes] = useState("none");
  const [hair, setHair] = useState("none");
  const [mouth, setMouth] = useState("none");
  const [outfit, setOutfit] = useState("none");
  const [body, setBody] = useState("none");

  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const handleDownload = () => {};

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        mt: "70px",
        gap: "20px",
        mb: "90px",
        paddingBottom: "90px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "20px",
        }}
      >
        {/* cp1 */}
        <Box>
          <Typography
            sx={{
              color: theme.palette.neutral.main,
              fontFamily: "Poppins",
              textAlign: "center",
              fontWeight: 900,
              fontSize: "40px",
              lineHeight: "60px",
              margin: "0 5%",
            }}
          >
            Build your Honorary - Cynic Society
          </Typography>
          <Typography
            sx={{
              color: "#ffff",
              fontFamily: "Poppins",
              fontWeight: 400,
              textAlign: "center",
              fontStyle: "normal",
              wordWrap: "break-word",
              width: "80%",
              fontSize: "24px",
              lineHeight: "160%",
              letterSpacing: "-0.01em",
              marginLeft: "10%",
            }}
          >
            You earned an honorary merely for being here, surviving the bear
            market and a ton of soft rugs.
          </Typography>
        </Box>
        {/* cp2 */}
        <Box
          sx={{
            display: "flex",
            flexDirection: isTablet ? "column" : "row",
            gap: "45px",
            padding: "0 5%",
            // flexWrap: "wrap",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          {/* option box */}
          <Box>
            <FormControl
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                alignItems: "center",
                justifyContent: "space-between",
                "& .MuiSelect-select": {
                  fontWeight: 400,
                  fontFamily: "Poppins",
                  letterSpacing: "-0.02em",
                  lineHeight: "30px",
                  fontSize: "20px",
                  fontStyle: "normal",
                },
              }}
            >
              <Select
                sx={{
                  color: "#0D7F41",
                  backgroundColor: theme.palette.neutral.main,
                  width: "276px",
                  height: "50px",
                  // change the style of menu item
                }}
                variant="outlined"
                displayEmpty
                required
                inputProps={{ "aria-label": "Without label" }}
                onChange={(e) => setBackground(e.target.value)}
                defaultValue={"Select Background"}
                // change the style of menu item
              >
                {Object.keys(AllOptions.background).map((value, index) => (
                  <MenuItem key={index} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
              <Select
                sx={{
                  color: "#0D7F41",
                  backgroundColor: theme.palette.neutral.main,
                  width: "276px",
                  height: "50px",
                }}
                variant="outlined"
                displayEmpty
                required
                inputProps={{ "aria-label": "Without label" }}
                defaultValue={"Select Body"}
                onChange={(e) => setBody(e.target.value)}
              >
                {Object.keys(AllOptions.body).map((value, index) => (
                  <MenuItem key={index} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
              <Select
                sx={{
                  color: "#0D7F41",
                  backgroundColor: theme.palette.neutral.main,
                  width: "276px",
                  height: "50px",
                }}
                variant="outlined"
                displayEmpty
                required
                inputProps={{ "aria-label": "Without label" }}
                defaultValue={"Select Eyes"}
                onChange={(e) => setEyes(e.target.value)}
              >
                {Object.keys(AllOptions.eyes).map((value, index) => (
                  <MenuItem key={index} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
              <Select
                sx={{
                  color: "#0D7F41",
                  backgroundColor: theme.palette.neutral.main,
                  width: "276px",
                  height: "50px",
                }}
                variant="outlined"
                displayEmpty
                required
                inputProps={{ "aria-label": "Without label" }}
                defaultValue={"Select Hair"}
                onChange={(e) => setHair(e.target.value)}
              >
                {Object.keys(AllOptions.hair).map((value, index) => (
                  <MenuItem key={index} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
              <Select
                sx={{
                  color: "#0D7F41",
                  backgroundColor: theme.palette.neutral.main,
                  width: "276px",
                  height: "50px",
                }}
                variant="outlined"
                displayEmpty
                required
                inputProps={{ "aria-label": "Without label" }}
                defaultValue={"Select Mouth"}
                onChange={(e) => setMouth(e.target.value)}
              >
                {Object.keys(AllOptions.mouth).map((value, index) => (
                  <MenuItem key={index} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
              <Select
                sx={{
                  color: "#0D7F41",
                  backgroundColor: theme.palette.neutral.main,
                  width: "276px",
                  height: "50px",
                }}
                variant="outlined"
                displayEmpty
                required
                inputProps={{ "aria-label": "Without label" }}
                defaultValue={"Select Outfit"}
                onChange={(e) => setOutfit(e.target.value)}
              >
                {Object.keys(AllOptions.outfit).map((value, index) => (
                  <MenuItem key={index} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          {/* image Box */}
          <Box
            id="imageBox"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: isTablet ? "auto" : "100%",
              height: "400px",
              // backgroundColor: theme.palette.neutral.main,
              borderRadius: "10px",
              position: "relative",
              backgroundImage: `url(${AllOptions.background[background]})`,
              // margin: "0 10%",
            }}
          >
            <Box
              component="img"
              src={AllOptions.body[body]}
              width="400px"
              sx={{ zIndex: "1" }}
            />
            <Box
              component="img"
              src={AllOptions.eyes[eyes]}
              width="400px"
              sx={{ position: "absolute", zIndex: "1" }}
            />
            <Box
              component="img"
              src={AllOptions.outfit[outfit]}
              width="400px"
              sx={{ position: "absolute", zIndex: "1" }}
            />
            <Box
              component="img"
              src={AllOptions.mouth[mouth]}
              width="400px"
              sx={{ position: "absolute", zIndex: "1" }}
            />
            <Box
              component="img"
              src={AllOptions.hair[hair]}
              width="400px"
              sx={{ position: "absolute", zIndex: "1" }}
            />

            <Download
              onClick={handleDownload}
              sx={{
                position: "absolute",
                backgroundColor: "#0D7F41",
                color: "#ffff",
                borderRadius: "4px",
                width: "2.5rem",
                height: "2.2rem",
                padding: "8px",
                margin: "10px",
                top: "10px", // Move 10 pixels down from the top
                right: "10px", // Move 10 pixels from the right
              }}
            />
          </Box>
        </Box>
      </Box>
      {/* cp3 */}
      <Box
        sx={{
          ml: isTablet ? "0" : "280px",
        }}
      >
        <Button
          sx={{
            backgroundColor: "#ffff",
            color: "#1DA1F2",
            width: "276px",
            textTransform: "none",
            gap: "10px",

            "&:hover": {
              backgroundColor: "#ffff",
            },
          }}
        >
          <Twitter /> Tweet my honorary
        </Button>
      </Box>
    </Box>
  );
};

export default Dashboard;
