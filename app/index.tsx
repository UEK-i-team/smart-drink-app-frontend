import { useState } from "react";
import { StyleSheet, View } from "react-native";

export default function Index() {
  const [isFavorite, setIsFavorite] = useState(false);

  return <View style={styles.container}></View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  scrollView: {
    flex: 1,
    paddingTop: 60,
  },
  content: {
    paddingBottom: 20,
  },
});
