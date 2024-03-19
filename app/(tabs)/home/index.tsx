import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
} from "react-native";
import React, { useContext } from "react";
import { Link } from "expo-router";
import { Color } from "../../../src/styles/GlobalStyles";
import Swiper from "react-native-swiper";

// Components
import ShadowWrapper from "../../../src/components/ShadowWrapper";
import Button from "../../../src/components/Button";
import ProgressBar from "../../../src/components/ProgressBar";
// Assets
import airCraftBackground from "../../../assets/images/pointslayout.jpeg";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { AppContext } from "../../../src/context/AppContext";
import { formattedPointsFunc } from "../../../src/other/helpers";

const Home = () => {
  const { userDataState, logout } = useContext(AppContext);

  const { pointsReceived, pointsSpent } = userDataState;

  const logoutDummy = () => {
    logout();
  };

  return (
    // <View style={styles.container}>
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <ShadowWrapper>
          <View style={styles.innerContainer}>
            <View style={styles.titleContainer}>
              <MaterialCommunityIcons
                name="map-marker-radius-outline"
                size={24}
                color={Color.color_grey60}
              />
              <Text style={styles.title}>Available</Text>
            </View>
            <View style={styles.statWrapper}>
              <View style={styles.contentContainer}>
                <Text style={styles.contentTitle}>Bases</Text>
                <Text style={styles.contentMain}>10</Text>
                <ProgressBar fillInPercentage={50} />
                <Text style={styles.contentSecondary}>out of 10</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.contentContainer}>
                <Text style={styles.contentTitle}>Applications</Text>
                <Text style={styles.contentMain}>2</Text>
                <ProgressBar fillInPercentage={70} />
                <Text style={styles.contentSecondary}>out of 3</Text>
              </View>
            </View>
            <Link href={{ pathname: "bases" }} asChild>
              <Button title="Base Preference" />
            </Link>
          </View>
        </ShadowWrapper>
      </View>
      <View style={[styles.innerContainer, styles.flexDirectionRow]}>
        <ShadowWrapper
          containerStyle={[
            {
              justifyContent: "space-between",
              flex: 1,
            },
          ]}
        >
          {/* <View> */}
          <Swiper
            loop={false}
            paginationStyle={{
              top: 4,
              bottom: null,
              left: null,
              right: 10,
            }}
            height={0}
          >
            <View
              style={{
                flex: 1,
                // justifyContent: "space-between",
              }}
            >
              <View style={[styles.titleContainer, styles.flexDirectionRow]}>
                <MaterialCommunityIcons
                  name="wallet-outline"
                  size={24}
                  color={Color.color_grey60}
                />
                <Text style={styles.cardTitle}>Balance</Text>
              </View>
              <View style={{ flex: 1, justifyContent: "center" }}>
                <Text style={styles.pointsLabel}>points</Text>
                <Text style={styles.contentMain}>
                  {formattedPointsFunc(pointsReceived) || 0}
                </Text>
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <View style={[styles.titleContainer, styles.flexDirectionRow]}>
                <Ionicons
                  name="swap-vertical"
                  size={24}
                  color={Color.color_grey60}
                />
                <Text style={styles.cardTitle}>Spent</Text>
              </View>
              <View style={{ flex: 1, justifyContent: "center" }}>
                <Text style={styles.pointsLabel}>points</Text>
                <Text style={styles.contentMain}>
                  {formattedPointsFunc(pointsSpent) || 0}
                </Text>
              </View>
            </View>
          </Swiper>
          {/* </View> */}
          <Link href={"points"} asChild>
            <Button
              title="Explore"
              style={styles.exploreButton}
              textStyle={styles.buttonText}
            />
          </Link>
        </ShadowWrapper>

        <View style={[styles.innerContainer]}>
          <ShadowWrapper containerStyle={{ flex: 1 }}>
            <Link href={{ pathname: "bases", params: { tab: "Applications" } }}>
              <View style={{ gap: 14 }}>
                <View style={[styles.titleContainer, styles.flexDirectionRow]}>
                  <Feather name="map" size={24} color={Color.color_grey60} />
                  <Text style={styles.cardTitle}>My Bidding</Text>
                </View>

                <Text
                  style={[styles.additionalText, { color: Color.color_blue50 }]}
                >
                  Details
                </Text>
              </View>
            </Link>
          </ShadowWrapper>
          <ShadowWrapper
            containerStyle={{
              paddingHorizontal: 0,
              paddingVertical: 0,
            }}
          >
            <ImageBackground
              style={{
                paddingHorizontal: 16,
                paddingVertical: 16,
              }}
              source={airCraftBackground}
              resizeMode="cover"
            >
              <View style={styles.overlay} />
              <View style={{ gap: 14 }}>
                <View style={[styles.titleContainer, styles.flexDirectionRow]}>
                  <MaterialIcons
                    name="insert-chart-outlined"
                    size={24}
                    color={Color.backgroundWhite}
                  />
                  <Text
                    style={[styles.cardTitle, { color: Color.backgroundWhite }]}
                  >
                    Points
                  </Text>
                </View>
                <Text
                  style={[
                    styles.additionalText,
                    { color: Color.backgroundWhite },
                  ]}
                >
                  How to get?
                </Text>
              </View>
            </ImageBackground>
          </ShadowWrapper>
        </View>
      </View>
      {/* Delete after implementation */}
      <Button title="Dummy logout" onPress={logoutDummy} />
    </ScrollView>
  );
  {
    /* </View> */
  }
};

export default Home;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 25,
    gap: 25,
    paddingHorizontal: 16,
  },
  innerContainer: {
    // ScrollView
    flex: 1,
    gap: 16,
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  title: {
    fontSize: 16,
  },
  statWrapper: {
    flexDirection: "row",
  },
  divider: {
    width: 1,
    backgroundColor: Color.color_blue10,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 30,
    alignItems: "center",
    gap: 8,
  },
  contentTitle: {
    color: Color.color_grey70,
    fontSize: 12,
    fontFamily: "Inter_500",
  },
  contentMain: {
    color: Color.color_grey90,
    fontSize: 24,
    fontFamily: "Inter_500",
  },
  contentSecondary: {
    fontSize: 12,
    color: Color.color_grey50,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: "Inter_500",
    color: Color.color_grey90,
  },
  flexDirectionRow: {
    flexDirection: "row",
  },
  pointsLabel: {
    fontFamily: "Inter",
    fontSize: 12,
    color: Color.color_grey70,
  },
  additionalText: {
    fontFamily: "Inter",
    fontSize: 12,
  },
  exploreButton: {
    backgroundColor: Color.backgroundWhite,
    borderColor: Color.color_grey60,
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "Inter_500",
    color: Color.color_grey90,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(46, 87, 250, 0.8)",
  },
});
