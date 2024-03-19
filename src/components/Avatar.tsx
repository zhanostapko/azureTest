import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, ImageProps } from "react-native";
import useFetch from "../hooks/useFetch";
import { AppContext } from "../context/AppContext";
import useApi from "../hooks/useApi";
import * as FileSystem from "expo-file-system";
import { Color } from "../styles/GlobalStyles";
import { useNetInfo } from "@react-native-community/netinfo";
import { Image } from "expo-image";

type Props = {
  size?: number;
};

const Avatar = ({ size = 32 }: Props) => {
  const [img, setImg] = useState<string | null>(null);
  const { userDataState } = useContext(AppContext);
  const { firstName, lastName, code } = userDataState;
  const { apiRequest } = useApi();

  if (!lastName && !firstName) return null;

  const netInfo = useNetInfo();

  useEffect(() => {
    // if (data) {
    //   context.setUrlNameFromId(`${data.firstName} ${data.lastName}`);
    // } else {
    //   context.setIsLoading(isLoading);
    // }

    const fetchImageData = async () => {
      if (code) {
        setImg(null);

        try {
          const response = await apiRequest(`api/Image?code=${code}`);

          if (response.status === 204) return null;
          const blobData = await response.blob();
          const reader = new FileReader();
          reader.readAsDataURL(blobData);

          reader.onloadend = async () => {
            if (typeof reader.result === "string") {
              const base64data = reader?.result?.split(",")[1];
              const filePath = FileSystem.documentDirectory + `image.jpg`;

              await FileSystem.deleteAsync(filePath, { idempotent: true });
              await FileSystem.writeAsStringAsync(filePath, base64data, {
                encoding: FileSystem.EncodingType.Base64,
              });

              setImg(filePath);
            }
          };
        } catch (error) {
          console.error("Error fetching image data:", error);
        }
      }
    };

    fetchImageData();
  }, [code]);

  const initials = `${firstName?.charAt(0)}${lastName?.charAt(
    0
  )}`.toLocaleUpperCase();

  return (
    <View
      style={[
        styles.avatarContainer,
        { width: size, height: size, borderRadius: size * 0.5 },
      ]}
    >
      {img ? (
        <Image
          cachePolicy={"none"}
          source={{ uri: img }}
          style={[styles.avatarImage, { borderRadius: size * 0.5 }]}
        />
      ) : (
        <Text style={styles.avatarText}>{initials}</Text>
      )}
      {/* <View
        style={[
          styles.onlineIndicator,
          {
            backgroundColor: netInfo.isConnected
              ? Color.color_green50
              : Color.color_grey60,
          },
        ]}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ccc",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    position: "relative",

    // borderRadius: 16,
  },
  avatarText: {
    fontSize: 20,
    color: "#fff",
  },
  onlineIndicator: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 8,
    height: 8,
    borderRadius: 8,
    zIndex: 2,
  },
});

export default Avatar;
