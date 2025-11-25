import { ScrollView, StyleSheet, Text, View } from "react-native";
import { ChatBoxText } from "../components/chat-box-text/chat-box-text";
import { DrinkView } from "../components/drink-view/drink-view";
import InputBoxWithSuggestions from "../components/input-box-with-suggestions";

export default function TabOneScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>Input Box With Suggestions</Text>
        <InputBoxWithSuggestions />
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Chat Messages</Text>
        <ChatBoxText message="Witaj! W czym mogę pomóc?"/>
        <ChatBoxText message="Chciałbym drink z wódką i miętą"/>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Drink Card</Text>
        <DrinkView 
          name="Mojito"
          image={require('../../assets/images/drink.png')}
          ingredients={['Wódka', 'Mięta', 'Limonka', 'Cukier', 'Woda gazowana']}
          description="Klasyczny drink na bazie wódki, świeżej mięty i limonki. Idealny na letnie wieczory."
          isSelected={true}
          isFavorite={false}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#794848ff',
  },
  section: {
    padding: 24,
    gap: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
});