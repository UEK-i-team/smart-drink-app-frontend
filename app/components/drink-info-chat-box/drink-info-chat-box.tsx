import React from "react";
import { StyleSheet, Text, View } from "react-native";

export interface DrinkInfoChatBoxProps {
  text?: string;
}

export const DrinkInfoChatBox: React.FC<DrinkInfoChatBoxProps> = ({
  text = "Oto kilka propozycji, które dla Ciebie znalazłem. Mam nadzieję, że trafią w Twój gust!",
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#2B2B2B",
    borderRadius: 26,
    padding: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text: {
    fontWeight: "200",
    color: "#EBEBEB",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
});

export default DrinkInfoChatBox;
