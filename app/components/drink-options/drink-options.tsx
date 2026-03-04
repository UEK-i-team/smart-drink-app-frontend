import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal
} from "react-native";
import {
  DEFAULT_DRINK_SECTIONS,
  DEFAULT_FLAVOR_PROFILES,
  DEFAULT_FLAVOR_PROFILES_LABELS,
  DEFAULT_POWER_LEVELS,
  DEFAULT_POWER_LEVELS_LABELS,
  DEFAULT_SELECTED_FLAVOR,
  DEFAULT_SELECTED_POWER,
} from "../../constants/drink-options-data";
import { loadRecentOptions, loadSelectedOptions, saveRecentOptions, saveSelectedOptions } from "../../utils/drink-storage";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export interface DrinkOptionItem {
  id: string;
  label: string;
  isSelected?: boolean;
}

export interface DrinkOptionSection {
  id: string;
  title: string;
  icon: string;
  items: DrinkOptionItem[];
  isExpanded?: boolean;
}

export interface DrinkOptionsProps {
  data?: {
    power: string;
    flavorProfile: string;
  };
  sections?: DrinkOptionSection[];
  powerLevels?: string[];
  powerLevelsLabels?: string[];
  flavorProfiles?: string[];
  flavorProfilesLabels?: string[];
  selectedPower?: string;
  selectedFlavorProfile?: string;
  onConfirm?: (data: { power: string; flavorProfile: string }) => void;
  onClose?: () => void;
  onSelectionChange?: (selectedItems: {
    drinkOptions: string[];
    power: string;
    flavorProfile: string;
  }) => void;
}

export const DrinkOptions: React.FC<DrinkOptionsProps> = ({
  sections = DEFAULT_DRINK_SECTIONS,
  powerLevels = DEFAULT_POWER_LEVELS,
  powerLevelsLabels = DEFAULT_POWER_LEVELS_LABELS,
  flavorProfiles = DEFAULT_FLAVOR_PROFILES,
  flavorProfilesLabels = DEFAULT_FLAVOR_PROFILES_LABELS,
  selectedPower = DEFAULT_SELECTED_POWER,
  selectedFlavorProfile = DEFAULT_SELECTED_FLAVOR,
  onConfirm,
  onClose,
  onSelectionChange,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [sectionsState, setSectionsState] = useState<DrinkOptionSection[]>(sections);
  const [selectedPowerState, setSelectedPowerState] = useState(selectedPower);
  const [selectedFlavorState, setSelectedFlavorState] = useState(
    selectedFlavorProfile
  );
  const [flavorExpanded, setFlavorExpanded] = useState(false);

  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    Promise.all([loadRecentOptions(), loadSelectedOptions()]).then(
      ([recentLabels, savedSelection]) => {
        setSectionsState((prev) =>
          prev.map((section) => {
            // Restore selected state across all sections
            const withSelection = section.items.map((item) => ({
              ...item,
              isSelected: savedSelection?.labels.includes(item.label) ?? false,
            }));

            if (section.id === "recent" && recentLabels.length > 0) {
              return {
                ...section,
                items: recentLabels.map((label, i) => ({
                  id: `recent-${i}`,
                  label,
                  isSelected: savedSelection?.labels.includes(label) ?? false,
                })),
              };
            }

            return { ...section, items: withSelection };
          })
        );

        if (savedSelection) {
          setSelectedPowerState(savedSelection.power);
          setSelectedFlavorState(savedSelection.flavorProfile);
        }
      }
    );
  }, [opacity]);

  const swipeFade = translateY.interpolate({
    inputRange: [0, SCREEN_HEIGHT * 0.4],
    outputRange: [1, 0.3],
    extrapolate: "clamp",
  });

  const combinedOpacity = Animated.multiply(opacity, swipeFade);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        gestureState.dy > 10 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx),
      onPanResponderMove: (_, gestureState) => {
        // Only follow finger downward; clamp upward drags at 0
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 120 || gestureState.vy > 0.8) {
          // Slide off screen then close
          Animated.timing(translateY, {
            toValue: SCREEN_HEIGHT,
            duration: 250,
            useNativeDriver: true,
          }).start(() => {
            translateY.setValue(0);
            saveSelectedOptions(getSelectedOptions(), selectedPowerState, selectedFlavorState);
            onClose?.();
          });
        } else {
          // Spring back to resting position
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 6,
          }).start();
        }
      },
      onPanResponderTerminate: () => {
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          bounciness: 6,
        }).start();
      },
    })
  ).current;

  const handleSectionToggle = (sectionId: string) => {
    setSectionsState((prevSections) =>
      prevSections.map((section) =>
        section.id === sectionId
          ? { ...section, isExpanded: !section.isExpanded }
          : section
      )
    );
  };

  const handleOptionSelect = (sectionId: string, itemId: string) => {
    setSectionsState((prevSections) => {
      // Find the item being toggled and get its label
      let toggledItemLabel = "";
      let isNowSelected = false;
      
      prevSections.forEach((section) => {
        if (section.id === sectionId) {
          section.items.forEach((item) => {
            if (item.id === itemId) {
              toggledItemLabel = item.label;
              isNowSelected = !item.isSelected;
            }
          });
        }
      });

      // Update the clicked section first
      const updatedSections = prevSections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            items: section.items.map((item) =>
              item.id === itemId
                ? { ...item, isSelected: isNowSelected }
                : item
            ),
          };
        }
        return section;
      });

      // Sync to other sections: find items with same label and update them
      const finalSections = updatedSections.map((section) => {
        if (section.id !== sectionId && toggledItemLabel) {
          return {
            ...section,
            items: section.items.map((item) =>
              item.label === toggledItemLabel
                ? { ...item, isSelected: isNowSelected }
                : item
            ),
          };
        }
        return section;
      });

      return finalSections;
    });
  };

  const handleRemoveOption = (itemLabel: string) => {
    setSectionsState((prevSections) =>
      prevSections.map((section) => ({
        ...section,
        items: section.items.map((item) =>
          item.label === itemLabel
            ? { ...item, isSelected: false }
            : item
        ),
      }))
    );
  };

  const getSelectedOptions = () => {
    const selectedSet = new Set<string>();
    sectionsState.forEach((section) => {
      section.items.forEach((item) => {
        if (item.isSelected) {
          selectedSet.add(item.label);
        }
      });
    });
    return Array.from(selectedSet);
  };

  const handleConfirm = () => {
    const selected = getSelectedOptions();
    saveSelectedOptions(selected, selectedPowerState, selectedFlavorState);
    Animated.timing(opacity, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }).start(() => {
      if (selected.length > 0) {
        loadRecentOptions().then((existing) =>
          saveRecentOptions(selected, existing)
        );
      }
      if (onSelectionChange) {
        onSelectionChange({
          drinkOptions: selected,
          power: selectedPowerState,
          flavorProfile: selectedFlavorState,
        });
      }
      if (onConfirm) {
        const filterData = {
          power: selectedPowerState,
          flavorProfile: selectedFlavorState,
        };
        onConfirm(filterData);
      }
      if (onClose) {
        onClose();
      }
    });
  };

  const filteredSections = sectionsState.map((section) => ({
    ...section,
    items: section.items.filter((item) =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  }));

  return (
    <Modal animationType="none" transparent>
      <Animated.View style={[styles.container, { opacity: combinedOpacity, transform: [{ translateY }] }]}>
        {/* Drag handle – swipe down to close */}
        <View style={styles.dragHandleContainer} {...panResponder.panHandlers}>
          <View style={styles.dragHandleBar} />
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#333" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Wyszukaj składnik/alkohol"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setIsSearchFocused(true)}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        {/* Show filtered results when search is focused */}
        {isSearchFocused && searchQuery.length > 0 && (
          <ScrollView
            style={styles.searchResultsContainer}
            contentContainerStyle={styles.searchResultsContent}
            scrollEnabled={true}
          >
            {sectionsState
              .filter((section) => section.id !== "recent")
              .flatMap((section) =>
                section.items
                  .filter((item) =>
                    item.label.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((item) => (
                    <TouchableOpacity
                      key={`${section.id}-${item.id}`}
                      style={styles.searchResultItem}
                      onPress={() => {
                        handleOptionSelect(section.id, item.id);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.searchResultText}>{item.label}</Text>
                      <View
                        style={[
                          styles.checkbox,
                          item.isSelected && styles.checkboxSelected,
                        ]}
                      >
                        {item.isSelected && (
                          <Ionicons
                            name="checkmark"
                            size={16}
                            color="#FF6B35"
                          />
                        )}
                      </View>
                    </TouchableOpacity>
                  ))
              )}
          </ScrollView>
        )}

        {/* Scrollable Sections - Hidden when search focused and text entered */}
        {!(isSearchFocused && searchQuery.length > 0) && (
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          scrollIndicatorInsets={{ right: 1 }}
        >
          {filteredSections.filter((section) => !(section.id === "recent" && section.items.length === 0)).map((section) => (
            <View key={section.id} style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.headerLeft}>
                  <Ionicons
                    name={section.icon as any}
                    size={20}
                    color="#333"
                    style={styles.headerIcon}
                  />
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                </View>
                <TouchableOpacity
                  style={styles.expandButton}
                  onPress={() => handleSectionToggle(section.id)}
                >
                  <Text style={styles.expandButtonText}>
                    {section.isExpanded ? "Zwiń" : "Rozwiń"}
                  </Text>
                </TouchableOpacity>
              </View>

              {section.isExpanded && section.items.length > 0 && (
                <View style={styles.itemsContainer}>
                  {section.items.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.item}
                      onPress={() => handleOptionSelect(section.id, item.id)}
                    >
                      <Text style={styles.itemText}>{item.label}</Text>
                      <View
                        style={[
                          styles.radioButton,
                          item.isSelected && styles.radioButtonSelected,
                        ]}
                      >
                        {item.isSelected && (
                          <View style={styles.radioButtonInner} />
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          ))}

          {/* Selected Options Section - Always visible */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.headerLeft}>
                <Ionicons
                  name="checkmark-done-outline"
                  size={20}
                  color="#333"
                  style={styles.headerIcon}
                />
                <Text style={styles.sectionTitle}>Wybrane</Text>
              </View>
            </View>

            {getSelectedOptions().length > 0 ? (
              <View style={styles.selectedTagsContainer}>
                {getSelectedOptions().map((option, index) => (
                  <View key={index} style={styles.selectedTag}>
                    <Text style={styles.selectedTagText}>{option}</Text>
                    <TouchableOpacity
                      onPress={() => handleRemoveOption(option)}
                      style={styles.removeButton}
                    >
                      <Ionicons name="close" size={16} color="#FF6B35" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.emptyStateContainer}>
                <Text style={styles.emptyStateText}>Brak wybranych składników</Text>
              </View>
            )}
          </View>
        </ScrollView>
        )}

        {/* Fixed Bottom Sections - Hidden when search focused and text entered */}
        {!(isSearchFocused && searchQuery.length > 0) && (
        <View style={styles.fixedBottom}>
          {/* Power Section */}
          <View style={styles.fixedSection}>
            <View style={styles.fixedSectionHeader}>
              <View style={styles.headerLeft}>
                <Ionicons
                  name="flash-outline"
                  size={20}
                  color="#333"
                  style={styles.headerIcon}
                />
                <Text style={styles.sectionTitle}>Moc</Text>
              </View>
            </View>

            <View style={styles.powerButtonsContainer}>
              {powerLevels.map((level, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.powerButton,
                    selectedPowerState === level && styles.powerButtonSelected,
                  ]}
                  onPress={() => setSelectedPowerState(level)}
                >
                  <Text
                    style={[
                      styles.powerButtonText,
                      selectedPowerState === level &&
                        styles.powerButtonTextSelected,
                    ]}
                  >
                    {powerLevelsLabels?.[index] || level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Flavor Profile Section */}
          <View style={styles.fixedSection}>
            <View style={styles.fixedSectionHeader}>
              <View style={styles.headerLeft}>
                <Ionicons
                  name="flame-outline"
                  size={20}
                  color="#333"
                  style={styles.headerIcon}
                />
                <Text style={styles.sectionTitle}>Profil smaku</Text>
              </View>
              <TouchableOpacity
                style={styles.expandButton}
                onPress={() => setFlavorExpanded(!flavorExpanded)}
              >
                <Text style={styles.expandButtonText}>
                  {flavorExpanded ? "Zwiń" : "Rozwiń"}
                </Text>
              </TouchableOpacity>
            </View>

            {flavorExpanded && (
              <View style={styles.itemsContainer}>
                {flavorProfiles.map((profile, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.item}
                    onPress={() => {
                      setSelectedFlavorState(profile);
                    }}
                  >
                    <Text
                      style={[
                        styles.itemText,
                        selectedFlavorState === profile && styles.selectedItemText,
                      ]}
                    >
                      {flavorProfilesLabels?.[index] || profile}
                    </Text>
                    <View
                      style={[
                        styles.radioButton,
                        selectedFlavorState === profile &&
                          styles.radioButtonSelected,
                      ]}
                    >
                      {selectedFlavorState === profile && (
                        <View style={styles.radioButtonInner} />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Confirm Button */}
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirm}
          >
            <Text style={styles.confirmButtonText}>Zatwierdź</Text>
          </TouchableOpacity>
        </View>
        )}
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  dragHandleContainer: {
    alignItems: "center",
    paddingVertical: 12,
    backgroundColor: "#f5f5f5",
  },
  dragHandleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#ccc",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 14,
    color: "#333",
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  searchResultsContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  searchResultsContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchResultItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 8,
  },
  searchResultText: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  selectedTagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  selectedTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FF6B35",
    gap: 8,
  },
  selectedTagText: {
    fontSize: 13,
    color: "#333",
    fontWeight: "500",
  },
  removeButton: {
    padding: 4,
  },
  emptyStateContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 14,
    color: "#333",
    fontStyle: "italic",
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  section: {
    marginBottom: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  fixedSection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    overflow: "hidden",
  },
  fixedSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerIcon: {
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  expandButton: {
    backgroundColor: "#FF6B35",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  expandButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  powerButtonsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    justifyContent: "space-between",
  },
  powerButton: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#f8f8f8",
  },
  powerButtonSelected: {
    backgroundColor: "#FF6B35",
  },
  powerButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
  },
  powerButtonTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },
  itemsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
  },
  itemText: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  selectedItemText: {
    color: "#FF6B35",
    fontWeight: "600",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelected: {
    borderColor: "#FF6B35",
    backgroundColor: "#fff",
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonSelected: {
    borderColor: "#FF6B35",
  },
  radioButtonInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF6B35",
  },
  fixedBottom: {
    paddingBottom: 16,
    paddingTop: 8,
  },
  confirmButton: {
    marginHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#FF6B35",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
