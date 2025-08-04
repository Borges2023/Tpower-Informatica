import React from "react";
import axios from "axios";

const Image = ({ src, ...rest }) => {
  src = src.includes("https")
    ? src
    : axios.defaults.baseURL.replace("/api", "") + "/uploads/" + src;

  return <img {...rest} src={src} />;
};

export default Image;
