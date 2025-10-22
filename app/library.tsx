import color from "@constants/color";
import { FONTS } from "@constants/fonts";
import { Ionicons } from "@expo/vector-icons";
import { fetchAllDishes } from "@features/dishes";
import { RootState } from "@redux";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { navigateCustom } from "@utils/navigation";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Dish } from "../types/dishes";

export default function LibraryScreen() {
  const [searchText, setSearchText] = useState("");
  const [filteredFoods, setFilteredFoods] = useState<Dish[]>([]);
  const [filterMode, setFilterMode] = useState<"name" | "type" | "time">(
    "name"
  );
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const { allDishes, loading } = useAppSelector(
    (state: RootState) => state.dish
  );
  const dispatch = useAppDispatch();

  /** 🟢 Gọi API load danh sách khi mở màn hình */
  useEffect(() => {
    dispatch(fetchAllDishes({ pageIndex: 0, pageSize: 9999 }));
  }, [dispatch]);

  /** 🟢 Khi allDishes thay đổi → cập nhật filteredFoods */
  useEffect(() => {
    setFilteredFoods(allDishes);
  }, [allDishes]);

  /** 🔍 Hàm tìm kiếm */
  const handleSearch = (text: string) => {
    setSearchText(text);
    const lowerText = text.toLowerCase();

    if (lowerText.trim() === "") {
      setFilteredFoods(allDishes);
    } else {
      const filtered = allDishes.filter((item) => {
        // tuỳ backend trả về gì, chỉnh lại cho đúng:
        const name = item.name?.toLowerCase() ?? "";
        const type = item.category?.toLowerCase() ?? "";
        const time = String(item.cookingTime ?? "").toLowerCase();

        if (filterMode === "name") return name.includes(lowerText);
        if (filterMode === "type") return type.includes(lowerText);
        if (filterMode === "time") return time.includes(lowerText);
        return false;
      });
      setFilteredFoods(filtered);
    }
  };

  /** 🧩 Chọn tiêu chí lọc */
  const handleFilterSelect = (mode: "name" | "type" | "time") => {
    setFilterMode(mode);
    setIsFilterVisible(false);
    handleSearch(searchText); // cập nhật lại danh sách theo mode mới
  };

  if (loading) {
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text
        style={{
          fontSize: 24,
          fontFamily: FONTS.bold,
          color: color.dark_green,
        }}
      >
        LOADING...
      </Text>
      <ActivityIndicator size="large" color={color.dark_green} />
    </View>;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={28}
          color={color.black}
          onPress={() => navigateCustom("/tabs")}
        />
        <Text style={[styles.title, { fontFamily: FONTS.semiBold }]}>
          Thư viện món ăn
        </Text>
      </View>

      {/* Thanh tìm kiếm */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color={color.gray_dark} />
        <TextInput
          style={styles.searchInput}
          placeholder={`Tìm món ăn theo ${
            filterMode === "name"
              ? "tên"
              : filterMode === "type"
              ? "loại"
              : "thời gian"
          }...`}
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
                onPress={() => handleFilterSelect(mode as any)}
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
      {loading ? (
        // ✅ Hiển thị loading khi đang tải
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={color.dark_green} />
          <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredFoods}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.9}
              onPress={() =>
                navigateCustom("/dishes", { params: { id: item.id } })
              }
            >
              <View style={styles.headerContainer}></View>
              <View style={styles.propContainer}>
                <View style={styles.typeTag}>
                  <Text style={styles.typeText}>
                    {item.category || "Không rõ"}
                  </Text>
                </View>
                <Text style={styles.timeText}>
                  {item.cookingTime + " phút"}
                </Text>
                <View style={styles.imageContainer}>
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      style={styles.image}
                      resizeMode="cover"
                    />
                  ) : (
                    <Image
                      source={require("../assets/images/pho-bo.png")}
                      style={styles.image}
                      resizeMode="cover"
                    />
                  )}
                </View>
              </View>
              <Text style={[styles.foodName, { fontFamily: FONTS.medium }]}>
                {item.name}
              </Text>
              <Text style={styles.desc} numberOfLines={3}>
                {item.description || "Không có mô tả"}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.background,
    paddingHorizontal: 16,
    paddingTop: 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: color.white,
  },
  loadingText: {
    marginTop: 12,
    color: color.dark_green,
    fontFamily: FONTS.medium,
    fontSize: 15,
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
