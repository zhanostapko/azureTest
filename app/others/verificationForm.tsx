import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Pressable,
  TextInput,
  SafeAreaView,
} from "react-native";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import React, {
  useRef,
  useMemo,
  useState,
  useEffect,
  useContext,
  useLayoutEffect,
} from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import { useNavigation, Stack } from "expo-router";
import useFetch from "../../src/hooks/useFetch";
import { format, isBefore, isAfter, isEqual } from "date-fns";
import { useSafeAreaInsets } from "react-native-safe-area-context";
// Components
import ShadowWrapper from "../../src/components/ShadowWrapper";
import Avatar from "../../src/components/Avatar";
import ShortCodeBadge from "../../src/components/ShortCodeBadge";
import Button from "../../src/components/Button";
import DisclaimerWindowWrapper from "../../src/components/DisclaimerWindowWrapper";

// Assets
import mainBackground from "../../assets/images/mainBackground.png";
import { Color } from "../../src/styles/GlobalStyles";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import dummyAvatar from "../../assets/dummy_assets/avatar.png";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Loader from "../../src/components/Loader";
import { AppContext } from "../../src/context/AppContext";
import useApi from "../../src/hooks/useApi";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

type VerificationFormItemType = {
  name: string;
  start: string;
  end: string;
  days: number;
};

type GetRolesType = {
  key: string;
  value: {
    name: string;
    start: string;
    end: string;
    days: number;
  }[];
};
export type RootStackParamList = {
  [key: string]: { title: string; message: string } | undefined;
};

const VerificationForm = () => {
  const [declineWindowOpened, setDeclineWindowOpened] = useState(false);
  const [disclaimerWindow, setDisclaimerWindow] = useState(true);
  const [declineComment, setDeclineComment] = useState("");
  const { userDataState, logout } = useContext(AppContext);
  const { apiRequest, isLoading } = useApi();
  const insets = useSafeAreaInsets();

  const {
    id,
    position,
    nia,
    lastName,
    firstName,
    qualification,
    rank,
    startDate,
    endDate,
    scale,
    status,
    code,
  } = userDataState;

  const statData = [
    { title: "NIA", data: nia },
    { title: "QUAL.", data: qualification },
    { title: "RANK.", data: rank },
    {
      title: "START DATE",
      data: (startDate && format(new Date(startDate), "MMM d, yyyy")) || "-",
    },
    {
      title: "END DATE",
      data: (endDate && format(new Date(endDate), "MMM d, yyyy")) || "-",
    },
    { title: "SCALE", data: scale },
  ];
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const bottomSheetRef = useRef(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (declineWindowOpened && flatListRef.current) {
      setTimeout(() => {
        flatListRef?.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [declineWindowOpened]);

  const snapPoints = useMemo(() => ["10", "25%", "50%", "95%"], []);

  const { data: verificationForm, isLoading: verificationFormLoading } =
    useFetch<GetRolesType[]>(`api/Crew/GetRoles?code=${code}`);

  const closeDeclineWindow = () => {
    setDeclineWindowOpened(false);
  };

  const closeDisclaimerWindowsHandler = () => {
    setDisclaimerWindow(false);
  };

  const declineHandler = () => {
    setDeclineWindowOpened(true);
  };
  const confirmHandler = async () => {
    // Confirm Fetching
    const body = {
      id: 0,
      crewId: id,
      status: "Confirmed",
      comment: "Confirmed",
    };
    await apiRequest("api/CrewVerification", "POST", body);
    navigation.navigate("others/final", {
      title: "Thank you for the information",
      message: "We have sent your details to the planning department.",
    });
  };

  const commentHandler = (comment: string) => {
    setDeclineComment(comment);
  };

  const sendRejectedForm = async () => {
    const body = {
      id: 0,
      crewId: id,
      status: "Rejected",
      comment: declineComment,
    };
    await apiRequest("api/CrewVerification", "POST", body);
    navigation.navigate("others/final", {
      title: "Thank you for the information",
      message: "We have sent your details to the planning department.",
    });
  };

  const onExitHandler = () => {
    logout();
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: insets.top,
      }}
    >
      <View style={styles.screenHeader}>
        <Text style={styles.screenHeaderText}>Personal Details</Text>
        <Pressable style={styles.exitButton} onPress={onExitHandler}>
          <Ionicons
            // style={{ textAlign: "right" }}
            name="exit-outline"
            size={24}
            color={Color.color_grey70}
          />
        </Pressable>
      </View>

      <View style={{ flex: 1 }}>
        {isLoading && <Loader />}
        <ImageBackground
          source={mainBackground}
          resizeMode="stretch"
          style={{ flex: 1, paddingHorizontal: 16, paddingTop: 32 }}
        >
          {status === "Rejected" && (
            <DisclaimerWindowWrapper style={styles.attention}>
              <View>
                <Text style={styles.attentionHeader}>Attention</Text>
              </View>
              <View>
                <Text style={styles.attentionContent}>
                  Your profile is not active until all data in the table has
                  been approved by the planning department
                </Text>
              </View>
            </DisclaimerWindowWrapper>
          )}
          <View
            style={{
              alignItems: "center",
              paddingBottom: 32,
              gap: 34,
            }}
          >
            <View
              style={{
                alignItems: "center",
                position: "relative",
              }}
            >
              <Avatar size={90} />
              <ShortCodeBadge
                code={code}
                style={{ position: "absolute", bottom: -16 }}
              />
            </View>
            <View style={{ gap: 16, alignItems: "center" }}>
              <Text
                style={{
                  fontSize: 24,
                  fontFamily: "Inter_500",
                  textAlign: "center",
                }}
              >
                {`${firstName} ${lastName}`}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "Inter_500",
                  color: Color.color_grey70,
                }}
              >
                {position}
              </Text>
            </View>
          </View>

          <View style={{ flex: 1, gap: 16 }}>
            <View style={{ flexDirection: "row", gap: 16, flexWrap: "wrap" }}>
              {statData?.map((item, index) => (
                <ShadowWrapper
                  key={index}
                  containerStyle={{ flex: 1, padding: 8, minWidth: 100 }}
                >
                  <View style={{ gap: 16 }}>
                    <Text
                      style={{
                        fontFamily: "Inter_500",
                        fontSize: 12,
                        color: Color.color_grey60,
                      }}
                    >
                      {item.title}
                    </Text>
                    <Text style={{ fontSize: 16, fontFamily: "Inter_500" }}>
                      {item.data}
                    </Text>
                  </View>
                </ShadowWrapper>
              ))}
            </View>
          </View>
          <BottomSheet
            handleIndicatorStyle={{
              backgroundColor: Color.color_grey50,
              width: 48,
            }}
            ref={bottomSheetRef}
            index={1}
            snapPoints={snapPoints}
            style={{
              paddingHorizontal: 16,
            }}
          >
            <View style={{ flex: 1, marginTop: 16, gap: 16 }}>
              <View>
                <Text style={styles.tableTitle}>
                  Point Configuration Details
                </Text>
              </View>
              <View style={styles.header}>
                <View style={styles.row}>
                  <Text style={styles.cell}>Point Category</Text>
                  <Text style={styles.cell}>Start Date</Text>
                  <Text style={styles.cell}>End Date</Text>
                  <Text style={styles.cell}>Duration on today</Text>
                </View>
              </View>
              <View style={{ flex: 1 }}>
                {verificationFormLoading && <Loader />}
                {!verificationFormLoading && verificationForm && (
                  <FlatList
                    ref={flatListRef}
                    contentContainerStyle={{ flexGrow: 1 }}
                    data={verificationForm[0]?.value}
                    keyExtractor={(item) => item.name + Math.random()}
                    renderItem={({ item }) => {
                      const today = new Date();
                      const endDate = new Date(item.end);
                      const startDate = new Date(item.start);
                      let effectiveEndDate;

                      if (
                        !endDate ||
                        isBefore(endDate, startDate) ||
                        isAfter(endDate, today)
                      ) {
                        effectiveEndDate = null;
                      } else {
                        effectiveEndDate = endDate;
                      }

                      return (
                        <View style={styles.row}>
                          <Text style={styles.cell}>{item.name}</Text>
                          <Text style={styles.cell}>
                            {(item.start &&
                              format(new Date(item.start), "MMM d, yyyy")) ||
                              "-"}
                          </Text>
                          <Text style={styles.cell}>
                            {" "}
                            {(effectiveEndDate &&
                              format(
                                new Date(effectiveEndDate),
                                "MMM d, yyyy"
                              )) ||
                              "-"}
                          </Text>
                          <Text style={styles.cell}>{item.days}</Text>
                        </View>
                      );
                    }}
                    ListFooterComponent={
                      <View style={{ flex: 1 }}>
                        {declineWindowOpened ? (
                          <View style={styles.declineWindowContainer}>
                            <Text style={styles.declineHeader}>
                              Suggest your changes.
                            </Text>
                            <Text style={styles.declineText}>
                              Please, if you notice any inaccuracies in the
                              provided Verification form, let us know. Write a
                              comment below and send it to the planning
                              department.
                            </Text>
                            {disclaimerWindow && (
                              <DisclaimerWindowWrapper>
                                <View style={styles.disclaimerContainer}>
                                  <View
                                    style={styles.disclaimerHeaderContainer}
                                  >
                                    <View
                                      style={styles.disclaimerTitleContainer}
                                    >
                                      <AntDesign
                                        name="exclamationcircleo"
                                        size={16}
                                        color={Color.color_yellow50}
                                      />
                                      <Text style={styles.disclaimerTitle}>
                                        Please pay attention!
                                      </Text>
                                    </View>
                                    <Pressable
                                      onPress={closeDisclaimerWindowsHandler}
                                    >
                                      <Entypo
                                        name="cross"
                                        size={20}
                                        color="black"
                                      />
                                    </Pressable>
                                  </View>
                                  <Text style={styles.disclaimerContent}>
                                    We would like to draw your attention to the
                                    fact that verification will occur faster if
                                    you provide accurate start and end dates for
                                    the activity, as well as be prepared to
                                    provide supporting documents if requested by
                                    the planning department.
                                  </Text>
                                  <Text style={styles.disclaimerContent}>
                                    Please note that SmartPoints will only be
                                    calculated based on{" "}
                                    <Text style={styles.textBold}>
                                      specific roles listed
                                    </Text>
                                    , ensuring accurate assessment.
                                    Additionally, the day count will be
                                    determined by the{" "}
                                    <Text style={styles.textBold}>
                                      current date
                                    </Text>
                                    .
                                  </Text>
                                </View>
                              </DisclaimerWindowWrapper>
                            )}
                            <View style={styles.commentContainer}>
                              <Text style={styles.commentTitle}>
                                Your comment (required)
                              </Text>
                              <TextInput
                                onChangeText={commentHandler}
                                style={styles.commentInput}
                                multiline
                                numberOfLines={4}
                                placeholder="Please write down any data that we overlooked or miscalculated."
                                scrollEnabled
                              />
                            </View>
                            <View style={styles.buttonsContainer}>
                              <Button
                                containerStyle={{ flex: 1 }}
                                onPress={closeDeclineWindow}
                                title="Cancel"
                                style={styles.noButton}
                                textStyle={{ color: Color.color_grey90 }}
                              />
                              <Button
                                disabled={!declineComment}
                                onPress={sendRejectedForm}
                                containerStyle={{ flex: 1 }}
                                title={
                                  <View style={styles.sendButtonContent}>
                                    <Text style={styles.sendButtonText}>
                                      Send
                                    </Text>
                                    <FontAwesome
                                      name="send-o"
                                      size={16}
                                      color={Color.backgroundWhite}
                                    />
                                  </View>
                                }
                                style={styles.yesButton}
                              />
                            </View>
                          </View>
                        ) : (
                          <>
                            {status !== "Rejected" && (
                              <View style={styles.actions}>
                                <Text style={styles.footerTitle}>
                                  Do you verify that all above mentioned
                                  information is correct?
                                </Text>
                                <View style={styles.buttonsContainer}>
                                  <Button
                                    containerStyle={{ flex: 1 }}
                                    onPress={declineHandler}
                                    title="No"
                                    style={styles.noButton}
                                    textStyle={{ color: Color.color_grey90 }}
                                  />
                                  <Button
                                    onPress={confirmHandler}
                                    containerStyle={{ flex: 1 }}
                                    title="Yes"
                                    style={styles.yesButton}
                                  />
                                </View>
                              </View>
                            )}
                          </>
                        )}
                      </View>
                    }
                  />
                )}
              </View>
            </View>
          </BottomSheet>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
};

export default VerificationForm;

const styles = StyleSheet.create({
  screenHeader: {
    position: "relative",
    flexDirection: "row",
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  screenHeaderText: {
    fontSize: 18,
    fontFamily: "Inter_600",
    color: Color.color_grey90,
  },
  exitButton: {
    position: "absolute",
    right: 16,
  },
  header: {
    backgroundColor: Color.color_grey5,
    borderTopColor: Color.color_grey10,
    borderBottomColor: Color.color_grey10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  tableTitle: {
    fontSize: 18,
    fontFamily: "Inter_500",
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  cell: {
    flex: 1,
    color: Color.color_grey70,
    textTransform: "uppercase",
    textAlign: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontFamily: "Inter_500",
    fontSize: 8,
    letterSpacing: 0.2,
    lineHeight: 20,
  },
  actions: {
    flex: 1,
    gap: 16,
    paddingBottom: 20,
    paddingTop: 10,
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 16,
  },
  yesButton: {
    backgroundColor: Color.color_blue50,
  },
  noButton: {
    backgroundColor: Color.backgroundWhite,
    borderWidth: 1,
    borderColor: Color.borderColor,
  },
  footerTitle: {
    textAlign: "center",
    fontFamily: "Inter_500",
    fontSize: 18,
  },
  disclaimerContainer: {
    gap: 16,
  },
  disclaimerHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  disclaimerTitleContainer: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  disclaimerTitle: {
    color: Color.color_grey90,
    fontFamily: "Inter",
    fontSize: 14,
  },
  disclaimerContent: {
    fontFamily: "Inter",
    fontSize: 12,
    lineHeight: 16,
    color: Color.color_grey70,
  },
  textBold: {
    fontFamily: "Inter_700",
  },
  declineWindowContainer: {
    gap: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  declineHeader: {
    fontFamily: "Inter_500",
    fontSize: 18,
    textAlign: "center",
  },
  declineText: {
    fontSize: 13,
    fontFamily: "Inter",
    lineHeight: 20,
    textAlign: "center",
    color: Color.color_grey90,
  },
  commentContainer: {
    gap: 12,
  },
  commentTitle: {
    fontFamily: "Inter_500",
    fontSize: 14,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: Color.borderColor,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    textAlignVertical: "top",
    height: 80,
  },
  sendButtonContent: {
    flexDirection: "row",
    gap: 8,
  },
  sendButtonText: {
    color: Color.backgroundWhite,
  },
  attention: {
    backgroundColor: "rgba(199, 36, 36, 0.80)",
    gap: 16,
    marginBottom: 16,
  },
  attentionHeader: {
    fontFamily: "Inter_500",
    letterSpacing: 0.2,
    fontSize: 12,
    textTransform: "uppercase",
    color: Color.backgroundWhite,
  },
  attentionContent: {
    color: Color.backgroundWhite,
    lineHeight: 20,
    fontFamily: "Inter",
    fontSize: 12,
  },
});
