import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, radii } from '../../constants/theme';

export interface RecommendDrinkViewProps {
  onPress?: () => void;
}

export const RecommendDrinkView: React.FC<RecommendDrinkViewProps> = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <LinearGradient
        colors={['#F0F0F0', '#F0F0F0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <View style={styles.contentContainer}>
          <View style={styles.centeredContent}>
            <Text style={styles.title}>Zaproponuj więcej podobnych</Text>
            <View style={styles.iconContainer}>
              <Ionicons name="add-outline" size={24} color={colors.white} />
            </View>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    overflow: 'hidden',
    marginHorizontal: 16,
    marginVertical: 8,
  },
  contentContainer: {
    borderRadius: radii.xl,
    borderColor: colors.black,
    borderWidth: 1,
    flex: 1,
    padding: 16,
    paddingLeft: 8,
    height: 245,
    width: '100%',
  },
  centeredContent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 32,
    color: colors.black,
    textAlign: 'center',
    fontWeight: '200',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
