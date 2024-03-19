import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  GestureResponderEvent,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
} from "react-native";
import ShadowWrapper from "../ShadowWrapper";
import { Color } from "../../styles/GlobalStyles";
import { MaterialIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  handleSearch: (text: string) => void;
  searchValue?: string;
};

const MyTextInput = ({ handleSearch, searchValue }: Props) => {
  const [isFocused, setIsFocused] = useState(false);
  const [text, setText] = useState(searchValue || "");
  const inputRef = useRef<TextInput>(null);

  const handleFocus = () => {
    setIsFocused(true);
    inputRef?.current?.focus();
  };

  const searchHandler = () => {
    handleSearch(text);
  };

  const clearSearch = () => {
    setText("");
    if (searchValue) {
      handleSearch("");
    }
    inputRef.current?.blur();
  };

  return (
    <View style={styles.listHeader}>
      <ShadowWrapper containerStyle={styles.inputContainer}>
        <MaterialIcons
          name="search"
          size={24}
          color={Color.color_grey70}
          onPress={searchHandler}
        />
        <TextInput
          ref={inputRef}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChangeText={(text) => setText(text)}
          value={text}
          style={styles.input}
          onSubmitEditing={searchHandler}
        />

        {!searchValue && (
          <Pressable onPress={handleFocus} style={styles.placeholderContainer}>
            <View style={styles.searchRight}>
              {!isFocused && text === "" && (
                <View>
                  <Text style={styles.mainPlaceholder}>Find Base?</Text>
                  <Text style={styles.placeholderInfo}>
                    Region | Country | Airport
                  </Text>
                </View>
              )}
            </View>
          </Pressable>
        )}
        {/* Search settings for future */}
        {/* <View style={styles.optionContainer}>
          <Ionicons
            name="md-options-outline"
            size={16}
            color={Color.color_grey50}
          />
        </View> */}
        <Pressable
          style={({ pressed }) => ({
            opacity: pressed ? 0.5 : 1,
            transform: pressed ? [{ scale: 0.9 }] : [{ scale: 1 }],
          })}
          onPress={clearSearch}
        >
          <Entypo name="cross" size={20} color={Color.color_grey70} />
        </Pressable>
      </ShadowWrapper>
    </View>
  );
};

export default MyTextInput;

const styles = StyleSheet.create({
  listHeader: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    position: "relative",
  },
  placeholderContainer: {
    position: "absolute",
    left: 40,
    top: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  inputContainer: {
    paddingVertical: 8,
    borderRadius: 48,
    flexDirection: "row",
    // justifyContent: "center",
    alignItems: "center",
    paddingLeft: 10,
    textAlign: "center",
  },
  input: {
    width: "90%",
    paddingLeft: 10,
  },
  mainPlaceholder: {
    fontSize: 14,
    fontFamily: "Inter_500",
  },
  placeholderInfo: {
    fontSize: 12,
    fontFamily: "Inter",
    color: Color.color_grey50,
  },
  searchRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionContainer: {
    borderWidth: 1,
    borderColor: Color.color_grey50,
    borderRadius: 16,
    padding: 4,
  },
});
