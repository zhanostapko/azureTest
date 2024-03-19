import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import Button from "../Button";
import { Color } from "../../styles/GlobalStyles";

type Props = {
  values: string[];
  onSelect: (index: number) => void;
};

const FilterBar = ({ values, onSelect }: Props) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filterValueHandler = (index: number) => {
    setSelectedIndex(index);
    onSelect(index);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filterContainer}
    >
      {values.map((value, index) => (
        <Button
          textStyle={styles.text}
          style={[
            styles.buttonContainer,
            index === selectedIndex && styles.selected,
          ]}
          onPress={() => filterValueHandler(index)}
          title={value}
          key={index}
        />
      ))}
    </ScrollView>
  );
};

export default FilterBar;

const styles = StyleSheet.create({
  buttonContainer: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: "white",
    borderRadius: 4,
    borderColor: Color.color_grey20,
    borderWidth: 1,
  },
  selected: {
    backgroundColor: Color.color_blue10,
  },
  text: { fontSize: 16, color: Color.color_grey90 },
  filterContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 8,
    paddingBottom: 24,
  },
});
