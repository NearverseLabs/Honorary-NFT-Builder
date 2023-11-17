import {
  Close,
  Download,
  Pending,
  RotateRight,
  SendOutlined,
  Task,
} from "@mui/icons-material";
import {
  Box,
  Typography,
  useTheme,
  MenuItem,
  Select,
  useMediaQuery,
  Button,
  ListItemIcon,
  FormControl,
} from "@mui/material";

import { textPrompt } from "./aiPowered";
import { AllOptions, SmallSizeOptions } from "components/options/mapping";
import React, { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";

import { useGetDalleImageMutation } from "state/api";

function randomPrompt() {
  return textPrompt[Math.floor(Math.random() * 20)];
}

const Dashboard = () => {
  const theme = useTheme();
  const [background, setBackground] = useState("Select Background");
  const [eyes, setEyes] = useState("Select Eyes");
  const [hair, setHair] = useState("Select Headwear");
  const [mouth, setMouth] = useState("Select Mouth");
  const [outfit, setOutfit] = useState("Select Outfit");
  const [prevBackground, setPrevBackground] = useState("Greenish");
  const [body, setBody] = useState("Select Body");
  const [selected, setSelected] = useState("Original");
  const [nftTheme, setNftTheme] = useState("Ai Theme");
  const [dalleImage, setDalleImage] = useState([]);
  const [aigenerated, setAigenerated] = useState(0);

  // const [generatedImage, setGeneratedImage] = useState(false);
  const [getDalleImage] = useGetDalleImageMutation();
  const [isDownload, setIsDownload] = useState(false);
  const [aiBtn, setAiBtn] = useState("generate");
  const [imageMidJourney, setImageMidJourney] = useState("none");
  const [msg, setMsg] = useState("");
  const [dropdownMan, setdropdownMan] = useState({
    Background: false,
    Eyes: false,
    Body: false,
    Mouth: false,
  });

  const myref = useRef(null);
  const midJourneyButton = useRef(null);

  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleDownload = () => {
    const element = document.getElementById("imageBox");
    setIsDownload(true);
    if (
      background.length === 2 ||
      localStorage.getItem("buttonMessageId") === "dalle"
    ) {
      const url = document.getElementById("background").src;
      fetch(`${process.env.REACT_APP_API_URL}imageDownload`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: url }),
      })
        .then((response) => response.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(new Blob([blob]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "nft.png");
          document.body.appendChild(link);
          link.click();
          link.remove();
          setIsDownload(false);
        });
    } else {
      // create a duplicate hidden element from element and give them style to 512px widh
      if (isTablet) {
        element.style.width = "512px";
      }
      html2canvas(element, {
        width: 512,
        height: 512,
        x: (element.scrollWidth - 512) / 2,
        y: (element.scrollHeight - 512) / 2,
        useCORS: true,
        imageTimeout: 10000,
        allowTaint: true,
        scale: window.devicePixelRatio, // added option to increase resolution
      }).then((canvas) => {
        canvas.toBlob(
          (blob) => {
            saveAs(blob, "nft.png");
          },
          "image/png",
          1
        ); // added quality option (0.9)
        setIsDownload(false);
        element.style.width = "100%";
      });
      // setIsDownload(false);
    }
  };

  const generateImage = async () => {
    if (nftTheme === "Ai Theme") {
      alert("Please Ai Theme");
      return;
    }
    if (background === "Select Background") {
      setdropdownMan({ ...dropdownMan, Background: true });
      return;
    }
    if (body === "Select Body") {
      setdropdownMan({ ...dropdownMan, Body: true });
      return;
    }
    if (eyes === "Select Eyes") {
      setdropdownMan({ ...dropdownMan, Eyes: true });
      return;
    }
    if (mouth === "Select Mouth") {
      setdropdownMan({ ...dropdownMan, Mouth: true });
      return;
    }

    // disable the button
    midJourneyButton.current.disabled = true;

    // setGeneratingImg(true);
    // appennd the processing icon to the aibtn button
    setAiBtn("generating");
    const prompt =
      randomPrompt() +
      ` Background: ${background}, Fur: ${body}, Expression: ${mouth}, ${
        outfit === "Select Outfit" ? "" : `Clothing: ${outfit}`
      }, Art-Theme: ${nftTheme}`;
    getDalleImage({
      data: {
        prompt: prompt,
      },
    })
      .unwrap()
      .then((res) => {
        setDalleImage(res.photo.data);
        localStorage.setItem("buttonMessageId", "dalle");
        localStorage.setItem("MessageId", "dalleMessage");
        // console.log(res,"ds");
        setImageMidJourney(res.photo.data[0].url);
        myref.current.src = res.photo.data[0].url;
        // change the z-index of the image
        myref.current.style.zIndex = "2";
        setMsg("");
        setAiBtn("generated");
      })
      .catch((err) => {
        setMsg(
          "Error generating AI results: API not responding. Please try later"
        );
        midJourneyButton.current.disabled = false;
        setAiBtn("generate");
      });
  };
  const handleTweet = async () => {
    const tweetMessage = encodeURIComponent(
      "Thank you @FelixCollective for the AI-Powered honorary! Excited to create my own honorary.\n\nCreate your own here and Tweet to get DMed something special: [https://honorary-builder.felixcollective.app/]\n\nJoin the Felix innovation wave! 🦊🌟\n\n#Cardano #CNFTCommunity $ada #NFT #ADA"
    );

    const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetMessage}`;
    window.open(twitterUrl, "_blank");
  };

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}totalgenerated`)
      .then((res) => res.json())
      .then((res) => {
        // console.log(res);
        setAigenerated(res.count);
      });
  }, [imageMidJourney]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        mt: "50px",
        gap: "20px",
        mb: "90px",
        paddingBottom: "50px",
      }}
    >
      <Box
        sx={{
          id: "roundColorBox1",
          position: "absolute",
          background: "#359762",
          width: "356px",
          height: "356px",
          filter: "blur(175px)",
          left: "-182px",
          top: "-68px",
        }}
      ></Box>
      <Box
        sx={{
          id: "roundColorBox2",
          position: "absolute",
          background:
            " linear-gradient(148.1deg, rgba(255, 235, 96, 0.8) -13.86%, rgba(0, 172, 79, 0.8) 40.54%, rgba(255, 235, 96, 0.8) 94.95%)",
          width: "356px",
          height: "356px",
          filter: "blur(175px)",
          bottom: "0px",
          right: "0px",
        }}
      ></Box>
      <Box
        sx={{
          id: "star1",
          position: "absolute",
          background: "#4DEF97",
          width: "20px",
          height: "22px",
          left: "42px",
          top: "263px",
          transform: "rotate(45deg)",
          clipPath:
            "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
          transformOrigin: "50% 50%",
        }}
      ></Box>
      <Box
        sx={{
          id: "star2",
          position: "absolute",
          background: "#4DEF97",
          width: "20px",
          height: "22px",
          right: "10px",
          top: "376px",
          transform: "rotate(45deg)",
          clipPath:
            "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
          transformOrigin: "50% 50%",
        }}
      ></Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "20px",
          zIndex: "1",
        }}
      >
        {/* cp1 */}
        <Box>
          <Typography
            sx={{
              color: theme.palette.neutral.main,

              fontStyle: "normal",
              textAlign: "center",
              fontWeight: 400,
              fontSize: "35px",
              lineHeight: "60px",
              margin: "0 5%",
            }}
          >
            Build your AI-
            <Typography
              sx={{
                fontStyle: "normal",
                fontWeight: "400",
                fontSize: "35px",
                textAlign: "center",
                background:
                  "linear-gradient(89.64deg, #D8C74F 19.51%, #3BAB6E 63.86%, #3CBE78 101.29%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                textFillColor: "transparent",
              }}
              component={"span"}
            >
              Powered Honorary
            </Typography>
          </Typography>
          <Typography
            sx={{
              color: "#ffff",
              fontFamily: "Turret Road",
              fontWeight: 400,
              textAlign: "center",
              fontStyle: "normal",
              wordWrap: "break-word",
              width: "80%",
              fontSize: "22px",
              lineHeight: "160%",
              letterSpacing: "-0.01em",
              marginLeft: "10%",
            }}
          >
            You earned an honorary from The Felix Collective merely for being
            here, surviving the bear market, and a ton of soft rugs.
          </Typography>
          <Typography
            sx={{
              color: theme.palette.neutral.main,
              fontWeight: 400,
              textAlign: "center",
              fontStyle: "normal",
              wordWrap: "break-word",
              width: "80%",
              fontSize: "22px",
              lineHeight: "160%",
              letterSpacing: "-0.01em",
              marginLeft: "10%",
            }}
          >
            AI Honorary Generations: {aigenerated}
          </Typography>
        </Box>
        {/* cp2 */}
        <Box
          sx={{
            display: "flex",
            flexDirection: isTablet ? "column-reverse" : "row",
            gap: "40px",
            padding: "0 5%",
            alignItems: isTablet ? "center" : "flex-start",
            // flexWrap: "wrap",
            justifyContent: "center",
            width: "100%",
          }}
        >
          {/* option box */}
          <Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "27px",
                alignItems: "center",
                justifyContent: "space-between",
                "& .MuiSelect-select": {
                  fontWeight: 700,
                  fontFamily: "Turret Road",
                  letterSpacing: "-0.02em",
                  lineHeight: "30px",
                  fontSize: "20px",
                  fontStyle: "normal",
                  // change the background color of dropdown
                  // hide the list item icon
                  "& .MuiListItemIcon-root": {
                    display: "none",
                  },
                },
              }}
            >
              <FormControl error={dropdownMan.Background}>
                <Select
                  sx={{
                    color: "#0D7F41",
                    backgroundColor: theme.palette.neutral.main,
                    width: "220px",
                    height: "40px",
                  }}
                  variant="outlined"
                  displayEmpty
                  required
                  inputProps={{ "aria-label": "Without label" }}
                  onChange={(e) => {
                    setBackground(e.target.value);
                    setPrevBackground(e.target.value);
                    setdropdownMan({ ...dropdownMan, Background: false });
                  }}
                  defaultValue={"Select Background"}
                  // change the style of menu item
                >
                  {Object.keys(AllOptions.background).map((value, index) => (
                    <MenuItem
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        color: "#ffff",
                        fontFamily: "Turret Road",
                        fontWeight: 700,
                        fontSize: "16px",
                        letterSpacing: "0.05em",
                        lineHeight: "17px",
                        textAlign: "center",
                      }}
                      key={index}
                      value={value}
                    >
                      {value}

                      {value !== "Select Background" && (
                        <ListItemIcon>
                          <Box
                            component="img"
                            src={AllOptions.background[value]}
                            width="30px"
                            height="30px"
                            borderRadius={"4px"}
                            right={"20px"}
                            alignContent={"center"}
                          />
                        </ListItemIcon>
                      )}
                    </MenuItem>
                  ))}
                </Select>
                {dropdownMan.Background && (
                  <Box
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      padding: "0",

                      justifyContent: "center",
                      marginTop: "0.25rem",
                    }}
                  >
                    <Close
                      sx={{
                        color: "#ffff",
                        background: "#c6162b",
                        borderRadius: "50%",
                      }}
                    />

                    <span
                      style={{
                        color: "#fff",
                        fontFamily: "Turret Road",
                        fontSize: "16px",
                        fontWeight: 500,
                      }}
                    >
                      This field is required
                    </span>
                  </Box>
                )}
              </FormControl>
              <FormControl error={dropdownMan.Body}>
                <Select
                  sx={{
                    color: "#0D7F41",
                    backgroundColor: theme.palette.neutral.main,
                    width: "220px",
                    height: "40px",
                  }}
                  variant="outlined"
                  displayEmpty
                  required
                  inputProps={{ "aria-label": "Without label" }}
                  defaultValue={"Select Body"}
                  onChange={(e) => {
                    setBody(e.target.value);
                    setdropdownMan({ ...dropdownMan, Body: false });
                  }}
                >
                  {Object.keys(AllOptions.body).map((value, index) => (
                    <MenuItem
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        color: "#ffff",
                        fontFamily: "Turret Road",
                        fontWeight: 700,
                        fontSize: "16px",
                        letterSpacing: "0.05em",
                        lineHeight: "17px",
                        textAlign: "center",
                      }}
                      key={index}
                      value={value}
                    >
                      {value}

                      {value !== "Select Body" && (
                        <ListItemIcon>
                          <Box
                            component="img"
                            sx={{
                              backgroundColor: "#ffeb60",
                            }}
                            src={SmallSizeOptions.body[value]}
                            width="30px"
                            height="30px"
                            borderRadius={"4px"}
                            right={"20px"}
                            alignContent={"center"}
                          />
                        </ListItemIcon>
                      )}
                    </MenuItem>
                  ))}
                </Select>
                {dropdownMan.Body && (
                  <Box
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      padding: "0",

                      justifyContent: "center",
                      marginTop: "0.25rem",
                    }}
                  >
                    <Close
                      sx={{
                        color: "#ffff",
                        background: "#c6162b",
                        borderRadius: "50%",
                      }}
                    />

                    <span
                      style={{
                        color: "#fff",
                        fontFamily: "Turret Road",
                        fontSize: "16px",
                        fontWeight: 500,
                      }}
                    >
                      This field is required
                    </span>
                  </Box>
                )}
              </FormControl>
              <FormControl error={dropdownMan.Eyes}>
                <Select
                  sx={{
                    color: "#0D7F41",
                    backgroundColor: theme.palette.neutral.main,
                    width: "220px",
                    height: "40px",
                  }}
                  variant="outlined"
                  displayEmpty
                  required
                  inputProps={{ "aria-label": "Without label" }}
                  defaultValue={"Select Eyes"}
                  onChange={(e) => {
                    setEyes(e.target.value);
                    setdropdownMan({ ...dropdownMan, Eyes: false });
                  }}
                >
                  {Object.keys(AllOptions.eyes).map((value, index) => (
                    <MenuItem
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        color: "#ffff",
                        fontFamily: "Turret Road",
                        fontWeight: 700,
                        fontSize: "16px",
                        letterSpacing: "0.05em",
                        lineHeight: "17px",
                        textAlign: "center",
                      }}
                      key={index}
                      value={value}
                    >
                      {value}

                      {value !== "Select Eyes" && (
                        <ListItemIcon>
                          <Box
                            component="img"
                            sx={{
                              backgroundColor: "#ffeb60",
                            }}
                            src={SmallSizeOptions.eyes[value]}
                            width="30px"
                            height="30px"
                            borderRadius={"4px"}
                            right={"20px"}
                            alignContent={"center"}
                          />
                        </ListItemIcon>
                      )}
                    </MenuItem>
                  ))}
                </Select>
                {dropdownMan.Eyes && (
                  <Box
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      padding: "0",

                      justifyContent: "center",
                      marginTop: "0.25rem",
                    }}
                  >
                    <Close
                      sx={{
                        color: "#ffff",
                        background: "#c6162b",
                        borderRadius: "50%",
                      }}
                    />

                    <span
                      style={{
                        color: "#fff",
                        fontFamily: "Turret Road",
                        fontSize: "16px",
                        fontWeight: 500,
                      }}
                    >
                      This field is required
                    </span>
                  </Box>
                )}
              </FormControl>
              <FormControl error={dropdownMan.Mouth}>
                <Select
                  sx={{
                    color: "#0D7F41",
                    backgroundColor: theme.palette.neutral.main,
                    width: "220px",
                    height: "40px",
                  }}
                  variant="outlined"
                  displayEmpty
                  required
                  inputProps={{ "aria-label": "Without label" }}
                  defaultValue={"Select Mouth"}
                  onChange={(e) => {
                    setMouth(e.target.value);
                    setdropdownMan({ ...dropdownMan, Mouth: false });
                  }}
                >
                  {Object.keys(AllOptions.mouth).map((value, index) => (
                    <MenuItem
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        color: "#ffff",
                        fontFamily: "Turret Road",
                        fontWeight: 700,
                        fontSize: "16px",
                        letterSpacing: "0.05em",
                        lineHeight: "17px",
                        textAlign: "center",
                      }}
                      key={index}
                      value={value}
                    >
                      {value}

                      {value !== "Select Mouth" && (
                        <ListItemIcon>
                          <Box
                            component="img"
                            sx={{
                              backgroundColor: "#ffeb60",
                            }}
                            src={AllOptions.mouth[value]}
                            width="30px"
                            height="30px"
                            borderRadius={"4px"}
                            right={"20px"}
                            alignContent={"center"}
                          />
                        </ListItemIcon>
                      )}
                    </MenuItem>
                  ))}
                </Select>
                {dropdownMan.Mouth && (
                  <Box
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      padding: "0",

                      justifyContent: "center",
                      marginTop: "0.25rem",
                    }}
                  >
                    <Close
                      sx={{
                        color: "#ffff",
                        background: "#c6162b",
                        borderRadius: "50%",
                      }}
                    />

                    <span
                      style={{
                        color: "#fff",
                        fontFamily: "Turret Road",
                        fontSize: "16px",
                        fontWeight: 500,
                      }}
                    >
                      This field is required
                    </span>
                  </Box>
                )}
              </FormControl>
              <Select
                sx={{
                  color: "#0D7F41",
                  backgroundColor: theme.palette.neutral.main,
                  width: "220px",
                  height: "40px",
                }}
                variant="outlined"
                displayEmpty
                required
                inputProps={{ "aria-label": "Without label" }}
                defaultValue={"Select Headwear"}
                onChange={(e) => setHair(e.target.value)}
              >
                {Object.keys(AllOptions.hair).map((value, index) => (
                  <MenuItem
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      color: "#ffff",
                      fontFamily: "Turret Road",
                      fontWeight: 700,
                      fontSize: "16px",
                      letterSpacing: "0.05em",
                      lineHeight: "17px",
                      textAlign: "center",
                    }}
                    key={index}
                    value={value}
                  >
                    {value}

                    {value !== "Select Headwear" && (
                      <ListItemIcon>
                        <Box
                          component="img"
                          sx={{
                            backgroundColor: "#ffeb60",
                          }}
                          src={AllOptions.hair[value]}
                          width="30px"
                          height="30px"
                          borderRadius={"4px"}
                          right={"20px"}
                          alignContent={"center"}
                        />
                      </ListItemIcon>
                    )}
                  </MenuItem>
                ))}
              </Select>

              <Select
                sx={{
                  color: "#0D7F41",
                  backgroundColor: theme.palette.neutral.main,
                  width: "220px",
                  height: "40px",
                }}
                variant="outlined"
                displayEmpty
                required
                inputProps={{ "aria-label": "Without label" }}
                defaultValue={"Select Outfit"}
                onChange={(e) => setOutfit(e.target.value)}
              >
                {Object.keys(AllOptions.outfit).map((value, index) => (
                  <MenuItem
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      color: "#ffff",
                      fontFamily: "Turret Road",
                      fontWeight: 700,
                      fontSize: "16px",
                      letterSpacing: "0.05em",
                      lineHeight: "17px",
                      textAlign: "center",
                    }}
                    key={index}
                    value={value}
                  >
                    {value}

                    {value !== "Select Outfit" && (
                      <ListItemIcon>
                        <Box
                          component="img"
                          sx={{
                            backgroundColor: "#ffeb60",
                          }}
                          src={AllOptions.outfit[value]}
                          width="30px"
                          height="30px"
                          borderRadius={"4px"}
                          right={"20px"}
                          alignContent={"center"}
                        />
                      </ListItemIcon>
                    )}
                  </MenuItem>
                ))}
              </Select>
              {/*  create a input box with icon on the right side */}
              {/* <Select
                sx={{
                  color: "#0D7F41",
                  backgroundColor: theme.palette.neutral.main,
                  width: "220px",
                  height: "40px",
                }}
                variant="outlined"
                displayEmpty
                required
                inputProps={{ "aria-label": "Without label" }}
                defaultValue={"Select Variant"}
                onChange={(e) => {
                  setSelected(e.target.value);
                  if (e.target.value === "Ai Variant") {
                    setMsg(
                      "It might take 60-90 seconds to generate and process the AI results"
                    );
                    if (imageMidJourney === "none") {
                      myref.current.style.zIndex = 1;
                    } else {
                      myref.current.src = imageMidJourney;
                      myref.current.style.zIndex = 2;
                    }
                  } else if (e.target.value === "Original") {
                    myref.current.src = AllOptions.background[prevBackground];
                    myref.current.style.zIndex = 1;
                  } else {
                    setBackground(e.target.value);
                    myref.current.style.zIndex = 2;
                  }
                }}
              >
                <MenuItem
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    color: "#ffff",
                    fontFamily: "Turret Road",
                    fontWeight: 700,
                    fontSize: "16px",
                    letterSpacing: "0.05em",
                    lineHeight: "17px",
                    textAlign: "center",
                  }}
                  key="org0"
                  value={"Select Variant"}
                >
                  Select Variant
                </MenuItem>
                <MenuItem
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    color: "#ffff",
                    fontFamily: "Turret Road",
                    fontWeight: 700,
                    fontSize: "16px",
                    letterSpacing: "0.05em",
                    lineHeight: "17px",
                    textAlign: "center",
                  }}
                  key="org1"
                  value={"Original"}
                >
                  Original
                </MenuItem>
                <MenuItem
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    color: "#ffff",
                    fontFamily: "Turret Road",
                    fontWeight: 700,
                    fontSize: "16px",
                    letterSpacing: "0.05em",
                    lineHeight: "17px",
                    textAlign: "center",
                  }}
                  key="0"
                  value="Ai Variant"
                >
                  Ai Variant
                </MenuItem>
                {Object.keys(AllOptions.background).map((value, index) => {
                  // console.log(value);
                  if (value.length === 2) {
                    return (
                      <MenuItem
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          color: "#ffff",
                          fontFamily: "Turret Road",
                          fontWeight: 700,
                          fontSize: "16px",
                          letterSpacing: "0.05em",
                          lineHeight: "17px",
                          textAlign: "center",
                        }}
                        key={index}
                        value={value}
                      >
                        {value}

                        <ListItemIcon>
                          <Box
                            component="img"
                            sx={{
                              backgroundColor: "#ffeb60",
                            }}
                            src={AllOptions.background[value]}
                            width="30px"
                            height="30px"
                            borderRadius={"4px"}
                            right={"20px"}
                            alignContent={"center"}
                          />
                        </ListItemIcon>
                      </MenuItem>
                    );
                  }
                })}
              </Select> */}
              <div className="switchbody">
                <Typography>Original</Typography>
                <label class="switch">
                  <input
                    onChange={(e) => {
                      if (e.target.checked === true) {
                        setSelected("Ai Variant");
                        setMsg(
                          "It might take 60-90 seconds to generate and process the AI results"
                        );
                        if (imageMidJourney === "none") {
                          myref.current.style.zIndex = 1;
                        } else {
                          myref.current.src = imageMidJourney;
                          myref.current.style.zIndex = 2;
                        }
                      } else if (e.target.checked === false) {
                        setSelected("Original");
                        myref.current.src =
                          AllOptions.background[prevBackground];
                        myref.current.style.zIndex = 1;
                      } else {
                        setBackground(e.target.value);
                        myref.current.style.zIndex = 2;
                      }
                    }}
                    type="checkbox"
                    id="checkbox"
                  />
                  <div class="indicator left"></div>
                  <div class="indicator right"></div>
                  <div
                    // onClick={(e) => {
                    //   const where = e.target.style.left;
                    //   if (where === "40%") {
                    //     e.target.style.left = "0%";
                    //   } else {
                    //     e.target.style.left = "40%";
                    //   }
                    // }}
                    class="button"
                  ></div>
                </label>
                <Typography>AI Variant</Typography>
              </div>
              {selected === "Ai Variant" && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "220px",
                    height: "40px",
                    borderRadius: "4px",
                    fontWeight: "bold",
                    backgroundColor: theme.palette.neutral.main,
                  }}
                >
                  <Select
                    sx={{
                      color: "#0D7F41",
                      backgroundColor: theme.palette.neutral.main,
                      width: "220px",
                      height: "40px",
                    }}
                    variant="outlined"
                    displayEmpty
                    required
                    inputProps={{ "aria-label": "Without label" }}
                    defaultValue={"Ai Theme"}
                    onChange={(e) => {
                      setNftTheme(e.target.value);
                    }}
                  >
                    <MenuItem
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        color: "#ffff",
                        fontFamily: "Turret Road",
                        fontWeight: 700,
                        fontSize: "16px",
                        letterSpacing: "0.05em",
                        lineHeight: "17px",
                        textAlign: "center",
                      }}
                      key="0"
                      value="Ai Theme"
                    >
                      Ai Theme
                    </MenuItem>
                    <MenuItem
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        color: "#ffff",
                        fontFamily: "Turret Road",
                        fontWeight: 700,
                        fontSize: "16px",
                        letterSpacing: "0.05em",
                        lineHeight: "17px",
                        textAlign: "center",
                      }}
                      key="org1"
                      value={"Portraiture"}
                    >
                      Portraiture
                    </MenuItem>
                    <MenuItem
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        color: "#ffff",
                        fontFamily: "Turret Road",
                        fontWeight: 700,
                        fontSize: "16px",
                        letterSpacing: "0.05em",
                        lineHeight: "17px",
                        textAlign: "center",
                      }}
                      key="org2"
                      value={"Abstract"}
                    >
                      Abstract
                    </MenuItem>
                    <MenuItem
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        color: "#ffff",
                        fontFamily: "Turret Road",
                        fontWeight: 700,
                        fontSize: "16px",
                        letterSpacing: "0.05em",
                        lineHeight: "17px",
                        textAlign: "center",
                      }}
                      key="org3"
                      value={"Surrealism"}
                    >
                      Surrealism
                    </MenuItem>
                    <MenuItem
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        color: "#ffff",
                        fontFamily: "Turret Road",
                        fontWeight: 700,
                        fontSize: "16px",
                        letterSpacing: "0.05em",
                        lineHeight: "17px",
                        textAlign: "center",
                      }}
                      key="org4"
                      value={"Fantasy"}
                    >
                      Fantasy
                    </MenuItem>
                    <MenuItem
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        color: "#ffff",
                        fontFamily: "Turret Road",
                        fontWeight: 700,
                        fontSize: "16px",
                        letterSpacing: "0.05em",
                        lineHeight: "17px",
                        textAlign: "center",
                      }}
                      key="org5"
                      value={"Minimalism"}
                    >
                      Minimalism
                    </MenuItem>
                    <MenuItem
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        color: "#ffff",
                        fontFamily: "Turret Road",
                        fontWeight: 700,
                        fontSize: "16px",
                        letterSpacing: "0.05em",
                        lineHeight: "17px",
                        textAlign: "center",
                      }}
                      key="org6"
                      value={"Graffiti"}
                    >
                      Graffiti
                    </MenuItem>
                    <MenuItem
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        color: "#ffff",
                        fontFamily: "Turret Road",
                        fontWeight: 700,
                        fontSize: "16px",
                        letterSpacing: "0.05em",
                        lineHeight: "17px",
                        textAlign: "center",
                      }}
                      key="org7"
                      value={"Pop Art"}
                    >
                      Pop Art
                    </MenuItem>
                    <MenuItem
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        color: "#ffff",
                        fontFamily: "Turret Road",
                        fontWeight: 700,
                        fontSize: "16px",
                        letterSpacing: "0.05em",
                        lineHeight: "17px",
                        textAlign: "center",
                      }}
                      key="org8"
                      value={"Indigenous"}
                    >
                      Indigenous
                    </MenuItem>
                  </Select>
                  <Button
                    ref={midJourneyButton}
                    sx={{
                      minWidth: "27px",
                    }}
                    onClick={imageMidJourney === "none" ? generateImage : null}
                  >
                    {aiBtn === "generate" && (
                      <SendOutlined sx={{ color: "#0D7F41", width: "2rem" }} />
                    )}
                    {aiBtn === "generating" && (
                      <Pending
                        sx={{
                          color: "#004b23",
                          width: "2rem",

                          "@keyframes rotate": {
                            "0%": {
                              transform: "rotate(0deg)",
                            },
                            "25%": {
                              transform: "rotate(90deg)",
                            },
                            "50%": {
                              transform: "rotate(180deg)",
                            },
                            "100%": {
                              transform: "rotate(360deg)",
                            },
                          },
                          animation: "rotate 2s linear infinite",
                        }}
                      />
                    )}
                    {aiBtn === "generated" && (
                      <Task sx={{ color: "#0D7F41", width: "2rem" }} />
                    )}
                  </Button>
                </Box>
              )}

              {isTablet && selected === "Ai Variant" && (
                <Box>
                  <Typography
                    sx={{
                      // display: isTablet ? "block" : "none",
                      fontSize: "18px",
                      textAlign: "center",
                      fontFamily: "Turret Road",
                      padding: "0 1rem",
                      color: msg.includes("Error") ? "#ff0000" : "#ffff",
                    }}
                  >
                    {msg}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
          {/* image Box */}
          <Box
            width={isMobile ? "100%" : "512px"}
            sx={{
              position: "relative",
            }}
          >
            <Box
              id="imageBox"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                maxWidth: "512px",
                maxHeight: "512px",
                aspectRatio: "1/1",
                background:
                  "linear-gradient(110.85deg, #209053 -1.82%, #05381C 102.5%)",
                // backgroundColor: theme.palette.neutral.main,
                borderRadius: "5px",
                position: "relative",
                boxShadow: "5px 3px 22px rgb(0 0 0)",
                // margin: "0 10%",
              }}
            >
              <Box
                component="img"
                id="background"
                ref={myref}
                src={AllOptions.background[background]}
                width="100%"
                height="100%"
                borderRadius={"0px"}
                alt=""
                sx={{ zIndex: "1", position: "absolute" }}
              />

              {body !== "Select Body" && (
                <Box
                  component="img"
                  id="body"
                  src={AllOptions.body[body]}
                  width="100%"
                  alt=""
                  overflow={"hidden"}
                  sx={{ zIndex: "1", position: "absolute" }}
                />
              )}
              {eyes !== "Select Eyes" && (
                <Box
                  component="img"
                  alt=""
                  id="eyes"
                  src={AllOptions.eyes[eyes]}
                  width="100%"
                  sx={{ position: "absolute", zIndex: "1" }}
                />
              )}
              {outfit !== "Select Outfit" && (
                <Box
                  component="img"
                  alt=""
                  id="outfit"
                  src={AllOptions.outfit[outfit]}
                  width="100%"
                  sx={{ position: "absolute", zIndex: "1" }}
                />
              )}
              {mouth !== "Select Mouth" && (
                <Box
                  component="img"
                  id="mouth"
                  alt=""
                  src={AllOptions.mouth[mouth]}
                  width="100%"
                  sx={{ position: "absolute", zIndex: "1" }}
                />
              )}
              {hair !== "Select Headwear" && (
                <Box
                  component="img"
                  alt=""
                  id="hair"
                  src={AllOptions.hair[hair]}
                  width="100%"
                  sx={{ position: "absolute", zIndex: "1" }}
                />
              )}
            </Box>
            {isDownload && (
              <Box
                sx={{
                  position: "absolute",
                  backgroundColor: "#0D7F41",
                  color: "#ffff",
                  borderRadius: "4px",
                  width: "2.5rem",
                  height: "2.2rem",
                  padding: "8px",
                  zIndex: "2",
                  margin: "10px",
                  top: "10px",
                  right: "10px",
                }}
              >
                <RotateRight
                  color="#fff"
                  sx={{
                    "@keyframes rotate": {
                      "0%": {
                        transform: "rotate(0deg)",
                      },
                      "100%": {
                        transform: "rotate(360deg)",
                      },
                    },
                    animation: "rotate 2s linear infinite",
                  }}
                />
              </Box>
            )}
            {!isDownload && (
              <Download
                cursor="pointer"
                onClick={handleDownload}
                sx={{
                  position: "absolute",
                  backgroundColor: "#0D7F41",
                  color: "#ffff",
                  borderRadius: "4px",
                  width: "2.5rem",
                  height: "2.2rem",
                  padding: "8px",
                  zIndex: "2",
                  margin: "10px",
                  top: "10px",
                  right: "10px",
                }}
              />
            )}

            {!isTablet && selected === "Ai Variant" && (
              <Box
                sx={{
                  textAlign: "center",
                  mt: "10px",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "18px",
                    textAlign: "center",
                    fontFamily: "Turret Road",
                    padding: "0 1rem",
                    color: msg.includes("Error") ? "#ff0000" : "#ffff",
                  }}
                >
                  {msg}
                </Typography>
              </Box>
            )}
            <Box
              sx={{
                textAlign: "center",
                display: isTablet ? "none" : "",
                mt: "20px",
              }}
            >
              <Button
                onClick={handleTweet}
                sx={{
                  backgroundColor: "#ffff",
                  color: "#1DA1F2",
                  width: "220px",
                  textTransform: "none",
                  gap: "10px",
                  fontFamily: "Turret Road",

                  "&:hover": {
                    backgroundColor: "#ffff",
                  },
                }}
              >
                <svg
                  width={24}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  class="r-1nao33i r-4qtqp9 r-yyyyoo r-16y2uox r-8kz0gk r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-lrsllp"
                >
                  <g>
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                  </g>
                </svg>
                Tweet my honorary
              </Button>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            textAlign: "center",
            display: isTablet ? "flex" : "none",
            mt: "20px",
          }}
        >
          <Button
            onClick={handleTweet}
            sx={{
              backgroundColor: "#ffff",
              color: "#1DA1F2",
              width: "220px",
              textTransform: "none",
              gap: "10px",
              fontFamily: "Turret Road",

              "&:hover": {
                backgroundColor: "#ffff",
              },
            }}
          >
            <svg
              width={24}
              viewBox="0 0 24 24"
              aria-hidden="true"
              class="r-1nao33i r-4qtqp9 r-yyyyoo r-16y2uox r-8kz0gk r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-lrsllp"
            >
              <g>
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
              </g>
            </svg>{" "}
            Tweet my honorary
          </Button>
        </Box>
      </Box>
      {/* cp3 */}
    </Box>
  );
};

export default Dashboard;
