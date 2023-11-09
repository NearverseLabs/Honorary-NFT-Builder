import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { configureStore } from "@reduxjs/toolkit";
import globalReducer from "state";
import { Provider } from "react-redux";
import { api } from "state/api";
import { setupListeners } from "@reduxjs/toolkit/dist/query";

const preload = (images) => {
  images.keys().forEach((image) => {
    // console.log(images(image));
    const link = document.createElement("link");
    link.rel = "preload";
    link.href = images(image);
    link.as = "image";
    document.head.appendChild(link);
  });
};
let images = require.context("./assets/Background", true, /\.(png|jpe?g|svg)$/);
preload(images);
images = require.context("./assets/Body", true, /\.(png|jpe?g|svg)$/);
preload(images);
images = require.context("./assets/Eyes", true, /\.(png|jpe?g|svg)$/);
preload(images);
images = require.context("./assets/Headwear", true, /\.(png|jpe?g|svg)$/);
preload(images);
images = require.context("./assets/Mouth", true, /\.(png|jpe?g|svg)$/);
preload(images);
images = require.context("./assets/Outfit", true, /\.(png|jpe?g|svg)$/);
preload(images);

const store = configureStore({
  reducer: {
    global: globalReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefault) => getDefault().concat(api.middleware),
});
setupListeners(store.dispatch);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
