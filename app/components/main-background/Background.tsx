import { StyleSheet, View } from 'react-native';
import FlaskAndGlassSVG from "../../../assets/svgs/flask-and-glass-svg";

const Background = () => {
  return (
    <View
      style={[styles.mainContainer, StyleSheet.absoluteFill]}
      pointerEvents="none"
    >
      <FlaskAndGlassSVG />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'rgba(235, 231, 230, 1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    position: 'absolute',
    width: 200,
    height: 200,
  },
});

export default Background;