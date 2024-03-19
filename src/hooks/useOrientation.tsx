import React, { useState, useEffect } from "react";
import { Dimensions } from "react-native";

const useOrientation = () => {
  const [orientation, setOrientation] = useState(getOrientation());

  function getOrientation() {
    const { width, height } = Dimensions.get("window");
    return width > height ? "LANDSCAPE" : "PORTRAIT";
  }

  useEffect(() => {
    const handleResize = () => {
      setOrientation(getOrientation());
    };

    const subscription = Dimensions.addEventListener("change", handleResize);

    return () => {
      subscription.remove();
    };
  }, []);

  return orientation;
};

export default useOrientation;
