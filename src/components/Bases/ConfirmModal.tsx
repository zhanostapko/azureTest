import {
  StyleSheet,
  Text,
  View,
  LayoutChangeEvent,
  Switch,
  TextInput,
  Pressable,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, {
  useState,
  Ref,
  useContext,
  useRef,
  useEffect,
  RefObject,
} from "react";
import CustomModal from "../CustomModal";
import DisclaimerWindowWrapper from "../DisclaimerWindowWrapper";
import { Color } from "../../styles/GlobalStyles";
import DropDownPicker from "react-native-dropdown-picker";
import Button from "../Button";
import { FormDataType } from "./AdditionalBaseView";
import DatePicker from "../DatePicker";
import { Feather } from "@expo/vector-icons";
import useApi from "../../hooks/useApi";
import { AppContext } from "../../context/AppContext";
import { format, add } from "date-fns";
import { useNavigation } from "expo-router";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import Loader from "../Loader";
import { ItemType } from "./AdditionalBaseView";
import { ProjectType } from "./BasesTopTab";
import { stripHtmlTags } from "../../other/helpers";
import {
  BottomSheetTextInput,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";

const overlapDaysFromSettings = 30;

type Props = {
  project: Partial<FormDataType> | ProjectType;
  modalRef: Ref<any> | undefined;
};

type ModalMethods = {
  open: () => void;
};

type RootStackParamList = {
  "others/final": { title: string; message: string };
};

const initialDropDownList = [
  {
    label: "High",
    value: "1",
    disabled: false,
  },
  { label: "Medium", value: "2", disabled: false },
  { label: "Low", value: "3", disabled: false },
];

const ConfirmModal = ({ project, modalRef }: Props) => {
  const [modalContentHeight, setModalContentHeight] = useState<number | null>(
    null
  );
  const [biddingDates, setBiddingDates] = useState({ from: "", to: "" });

  const [fullPeriodSwitchState, setFullPeriodSwitchState] = useState(
    project?.fullPeriod
  );
  const [dropdownData, setDropdownData] = useState(initialDropDownList);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownSelectedValue, setDropdownSelectedValue] = useState<any>(null);
  const { apiRequest, isLoading } = useApi();
  const context = useContext(AppContext);
  const { userDataState } = context;
  const [error, setError] = useState({
    dropdownValue: false,
    fromDate: false,
    toDate: false,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [comment, setComment] = useState("");

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  let details: ItemType[] = [];

  const { fullPeriod, iataCode, name, id, fromDate, tillDate } = project;

  if (project.hasOwnProperty("details")) {
    details = (project as Partial<FormDataType>).details!;
  } else if (project.hasOwnProperty("projectDetails")) {
    details = (project as ProjectType).projectDetails;
  }

  const getEarliestDate = (details: ItemType[] | undefined): string => {
    if (!details || details.length === 0) return new Date().toISOString();

    return details.reduce((prev, current) => {
      return new Date(prev.fromDate) < new Date(current.fromDate)
        ? prev
        : current;
    }).fromDate;
  };

  const startDateMin = () => {
    const earliestDateStr = getEarliestDate(details);
    const nowStr = new Date().toISOString();

    return new Date(earliestDateStr) < new Date() ? nowStr : earliestDateStr;
  };

  const findCoveredProject = () => {
    const startDate = new Date(biddingDates.from + "T00:00:00Z");
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + overlapDaysFromSettings);

    for (const projectDetail of details) {
      const projectStart = new Date(projectDetail.fromDate + "Z");
      const projectEnd = new Date(projectDetail.tillDate + "Z");

      if (startDate <= projectStart && endDate >= projectEnd) {
        return projectEnd.toISOString().split("T")[0];
      }
      const latestStart = new Date(
        Math.max(startDate.getTime(), projectStart.getTime())
      );
      const earliestEnd = new Date(
        Math.min(endDate.getTime(), projectEnd.getTime())
      );
      const diffTime = Math.abs(earliestEnd.getTime() - latestStart.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > overlapDaysFromSettings) {
        const thirtyDayMark = new Date(latestStart);
        thirtyDayMark.setDate(
          thirtyDayMark.getDate() + overlapDaysFromSettings
        );
        return thirtyDayMark.toISOString().split("T")[0];
      }
    }

    return "";
  };

  const errorModalClose = () => {
    setModalVisible(false);
  };

  const onLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;

    setModalContentHeight(height);
  };
  const switchStateChangeHandler = () => {
    setFullPeriodSwitchState(!fullPeriodSwitchState);
  };

  const biddingSaveHandler = (date: string, dateType: string) => {
    const dateIn = format(new Date(date), "yyyy-MM-dd");

    setBiddingDates((prevState) => {
      return { ...prevState, [dateType]: dateIn };
    });
  };

  const checkEmptyFields = () => {
    let hasEmptyFields = false;
    const errorConditions = [
      { condition: !dropdownSelectedValue, errorKey: "dropdownValue" },
      {
        condition: !fullPeriodSwitchState && !fullPeriod && !biddingDates.from,
        errorKey: "fromDate",
      },
      {
        condition: !fullPeriodSwitchState && !fullPeriod && !biddingDates.to,
        errorKey: "toDate",
      },
    ];

    errorConditions.forEach(({ condition, errorKey }) => {
      if (condition) {
        setError((prevState) => ({
          ...prevState,
          [errorKey]: true,
        }));
        hasEmptyFields = true;
      }
    });
    return hasEmptyFields;
  };

  const resetError = (fieldName: string) => {
    setError((prevState) => {
      return { ...prevState, [fieldName]: false };
    });
  };

  const confirmApplicationHandler = async () => {
    const hasEmptyFields = checkEmptyFields();
    if (hasEmptyFields) return null;

    const plainComment = stripHtmlTags(comment);

    const requestBody = {
      crewId: userDataState.id,
      priority: dropdownSelectedValue,
      projectId: id,
      createdByManager: false,
      bidFrom:
        fullPeriod || fullPeriodSwitchState ? fromDate : biddingDates.from,
      bidTo: fullPeriod || fullPeriodSwitchState ? tillDate : biddingDates.to,
      status: "Submitted",
      comment: plainComment,
    };

    try {
      setConfirmLoading(true);
      const res = await apiRequest("api/Bidding", "POST", requestBody);

      if (res.status === 500) {
        setModalVisible(true);
        return null;
      }
      if (!res.ok) throw new Error("Something went wrong");

      navigation.navigate("others/final", {
        title: "Thank you. Application Submitted",
        message:
          " We have sent your application to the Crew Planning department.",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setConfirmLoading(false);
    }
  };

  const dropDownIsDisabled =
    !fullPeriodSwitchState && (!biddingDates.from || !biddingDates.to);

  useEffect(() => {
    const checkPriorityAvailable = async () => {
      const startDate =
        fullPeriod || fullPeriodSwitchState ? fromDate : biddingDates.from;
      const endDate =
        fullPeriod || fullPeriodSwitchState ? tillDate : biddingDates.to;

      if (!startDate || !endDate) {
        console.log("Invalid dates, skipping API request.");
        return;
      }
      try {
        const res = await apiRequest(
          `api/Bidding/CheckPriority?crewId=${userDataState.id}&StartDate=${startDate}&EndDate=${endDate}`
        );

        if (!res.ok) throw new Error("Something wrong");
        if (res.status === 204) setDropdownData(initialDropDownList);

        const selectedPriority = await res.json();
        const newData = dropdownData.map((priority) => {
          const isDisabled = selectedPriority.some(
            (item: any) => item.priority === +priority.value
          );
          return { ...priority, disabled: isDisabled };
        });

        setDropdownData(newData);
      } catch (error) {}
    };
    checkPriorityAvailable();
  }, [fullPeriodSwitchState, biddingDates]);

  return (
    <>
      {confirmLoading ? (
        <Loader />
      ) : (
        <CustomModal contentHeight={modalContentHeight} ref={modalRef}>
          <BottomSheetScrollView
            nestedScrollEnabled
            // contentContainerStyle={{ backgroundColor: "pink", flex: 1 }}
          >
            <View onLayout={onLayout} style={styles.modalContainer}>
              <View>
                <Text style={styles.modalTitle}>Application for a base:</Text>
                <Text
                  style={styles.modalProjectName}
                >{`${name} - ${iataCode}`}</Text>
              </View>
              {fullPeriod && (
                <DisclaimerWindowWrapper>
                  <View style={styles.disclaimerContainer}>
                    <View style={styles.disclaimerHeaderContainer}>
                      <View style={styles.disclaimerTitleContainer}>
                        <Feather
                          name="alert-triangle"
                          size={16}
                          color={Color.color_yellow50}
                        />
                        <Text style={styles.disclaimerTitle}>Attention!</Text>
                      </View>
                    </View>
                    <Text style={styles.disclaimerContent}>
                      No rotations are expected, thus please apply only in case
                      of availability for the whole length of the project.
                    </Text>
                  </View>
                </DisclaimerWindowWrapper>
              )}
              <DisclaimerWindowWrapper
                style={{ backgroundColor: Color.color_green10 }}
              >
                <Text>
                  Crew planning department will make a decision of your
                  application in 2 weeks. If you win a bid,{" "}
                  <Text style={styles.important}>20%</Text> from your Smart
                  wallet will be deducted
                </Text>
              </DisclaimerWindowWrapper>
              <View style={styles.switchContainer}>
                <Text style={styles.commentTitle}>
                  I apply for the whole period
                </Text>
                <Switch
                  disabled={fullPeriod}
                  value={fullPeriodSwitchState}
                  onValueChange={switchStateChangeHandler}
                  trackColor={{
                    true: fullPeriod ? Color.color_grey10 : Color.color_blue50,
                  }}
                  thumbColor={Color.backgroundWhite}
                />
              </View>

              {!fullPeriodSwitchState && (
                <View style={styles.datesContainer}>
                  <DatePicker
                    onSave={(date) => biddingSaveHandler(date, "from")}
                    pickerTitle="From"
                    containerStyles={styles.datePickerContainer}
                    selectedDate={biddingDates.from}
                    error={error.fromDate}
                    onFocus={() => resetError("fromDate")}
                    minDate={startDateMin()}
                    maxDate={`${
                      tillDate &&
                      add(new Date(tillDate), {
                        days: -1,
                      })
                    }`}
                  />
                  <DatePicker
                    onSave={(date) => biddingSaveHandler(date, "to")}
                    pickerTitle="To"
                    containerStyles={styles.datePickerContainer}
                    selectedDate={biddingDates.to}
                    error={error.toDate}
                    onFocus={() => resetError("toDate")}
                    minDate={findCoveredProject()}
                    maxDate={tillDate}
                    disabled={!biddingDates.from}
                  />
                </View>
              )}
              <View style={styles.selectContainer}>
                <Text>Set priority</Text>

                <View>
                  <DropDownPicker
                    listMode="SCROLLVIEW"
                    disabled={dropDownIsDisabled}
                    containerProps={{
                      style: {
                        backgroundColor: Color.backgroundWhite,
                        height: dropdownOpen ? 200 : "auto",
                      },
                    }}
                    style={[
                      styles.selectedPriorityContainer,
                      error.dropdownValue &&
                        styles.selectedPriorityContainerError,
                      dropDownIsDisabled &&
                        styles.selectedPriorityContainerDisabled,
                    ]}
                    dropDownContainerStyle={styles.dropdownContainer}
                    renderListItem={({ item }) => (
                      <Pressable
                        onPress={() => {
                          if (!item.disabled) {
                            setDropdownSelectedValue(item.value);
                            setDropdownOpen(false);
                          }
                        }}
                        disabled={item.disabled}
                        style={[
                          styles.listItemContainer,
                          item.disabled && {
                            backgroundColor: Color.color_grey10,
                          },
                        ]}
                      >
                        <View>
                          <Text
                            style={[
                              styles.listItemLabel,
                              item.disabled && styles.disabledText,
                            ]}
                          >
                            {item.label}
                          </Text>
                          <Text
                            style={[
                              styles.listItemDescription,
                              item.disabled && styles.disabledText,
                            ]}
                          >
                            Priority {item.value}
                          </Text>
                        </View>
                      </Pressable>
                    )}
                    items={dropdownData}
                    open={dropdownOpen}
                    value={dropdownSelectedValue}
                    setOpen={setDropdownOpen}
                    setValue={setDropdownSelectedValue}
                    onOpen={() => resetError("dropdownValue")}
                  />
                </View>
              </View>

              <View>
                <Text style={styles.commentTitle}>Comment</Text>
                <BottomSheetTextInput
                  onChangeText={setComment}
                  defaultValue={comment}
                  style={styles.commentInput}
                  multiline
                  numberOfLines={4}
                  placeholder="Please write down any data that we overlooked or miscalculated."
                  scrollEnabled
                  maxLength={4096}
                />
              </View>

              <Button onPress={confirmApplicationHandler} title="Apply Now" />
            </View>
          </BottomSheetScrollView>

          {/* <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <Pressable style={styles.backdrop} onPress={errorModalClose}>
              <View style={styles.modalView}>
                <AntDesign
                  name="closecircle"
                  size={36}
                  color={Color.color_red50}
                />
                <Text style={styles.errorModalText}>
                  You have already submitted an application for this project.
                  You are not allowed to apply more than once.
                </Text>

                <Button
                  title="Close"
                  onPress={errorModalClose}
                  containerStyle={styles.errorCloseBtn}
                />
              </View>
            </Pressable>
          </Modal> */}
        </CustomModal>
      )}
    </>
  );
};

export default ConfirmModal;

const styles = StyleSheet.create({
  modalContainer: {
    gap: 16,
  },
  selectedPriorityContainer: {
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Color.borderColor,
  },
  selectedPriorityContainerDisabled: {
    backgroundColor: Color.color_grey10,
  },
  selectedPriorityContainerError: {
    borderColor: Color.color_red50,
  },
  listItemContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  listItemLabel: {
    fontFamily: "Inter",
    fontSize: 16,
    color: Color.color_grey90,
  },
  listItemDescription: {
    fontFamily: "Inter",
    fontSize: 12,
    color: Color.color_grey70,
  },
  dropdownContainer: {
    borderColor: Color.borderColor,
  },
  disabledText: {
    color: Color.color_grey60,
  },
  datesContainer: {
    flexDirection: "row",
    gap: 16,
  },
  datePickerContainer: {
    flex: 1,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: Color.borderColor,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    textAlignVertical: "top",
    height: 80,
    marginTop: 6,
  },
  commentTitle: {
    fontFamily: "Inter_500",
    fontSize: 14,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  important: {
    fontFamily: "Inter_700",
    color: Color.color_red50,
  },
  disclaimerContent: {
    fontFamily: "Inter",
    fontSize: 14,
    lineHeight: 20,
    color: Color.color_grey90,
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
    color: Color.color_yellow50,
    fontFamily: "Inter_700",
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 2.4,
  },

  modalTitle: {
    color: Color.color_grey70,
    fontSize: 12,
  },
  modalProjectName: {
    color: Color.color_grey90,
    fontFamily: "Inter_600",
    fontSize: 16,
  },
  selectContainer: {
    gap: 8,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 35,
    alignItems: "center",
    gap: 24,
  },
  errorModalText: {
    fontFamily: "Inter_500",
    fontSize: 18,
    textAlign: "center",
    lineHeight: 24,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10,
  },
  errorCloseBtn: {
    width: "100%",
  },
});
