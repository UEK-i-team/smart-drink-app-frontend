import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Background from "../components/main-background/Background";
import {
    DEFAULT_SELECTED_FLAVOR,
    DEFAULT_SELECTED_POWER
} from "../constants/drink-options-data";

export default function DrinkOptionsScreen() {
  const insets = useSafeAreaInsets();
  const [selectedOptions, setSelectedOptions] = useState({
    drinkOptions: [],
    power: DEFAULT_SELECTED_POWER,
    flavorProfile: DEFAULT_SELECTED_FLAVOR,
  });

  const handleSelectionChange = (selectedOptions: any) => {
    setSelectedOptions(selectedOptions);
    console.log("Selected options:", selectedOptions);
  };

  const handleConfirm = () => {
    console.log("Confirmed selection:", selectedOptions);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <Background />
      {/* <DrinkOptions
        sections={DEFAULT_DRINK_SECTIONS}
        powerLevels={DEFAULT_POWER_LEVELS}
        flavorProfiles={DEFAULT_FLAVOR_PROFILES}
        selectedPower={DEFAULT_SELECTED_POWER}
        selectedFlavorProfile={DEFAULT_SELECTED_FLAVOR}
        onSelectionChange={handleSelectionChange}
        onConfirm={handleConfirm}
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
});
