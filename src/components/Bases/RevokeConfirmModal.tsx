import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../Button";
import { Color } from "../../styles/GlobalStyles";
import WarningImage from "../../../assets/custom_icons/warningRevoke.svg";
import { BiddingItemType } from "./Applications";
import useApi from "../../hooks/useApi";
import Loader from "../Loader";
import { TextInput } from "react-native-gesture-handler";
import { stripHtmlTags } from "../../other/helpers";

type Props = {
  modalVisible: boolean;
  onClose: () => void;
  bid: BiddingItemType | null;
  refetchBids: () => Promise<void>;
};

const RevokeConfirmModal = ({
  modalVisible,
  onClose,
  bid,
  refetchBids,
}: Props) => {
  const { apiRequest, isLoading } = useApi();
  const [comment, setComment] = useState("");

  const revokeHandler = async () => {
    const strippedComment = stripHtmlTags(comment);
    const requestBody = {
      ...bid,
      status: "Revoked",
      comment: strippedComment,
    };
    const res = await apiRequest("api/Bidding", "POST", requestBody);
    if (!res.ok) {
      console.log("Not ok");
    }
    refetchBids();
    onClose();
  };

  return (
    <Modal visible={modalVisible} onRequestClose={onClose} animationType="fade">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        enabled
      >
        <View style={styles.screenContainer}>
          {isLoading && <Loader />}
          {!isLoading && (
            <>
              <View style={styles.content}>
                <WarningImage />
                <Text style={styles.confirmTitle}>Please Confirm</Text>
                <Text style={styles.confirmText}>
                  Do you really want to cancel your application for the base{" "}
                  <Text style={styles.projectTitle}>{bid?.projectName}</Text>?
                </Text>
              </View>
              <View>
                <Text style={styles.commentTitle}>Comment</Text>
                <TextInput
                  value={comment}
                  onChangeText={setComment}
                  style={styles.commentInput}
                  multiline
                  numberOfLines={4}
                  placeholder="Please write down the reason for revoking your application."
                  scrollEnabled
                  maxLength={4096}
                />
              </View>
              <View style={styles.actions}>
                <Button title="Confirm" onPress={revokeHandler} />
                <Button
                  style={styles.cancelButton}
                  textStyle={styles.cancelText}
                  title="Cancel"
                  onPress={onClose}
                />
              </View>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default RevokeConfirmModal;

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    padding: 24,
    gap: 20,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  actions: {
    gap: 16,
  },
  cancelButton: {
    backgroundColor: Color.backgroundWhite,
  },
  cancelText: {
    color: Color.color_grey90,
  },
  confirmTitle: { fontSize: 28, fontFamily: "Lato", color: Color.color_grey90 },
  confirmText: {
    fontSize: 12,
    fontFamily: "Lato",
    color: Color.color_grey60,
    textAlign: "center",
    lineHeight: 16,
  },
  projectTitle: { fontWeight: "700", fontFamily: "Lato" },
  commentInput: {
    borderWidth: 1,
    borderColor: Color.borderColor,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    textAlignVertical: "top",
    height: 120,
    marginTop: 6,
  },
  commentTitle: {
    fontFamily: "Inter_500",
    fontSize: 14,
  },
});
