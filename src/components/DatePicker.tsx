import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  Modal,
  Platform,
} from "react-native";
import React, { useState } from "react";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Color } from "../styles/GlobalStyles";
import { Entypo } from "@expo/vector-icons";
import Button from "./Button";
import { format } from "date-fns";

type Props = {
  pickerTitle?: string;
  containerStyles?: ViewStyle;
  onSave: (date: string) => void;
  selectedDate: string;
  error?: boolean;
  onFocus?: () => void;
  minDate?: string;
  maxDate?: string;
  disabled?: boolean;
};

const DatePicker = ({
  pickerTitle,
  containerStyles,
  onSave,
  selectedDate,
  error,
  onFocus,
  minDate,
  maxDate,
  disabled,
}: Props) => {
  const [showPicker, setShowPicker] = useState(false);
  const [date, setDate] = useState<Date>(new Date());

  const showPickerHandler = () => {
    onFocus && onFocus();
    setShowPicker(true);
  };

  const onChange = async (event: DateTimePickerEvent, dateArg?: Date) => {
    if (event.type === "set" && dateArg) {
      if (Platform.OS === "android") {
        await onSave(dateArg.toDateString());
        hidePickerHandler();
      }
      setDate(dateArg);
    } else {
      hidePickerHandler();
    }
  };

  const confirmIOSDatePicker = async () => {
    onSave(date.toDateString());
    hidePickerHandler();
  };

  const hidePickerHandler = () => {
    setShowPicker(false);
  };
  return (
    <View style={[styles.container, containerStyles]}>
      <Text style={styles.pickerTitleStyle}>{pickerTitle}</Text>
      <Pressable
        style={[
          styles.selectedDateContainer,
          error && styles.selectedDateContainerError,
          disabled && styles.selectedDateContainerDisabled,
        ]}
        onPress={showPickerHandler}
        disabled={disabled}
      >
        <Text style={styles.dateStyles}>
          {(selectedDate && format(new Date(selectedDate), "MMM dd, yyyy")) ||
            "Select date"}
        </Text>
        <Entypo name="calendar" size={16} color={Color.color_grey60} />
      </Pressable>
      {showPicker && (
        <>
          {Platform.OS === "ios" ? (
            <Modal transparent={true} animationType="slide">
              <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                  <DateTimePicker
                    value={date || new Date()}
                    mode="date"
                    display="spinner"
                    onChange={onChange}
                    maximumDate={maxDate ? new Date(maxDate) : undefined}
                    minimumDate={minDate ? new Date(minDate) : undefined}
                  />
                  <View style={styles.iosActionsContainer}>
                    <Button
                      containerStyle={{ flex: 1 }}
                      style={styles.cancelButton}
                      textStyle={styles.cancelButtonText}
                      title="Close"
                      onPress={hidePickerHandler}
                    />
                    <Button
                      containerStyle={{ flex: 1 }}
                      title="Confirm"
                      onPress={confirmIOSDatePicker}
                    />
                  </View>
                </View>
              </View>
            </Modal>
          ) : (
            <DateTimePicker
              value={date}
              mode="date"
              display="spinner"
              onChange={onChange}
              
              maximumDate={maxDate ? new Date(maxDate) : undefined}
              minimumDate={minDate ? new Date(minDate) : undefined}
            />
          )}
        </>

        // <View >
        //   <View style={{ backgroundColor: "blue" }}>
        //     <DateTimePicker display="spinner" value={new Date()} />
        //   </View>
        // </View>
      )}
    </View>
  );
};

export default DatePicker;

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  selectedDateContainer: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Color.borderColor,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedDateContainerError: {
    borderColor: Color.color_red50,
  },
  selectedDateContainerDisabled: {
    backgroundColor: Color.color_grey10,
  },
  pickerTitleStyle: {
    fontFamily: "Inter_500",
    fontSize: 14,
  },
  dateStyles: {
    fontFamily: "Inter",
    fontSize: 14,
    color: Color.color_grey70,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  iosActionsContainer: {
    flexDirection: "row",
    gap: 8,
  },
  cancelButton: {
    backgroundColor: Color.backgroundWhite,
    borderWidth: 1,
    borderColor: Color.borderColor,
  },
  cancelButtonText: {
    color: Color.color_blue50,
  },
});
