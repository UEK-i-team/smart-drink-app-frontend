import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { DrinkView } from "../components/drink-view/drink-view";

export default function Index() {
  const [isFavorite, setIsFavorite] = useState(false);
  const [fetchedData, setFetchedData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://172.20.10.3:3000/")
      .then((response) => response.json())
      .then((data) => {
        console.log('FETCHED DATA:', data);
        setFetchedData(data);
        setError(null);
      })
      .catch((error) => {
        console.error("FETCHING ERROR:", error);
        setError(error.message || "Failed to fetch data");
        setFetchedData(null);
      });
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {error && (
          <View style={styles.messageContainer}>
            <Text style={styles.errorText}>Error: {error}</Text>
          </View>
        )}
        
        {fetchedData && (
          <View style={styles.messageContainer}>
            <Text style={styles.successText}>Data received:</Text>
            <Text style={styles.dataText}>{JSON.stringify(fetchedData, null, 2)}</Text>
          </View>
        )}

        <DrinkView
          name="Sazerac"
          image={require("@/assets/images/drink.png")} // generowany img
          ingredients={[
            "Whiskey",
            "Absynt",
            "Gorzki angostura",
            "Bardzo mocne",
          ]}
          description="Klasyczny koktajl z Nowego Orleanu. Sazerac to mocny, wyrafinowany eliksir na bazie żytniei whiskey z absyntem, nutą i aromatem cytrusów."
          isSelected={true}
          isFavorite={isFavorite}
          onFavoritePress={() => setIsFavorite(!isFavorite)}
          onPress={() => console.log("Drink card pressed")}
        />
      </ScrollView>
    </View>
  );
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
  messageContainer: {
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: "#2a2a2a",
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 16,
    fontWeight: "bold",
  },
  successText: {
    color: "#51cf66",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  dataText: {
    color: "#e0e0e0",
    fontSize: 14,
    fontFamily: "monospace",
  },
});
