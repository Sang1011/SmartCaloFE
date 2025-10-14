import color from "@constants/color";
import { FONTS } from "@constants/fonts";
import { Ionicons } from "@expo/vector-icons";
import { navigateCustom } from "@utils/navigation";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const foods = [
  {
    id: "1",
    name: "Cơm tấm sườn bì chả",
    desc: "Món ngon đặc trưng, rất được ưa chuộng. Dễ học cách làm...",
    type: "Đồ mặn",
    time: "30 phút",
    image: require("../assets/images/pho-bo.png"),
  },
  {
    id: "2",
    name: "Bún bò Huế",
    desc: "Món ngon đặc trưng, rất được ưa chuộng. Dễ học cách làm...",
    type: "Đồ mặn",
    time: "60 phút",
    image: require("../assets/images/pho-bo.png"),
  },
  {
    id: "3",
    name: "Phở bò",
    desc: "Món ngon đặc trưng, rất được ưa chuộng. Dễ học cách làm...",
    type: "Đồ mặn",
    time: "60 phút",
    image: require("../assets/images/pho-bo.png"),
  },
  {
    id: "4",
    name: "Bánh mì đặc biệt",
    desc: "Món ngon đặc trưng, rất được ưa chuộng. Dễ học cách làm...",
    type: "Đồ mặn",
    time: "15 phút",
    image: require("../assets/images/pho-bo.png"),
  },
  {
    id: "5",
    name: "Salad đậu hũ",
    desc: "Món ngon đặc trưng, rất được ưa chuộng. Dễ học cách làm...",
    type: "Đồ chay",
    time: "15 phút",
    image: require("../assets/images/pho-bo.png"),
  },
  {
    id: "6",
    name: "Miến xào chay",
    desc: "Món ngon đặc trưng, rất được ưa chuộng. Dễ học cách làm...",
    type: "Đồ chay",
    time: "30 phút",
    image: require("../assets/images/pho-bo.png"),
  },
];

export default function LibraryScreen() {
  const [searchText, setSearchText] = useState("");
  const [filteredFoods, setFilteredFoods] = useState(foods);
  const [filterMode, setFilterMode] = useState<"name" | "type" | "time">("name");
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  // Hàm tìm kiếm theo filterMode
  const handleSearch = (text: string) => {
    setSearchText(text);
    const lowerText = text.toLowerCase();

    if (lowerText.trim() === "") {
      setFilteredFoods(foods);
    } else {
      const filtered = foods.filter((item) =>
        item[filterMode].toLowerCase().includes(lowerText)
      );
      setFilteredFoods(filtered);
    }
  };

  const handleFilterSelect = (mode: "name" | "type" | "time") => {
    setFilterMode(mode);
    setIsFilterVisible(false);
    handleSearch(searchText); // cập nhật lại danh sách theo mode mới
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={28} color={color.black} onPress={() => {
          navigateCustom("/tabs");
        }}/>
        <Text style={[styles.title, { fontFamily: FONTS.semiBold }]}>
          Thư viện món ăn
        </Text>
      </View>

      {/* Thanh tìm kiếm */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color={color.gray_dark} />
        <TextInput
          style={styles.searchInput}
          placeholder={`Tìm món ăn theo ${filterMode === "name" ? "tên" : filterMode === "type" ? "loại" : "thời gian"}...`}
          placeholderTextColor={color.gray_dark}
          value={searchText}
          onChangeText={handleSearch}
        />
        <TouchableOpacity onPress={() => setIsFilterVisible(true)}>
          <Ionicons name="filter" size={22} color={color.dark_green} />
        </TouchableOpacity>
      </View>

      {/* Modal chọn filter */}
      <Modal
        visible={isFilterVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsFilterVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={[styles.modalTitle, { fontFamily: FONTS.semiBold }]}>
              Chọn tiêu chí lọc
            </Text>
            {["name", "type", "time"].map((mode) => (
              <TouchableOpacity
                key={mode}
                style={[
                  styles.filterOption,
                  filterMode === mode && styles.activeFilter,
                ]}
                onPress={() => handleFilterSelect(mode as "name" | "type" | "time")}
              >
                <Text
                  style={[
                    styles.filterText,
                    {
                      color:
                        filterMode === mode ? color.white : color.dark_green,
                    },
                  ]}
                >
                  {mode === "name"
                    ? "Theo tên món ăn"
                    : mode === "type"
                    ? "Theo loại"
                    : "Theo thời gian"}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsFilterVisible(false)}
            >
              <Text style={styles.closeText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Danh sách món ăn */}
      <FlatList
        data={filteredFoods}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} activeOpacity={0.9}>
            <View style={styles.headerContainer}></View>
            <View style={styles.propContainer}>
              <View style={styles.typeTag}>
                <Text style={styles.typeText}>{item.type}</Text>
              </View>
              <Text style={styles.timeText}>{item.time}</Text>
              <View style={styles.imageContainer}>
                <Image
                  source={item.image}
                  style={styles.image}
                  resizeMode="cover"
                />
              </View>
            </View>
            <Text style={[styles.foodName, { fontFamily: FONTS.medium }]}>
              {item.name}
            </Text>
            <Text style={styles.desc} numberOfLines={3}>
              {item.desc}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.background,
    paddingHorizontal: 16,
    paddingTop: 60,
    position: "relative",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    marginLeft: "22%",
    color: color.black,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: color.white,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    marginHorizontal: 8,
    color: color.black,
  },
  card: {
    backgroundColor: color.white,
    borderRadius: 12,
    marginBottom: 20,
    width: "47%",
    height: 275,
  },
  headerContainer: {
    height: 95,
    borderRadius: 10,
    backgroundColor: color.dark_green,
  },
  propContainer: {
    position: "absolute",
    width: "100%",
  },
  imageContainer: {
    marginTop: 32,
    height: 170,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  image: {
    marginTop: 15,
    width: "100%",
    height: 170,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  typeTag: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  typeText: {
    fontSize: 11,
    color: color.white,
    fontFamily: FONTS.medium,
  },
  timeText: {
    position: "absolute",
    top: 8,
    right: 8,
    fontSize: 11,
    color: color.white,
    backgroundColor: color.undereating,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    fontFamily: FONTS.italic,
  },
  foodName: {
    fontSize: 14,
    color: color.dark_green,
    marginTop: 100,
    marginHorizontal: 8,
  },
  desc: {
    fontSize: 12,
    color: color.gray_dark,
    marginHorizontal: 8,
    marginBottom: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: color.white,
    borderRadius: 12,
    padding: 20,
    width: "80%",
  },
  modalTitle: {
    fontSize: 16,
    color: color.dark_green,
    marginBottom: 12,
    textAlign: "center",
  },
  filterOption: {
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: color.dark_green,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: "center",
  },
  activeFilter: {
    backgroundColor: color.dark_green,
  },
  filterText: {
    fontSize: 14,
  },
  closeButton: {
    marginTop: 10,
    alignSelf: "center",
  },
  closeText: {
    color: color.gray_dark,
  },
});
