import { StyleSheet, Text, View } from 'react-native';

const SuggestionBox = ({ sugestionBoxText }: { sugestionBoxText: string }) => {
  return (
    <View style={styles.mainContainer}>
      <Text style={styles.textColor}>{sugestionBoxText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    width: 188,
    height: 83,
    borderRadius: 20,
    backgroundColor: 'rgba(250, 249, 249, 1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textColor: {
    color: 'rgba(83, 83, 83, 1)',
    textAlign: 'center',
    fontSize: 14,
  },
});
export default SuggestionBox;
