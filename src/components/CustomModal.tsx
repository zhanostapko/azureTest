import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import React, {
  useCallback,
  useMemo,
  useRef,
  forwardRef,
  Ref,
  useImperativeHandle,
  useEffect,
  useState,
  useLayoutEffect,
} from "react";
import { Color } from "../styles/GlobalStyles";

import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
  contentHeight: number | null;
};

const CustomModal = (
  { children, style, contentHeight }: Props,
  ref: Ref<any>
) => {
  const [snapPoints, setSnapPoints] = useState<(string | number)[]>([
    "25%",
    "50%",
    "50%",
  ]);

  useEffect(() => {
    if (contentHeight !== null) {
      setSnapPoints(() => ["25%", "50%", contentHeight + 100]);
      bottomSheetModalRef.current?.present();
    }
  }, [contentHeight]);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  useImperativeHandle(ref, () => ({
    open: () => {
      bottomSheetModalRef.current?.present();
    },
  }));

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  return (
    <BottomSheetModal
      enableDynamicSizing
      keyboardBehavior="interactive"
      android_keyboardInputMode="adjustResize"
      keyboardBlurBehavior="restore"
      style={[styles.container, style]}
      handleIndicatorStyle={{
        backgroundColor: Color.color_grey50,

        width: 48,
      }}
      index={1}
      contentHeight={contentHeight || 0}
      ref={bottomSheetModalRef}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      backdropComponent={() => (
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: Color.color_blue10,
            opacity: 0.8,
          }}
        />
      )}
    >
      {children}
    </BottomSheetModal>
  );
};

export default forwardRef(CustomModal);

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
