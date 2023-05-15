import {
  Download,
  Pending,
  RotateRight,
  SendOutlined,
  Task,
  Twitter,
} from "@mui/icons-material";
import {
  Box,
  Typography,
  useTheme,
  MenuItem,
  Select,
  useMediaQuery,
  Button,
} from "@mui/material";

import { AllOptions } from "components/options/mapping";
import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";

import {
  useGetTwitterImageMutation,
  useGetDalleImageMutation,
} from "state/api";

function generateRandomName() {
  const timestamp = new Date().getTime();
  const randomString = Math.random().toString(36).substring(2, 8);
  return `image_${timestamp}_${randomString}.png`;
}

const Dashboard = () => {
  const theme = useTheme();
  const [background, setBackground] = useState("Greenish");
  const [eyes, setEyes] = useState("none");
  const [hair, setHair] = useState("none");
  const [mouth, setMouth] = useState("none");
  const [outfit, setOutfit] = useState("none");
  const [prevBackground, setPrevBackground] = useState("Greenish");
  const [body, setBody] = useState("none");

  const [generatedImage, setGeneratedImage] = useState(false);
  const [getTwitterImage] = useGetTwitterImageMutation();
  const [getDalleImage] = useGetDalleImageMutation();
  const [generatingImg, setGeneratingImg] = useState(false);
  const [isDownload, setIsDownload] = useState(false);
  const [aiBtn, setAiBtn] = useState("generate");
  const myref = useRef(null);
  const [prompt, setPrompt] = useState(
    "generate a image containing tree and sky and villa build upon the tree"
  );

  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const handleDownload = () => {
    const element = document.getElementById("imageBox");
    setIsDownload(true);
    if (background.length === 2) {
      const url = document.getElementById("background").src;
      fetch(`${process.env.REACT_APP_API_URL}/imageDownload`, {
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
      });
      // setIsDownload(false);
    }
  };

  const generateImage = async () => {
    setGeneratingImg(true);
    // appennd the processing icon to the aibtn button
    setAiBtn("generating");
    const randomPromp = "generate a image";
    const formdata = new FormData();
    formdata.append("prompt", randomPromp);
    const imageBlob = await new Promise((resolve) => {
      const element = document.getElementById("imageBox");
      html2canvas(element, {
        width: 512,
        height: 512,
        x: (element.scrollWidth - 512) / 2,
        y: (element.scrollHeight - 512) / 2,
        useCORS: true,
        allowTaint: true,
        scale: window.devicePixelRatio, // added option to increase resolution
      }).then((canvas) => {
        canvas.toBlob(resolve, "image/png", 0.9); // added quality option (0.9)
      });
    });
    const fileName = generateRandomName();
    // create a image file
    const file = new File([imageBlob], fileName, {
      type: "image/png",
    });
    const formData = new FormData();
    formData.append("picture", file);
    formData.append("image_name", fileName);
    formData.append("prompt", randomPromp);
    // console.log(formData.get("picture"));

    getDalleImage({ data: formData })
      .unwrap()
      .then((res) => {
        const data = res;
        /**  this is for only image generation  
        const base64Data = data.photo;
        console.log("base64Data", base64Data);
        const img = new Image();
        img.src = `data:image/jpeg;base64,${base64Data}`;
        img.onload = function () {
          // Once the image has loaded, you can add it to the DOM
          const container = document.getElementById("image-container");
          // change the src of the container
          container.src = img.src;
          container.style.display = "block";
        };
        **/
        // const data = {
        //   photo: {
        //     data: [
        //       {
        //         url: "https://th.bing.com/th/id/R.b66fa8b953f0c30192a9c58f58a7ec0c?rik=UD92R1yCl3vOnQ&riu=http%3a%2f%2f1.bp.blogspot.com%2f-qSGjEEnD8Vc%2fUI6Oxpn4qnI%2fAAAAAAAAMgI%2fcTrdNVzkK90%2fs1600%2fSnow%2bWallpapers%2b4.jpg&ehk=MOeVY7Vxq6CPsCwz2KpjjOvkiKHFACiAvOarS2w0Ybs%3d&risl=&pid=ImgRaw&r=0",
        //       },
        //     ],
        //   },
        // };
        const urlLen = data.photo.data.length;
        if (!AllOptions.background.v1) {
          AllOptions.background = {
            ...AllOptions.background,
          };

          for (let i = 0; i < urlLen; i++) {
            const key = `v${i + 1}`;
            AllOptions.background[key] = data.photo.data[i].url;
          }
        } else {
          for (let i = 0; i < urlLen; i++) {
            AllOptions.background[`v${i + 1}`] = data.photo.data[i].url;
          }
        }
        setAiBtn("generated");
        setGeneratedImage(true);
        setGeneratingImg(false);
        setTimeout(() => {
          setAiBtn("generate");
        }, 3000);
      });
  };

  const handleTweet = async () => {
    const tweetMessage =
      "Thank you @CynicsNFT for the honorary. I am rooting for you!\n\n Claim your honorary at ";
    const imageBlob = await new Promise((resolve) => {
      const element = document.getElementById("imageBox");
      html2canvas(element, {
        width: 400,
        height: 400,
        x: (element.scrollWidth - 400) / 2,
        y: (element.scrollHeight - 400) / 2,
        useCORS: true,
        scale: window.devicePixelRatio, // added option to increase resolution
      }).then((canvas) => {
        canvas.toBlob(resolve, "image/png", 0.9); // added quality option (0.9)
      });
    });
    // add this image to the form data
    // const formData = new FormData();

    // const fileName = generateRandomName();
    // formData.append("picture", imageBlob, fileName);

    // // Append image name to FormData
    // formData.append("image_name", fileName);

    // getTwitterImage(formData)
    //   .unwrap()
    //   .then((res) => {
    //     console.log(" response is ",res)
    //   });
    const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetMessage}&url=${encodeURIComponent(
      window.location.href
    )}`;

    window.open(twitterUrl, "_blank");
  };

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
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "27px",
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
                onChange={(e) => {
                  setBackground(e.target.value);
                  setPrevBackground(e.target.value);
                }}
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
              {/*  create a input box with icon on the right side */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "276px",
                  height: "50px",
                  borderRadius: "4px",
                  fontWeight: "bold",
                  backgroundColor: theme.palette.neutral.main,
                }}
              >
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
                  defaultValue={"Ai Variant"}
                  onChange={(e) => {
                    if (e.target.value === "Ai Variant") {
                      myref.current.style.zIndex = 1;
                    } else if (e.target.value === "Original") {
                      setBackground(prevBackground);
                      myref.current.style.zIndex = 1;
                    } else {
                      setBackground(e.target.value);
                      myref.current.style.zIndex = 2;
                    }
                  }}
                >
                  <MenuItem key="0" value={"Ai Variant"}>
                    Ai Variant
                  </MenuItem>
                  <MenuItem key="org" value={"Original"}>
                    Original
                  </MenuItem>
                  {Object.keys(AllOptions.background).map((value, index) => {
                    // console.log(value);
                    if (value.length === 2) {
                      return (
                        <MenuItem key={index} value={value}>
                          {value}
                        </MenuItem>
                      );
                    }
                  })}
                </Select>
                <Button onClick={generateImage}>
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
                            // color: "#0056b3",
                          },
                          "25%": {
                            transform: "rotate(90deg)",
                            // color: "#00b3a5",
                          },
                          "50%": {
                            transform: "rotate(180deg)",
                            // color: "#ff8c00",
                          },
                          "100%": {
                            transform: "rotate(360deg)",
                            // color: "#e60073",
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
            </Box>
          </Box>
          {/* image Box */}
          <Box
            width="100%"
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
                width: isTablet ? "auto" : "100%",
                height: "512px",
                // backgroundColor: theme.palette.neutral.main,
                borderRadius: "10px",
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
                borderRadius={"4px"}
                sx={{ zIndex: "1", position: "absolute" }}
              />
              <Box
                component="img"
                id="body"
                src={AllOptions.body[body]}
                width="512px"
                sx={{ zIndex: "1", position: "absolute" }}
              />
              <Box
                component="img"
                id="eyes"
                src={AllOptions.eyes[eyes]}
                width="512px"
                sx={{ position: "absolute", zIndex: "1" }}
              />
              <Box
                component="img"
                id="outfit"
                src={AllOptions.outfit[outfit]}
                width="512px"
                sx={{ position: "absolute", zIndex: "1" }}
              />
              <Box
                component="img"
                id="mouth"
                src={AllOptions.mouth[mouth]}
                width="512px"
                sx={{ position: "absolute", zIndex: "1" }}
              />
              <Box
                component="img"
                id="hair"
                src={AllOptions.hair[hair]}
                width="512px"
                sx={{ position: "absolute", zIndex: "1" }}
              />
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
                  top: "10px", // Move 10 pixels down from the top
                  right: "10px", // Move 10 pixels from the right
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
                  top: "10px", // Move 10 pixels down from the top
                  right: "10px", // Move 10 pixels from the right
                }}
              />
            )}
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
          onClick={handleTweet}
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
