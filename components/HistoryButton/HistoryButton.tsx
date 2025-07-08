import { StyleSheet, View } from 'react-native';
import HistoryButtonSvg from './HistoryButtonSvg';

const HistoryButton = () => {
  return (
    <View style={styles.mainContainer}>
      <HistoryButtonSvg />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: 'rgba(17, 17, 17, 1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default HistoryButton;
