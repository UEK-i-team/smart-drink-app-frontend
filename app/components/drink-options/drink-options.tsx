import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal
} from "react-native";

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
  flavorProfiles?: string[];
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
  sections = [
    {
      id: "recent",
      title: "Ostatnie",
      icon: "time-outline",
      items: [],
      isExpanded: false,
    },
    {
      id: "alcohol",
      title: "Alkohol",
      icon: "wine-outline",
      items: [],
      isExpanded: false,
    },
    {
      id: "additives",
      title: "Dodatki",
      icon: "add-circle-outline",
      items: [],
      isExpanded: false,
    },
  ],
  powerLevels = ["Słabe", "Średnie", "Mocne"],
  flavorProfiles = ["Słodki", "Wytrawny", "Pikantny", "Półsłodki"],
  selectedPower = "Średnie",
  selectedFlavorProfile = "Słodki",
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
    if (onSelectionChange) {
      onSelectionChange({
        drinkOptions: getSelectedOptions(),
        power: selectedPowerState,
        flavorProfile: selectedFlavorState,
      });
    }
    if (onConfirm) {
      const filterData = {
        power: selectedPowerState,
        flavorProfile: selectedFlavorState,
      }
      onConfirm(filterData);
    }
    if (onClose) {
      onClose();
    }
  };

  const filteredSections = sectionsState.map((section) => ({
    ...section,
    items: section.items.filter((item) =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  }));

  return (
    <Modal animationType="slide">
      <View style={styles.container}>
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
          {filteredSections.map((section) => (
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
                    {level}
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
                      {profile}
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
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
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
