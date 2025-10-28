import color from "@constants/color";
import { FONTS } from "@constants/fonts";
import { Ionicons } from "@expo/vector-icons";
import { fetchAllDishes } from "@features/dishes";
import { RootState } from "@redux";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { navigateCustom } from "@utils/navigation";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Dish } from "../types/dishes";
// IMPORT MỚI
import { FilterModal } from "@components/ui/FilterModal";
import { useFilterState } from "../hooks/useFilterState";

// BỎ Định nghĩa kiểu dữ liệu cho Filter (đã chuyển vào hook)
// BỎ const allTypes: TypeFilter[] = [...]

export default function LibraryScreen() {
  const [searchText, setSearchText] = useState("");
  const [filteredFoods, setFilteredFoods] = useState<Dish[]>([]);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  
  // Bỏ tất cả các state lọc và state phụ trợ của Modal:
  // [showAllIngredients, isExpandingIngredientsIncluded, isExpandingIngredientsExcluded, searchIncludedText, searchExcludedText, includedIngredients, excludedIngredients, selectedTimeFilter, selectedTypeFilter]

  const { allDishes, loading } = useAppSelector(
    (state: RootState) => state.dish
  );
  const dispatch = useAppDispatch();

  // === SỬ DỤNG CUSTOM HOOK ===
  const filterState = useFilterState(allDishes);
  
  // Destructure các state lọc và setter cần thiết cho logic chính
  const {
    includedIngredients,
    excludedIngredients,
    selectedTimeFilter,
    selectedTypeFilter,
    handleResetFilter,
  } = filterState;

  /** 🟢 Gọi API load danh sách khi mở màn hình */
  useEffect(() => {
    dispatch(fetchAllDishes({ pageIndex: 0, pageSize: 9999 }));
  }, [dispatch]);

  /** 🟢 Khi allDishes thay đổi → cập nhật filteredFoods (chỉ chạy lần đầu) */
  useEffect(() => {
    if (allDishes.length > 0 && filteredFoods.length === 0) {
      setFilteredFoods(allDishes);
    }
  }, [allDishes]);
  
  // Tách riêng logic Apply Filter và làm cho nó là một Callback để có thể gọi từ bên ngoài
  const handleApplyFilter = useCallback(() => {
    let finalFilteredDishes = allDishes;

    if (searchText.trim().length > 0) {
      const lowerText = searchText.toLowerCase();
      finalFilteredDishes = finalFilteredDishes.filter((item) => {
        const name = item.name?.toLowerCase() ?? "";
        return name.includes(lowerText);
      });
    }

    if (includedIngredients.length > 0 || excludedIngredients.length > 0) {
      finalFilteredDishes = finalFilteredDishes.filter((item) => {
        const dishIngredients = item.ingredients
          ? item.ingredients.split(",").map((s) => s.trim().toLowerCase())
          : [];

        const meetsIncluded = includedIngredients.every((ing) =>
          dishIngredients.includes(ing.toLowerCase())
        );

        const meetsExcluded = !excludedIngredients.some((ing) =>
          dishIngredients.includes(ing.toLowerCase())
        );

        return meetsIncluded && meetsExcluded;
      });
    }

    if (selectedTimeFilter) {
      finalFilteredDishes = finalFilteredDishes.filter((item) => {
        const cookingTime = item.cookingTime;
        if (!cookingTime) return false;

        switch (selectedTimeFilter) {
          case "<= 20 phút":
            return cookingTime <= 20;
          case "<= 60 phút":
            return cookingTime <= 60;
          case "<= 120 phút":
            return cookingTime <= 120;
          case "> 120 phút":
            return cookingTime > 120;
          default:
            return true;
        }
      });
    }
    if (selectedTypeFilter) {
      finalFilteredDishes = finalFilteredDishes.filter((item) => {
        const category = item.category || "";
        return category.toLowerCase() === selectedTypeFilter.toLowerCase();
      });
    }
    
    // Cuối cùng mới cập nhật danh sách
    setFilteredFoods(finalFilteredDishes);
    setIsFilterModalVisible(false);
  }, [
    allDishes,
    searchText,
    includedIngredients,
    excludedIngredients,
    selectedTimeFilter,
    selectedTypeFilter,
  ]);
  
  // Hook để áp dụng filter tự động khi searchText thay đổi (chỉ cho search bar)
  useEffect(() => {
    // Chỉ áp dụng khi có text search, nếu không, phải bấm nút Tìm kiếm trong modal
    if (searchText.trim().length > 0 && !isFilterModalVisible) {
      handleApplyFilter();
    } else if (searchText.trim().length === 0 && !isFilterModalVisible) {
      // Nếu xóa search text, ta nên áp dụng lại toàn bộ filter hiện có
      handleApplyFilter(); 
    }
  }, [searchText, handleApplyFilter, isFilterModalVisible]); 


  /** Xóa tất cả lọc và áp dụng danh sách đầy đủ */
  const handleClearAllAndApply = useCallback(() => {
    handleResetFilter(); // Reset tất cả các state lọc trong Modal (Hook)
    setSearchText(""); // Reset cả ô tìm kiếm chính
    setFilteredFoods(allDishes); // Áp dụng danh sách gốc
    setIsFilterModalVisible(false);
  }, [allDishes, handleResetFilter]);

  // Xử lý Loading (Giữ nguyên)
  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={color.dark_green} />
      <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
    </View>
  );

  if (loading && allDishes.length === 0) {
    return renderLoading();
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

      {/* Thanh tìm kiếm và nút Filter */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm theo tên món ăn..."
          placeholderTextColor={color.gray_dark}
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity onPress={() => setIsFilterModalVisible(true)}>
          <Ionicons name="filter" size={22} color={color.dark_green} />
        </TouchableOpacity>
      </View>

      {/* Modal Filter Nâng cao (Component đã tách) */}
      <FilterModal
        isVisible={isFilterModalVisible}
        onClose={() => setIsFilterModalVisible(false)} // Đóng modal
        onApplyFilter={handleApplyFilter} // Áp dụng các thay đổi trong modal
        onClearAllAndApply={handleClearAllAndApply} // Xóa tất cả và áp dụng danh sách gốc
        filterState={filterState} // Truyền toàn bộ filter state/handlers vào component
      />

      {/* Danh sách món ăn */}
      {loading ? (
        renderLoading()
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

// === Styles ===
// ... (GIỮ NGUYÊN Styles cho LibraryScreen)
const styles = StyleSheet.create({
    // ... (Giữ nguyên styles cũ cho màn hình chính)
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
        backgroundColor: "rgba(0,0,0,0.7)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        backgroundColor: color.white,
        borderRadius: 12,
        padding: 20,
        width: "90%",
        maxHeight: "80%",
    },
    modalTitle: {
        fontSize: 18,
        color: color.dark_green,
        marginBottom: 15,
        textAlign: "center",
    },
    showAllButton: {
        marginTop: 5,
        alignSelf: "flex-start",
    },
    showAllText: {
        fontSize: 12,
        color: color.gray_dark,
        fontFamily: FONTS.medium,
    },
    buttonGroup: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: color.light_gray,
    },
    actionButton: {
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: "center",
        width: "48%",
    },
    backButton: {
        backgroundColor: color.light_gray,
    },
    searchButton: {
        backgroundColor: color.dark_green,
    },
    buttonText: {
        color: color.white,
        fontFamily: FONTS.semiBold,
        fontSize: 15,
    },
});