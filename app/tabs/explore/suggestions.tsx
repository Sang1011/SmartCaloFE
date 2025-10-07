import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, FlatList, Image, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import color from "@constants/color";
import { FONTS } from "@constants/fonts";

export default function SuggestionsScreen() {
  const [activeFilter, setActiveFilter] = useState("Tất Cả");

  const filters = ["Tất Cả", "Mới Nhất", "Bán Chạy"];

  const categories = [
    { id: 1, title: "Tập Luyện", image: require("../../../assets/images/workout.png") },
    { id: 2, title: "Thực Phẩm", image: require("../../../assets/images/food.png") },
    { id: 3, title: "Sức Khỏe", image: require("../../../assets/images/health.png") },
  ];

  const products = [
    {
      id: "p1",
      title: "Whey",
      sold: "1.5k",
      category: "Tập Luyện",
      image: require("../../../assets/images/whey.png"),
      desc: "Bổ sung Whey Protein chất lượng cao giúp cơ thể phục hồi sau tập, phát triển cơ bắp.",
    },
    {
      id: "p2",
      title: "Thịt bò xay",
      sold: "2.5k",
      category: "Thực Phẩm",
      image: require("../../../assets/images/whey.png"),
      desc: "Thịt bò xay tươi ngon, giữ nguyên độ ngọt tự nhiên, không chất bảo quản.",
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={color.light_gray} style={{ marginLeft: 8 }} />
        <TextInput placeholder="Tìm sản phẩm" style={styles.searchInput} />
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options" size={20} color={color.white} />
        </TouchableOpacity>
      </View>

      {/* Banner */}
      <View style={styles.banner}>
        <View style={{ flex: 1 }}>
          <Text style={styles.bannerTitle}>Inulin Powder</Text>
          <Text style={styles.bannerDesc}>
            Inulin Powder là một loại chất xơ hòa tan tự nhiên, thường chiết xuất từ rễ rau diếp xoăn.
          </Text>
          <TouchableOpacity style={styles.bannerButton}>
            <Text style={styles.bannerButtonText}>Xem Chi Tiết</Text>
          </TouchableOpacity>
        </View>
        <Image source={require("../../../assets/images/powder.png")} style={styles.bannerImage} resizeMode="contain" />
      </View>

      {/* Danh Mục */}
      <Text style={styles.sectionTitle}>Danh Mục</Text>
      <View style={styles.categoryRow}>
        {categories.map((cat) => (
          <TouchableOpacity key={cat.id} style={styles.categoryCard}>
            <Image source={cat.image} style={styles.categoryImage} />
            <View style={cat.id % 2 ? styles.overlayLeft : styles.overlayRight} />
            <Text style={cat.id % 2 ? styles.categoryTextLeft : styles.categoryTextRight}>{cat.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Bộ lọc */}
      <View style={styles.filterRow}>
        {filters.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, activeFilter === f && styles.activeFilter]}
            onPress={() => setActiveFilter(f)}
          >
            <Text style={[styles.filterText, activeFilter === f && { color: color.white }]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Danh sách sản phẩm */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <Image source={item.image} style={styles.productImage} />
            <Text style={styles.productTitle}>{item.title}</Text>
            <Text style={styles.productSold}>{item.sold} đã bán</Text>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{item.category}</Text>
            </View>
            <Text style={styles.productDesc} numberOfLines={2}>
              {item.desc}
            </Text>
          </View>
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.background,
    padding: 16,
  },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: color.white,
    borderRadius: 12,
    alignItems: "center",
    paddingHorizontal: 4,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    padding: 8,
    fontFamily: FONTS.regular,
  },
  filterButton: {
    backgroundColor: color.dark_green,
    padding: 10,
    borderRadius: 8,
  },
  banner: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  bannerTitle: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    marginBottom: 4,
  },
  bannerDesc: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: color.light_gray,
    marginBottom: 8,
  },
  bannerButton: {
    backgroundColor: color.dark_green,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: "flex-start",
  },
  bannerButtonText: {
    color: color.white,
    fontFamily: FONTS.medium,
  },
  bannerImage: {
    width: 100,
    height: 100,
    marginLeft: 12,
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    marginBottom: 8,
  },
  categoryRow: {
    flexDirection: "column",
    gap: 8,
    marginBottom: 16,
  },
  categoryCard: {
    flex: 1,
    height: 80,
    borderRadius: 12,
    marginHorizontal: 4,
    overflow: "hidden",
    position: "relative",
  },
  categoryImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  overlayLeft: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(66, 99, 66, 0.41)",
    width: 120,
    height: 135,
    zIndex: 1,
    borderColor: color.white, borderWidth: 2.5,
    transform: [{ rotate: "-28.22deg" }, { translateY: -20 }] ,
  },
  overlayRight: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(66, 99, 66, 0.41)",
    zIndex: 1,
    position: "relative",
    left: 248, 
    borderColor: color.white, 
    borderWidth: 2.5,
    width: 120,
    height: 135,
    transform: [{ rotate: "28.22deg" }, { translateY: -20 }],
  },
  categoryTextLeft: {
    color: color.white,
    fontFamily: FONTS.bold,
    fontSize: 14,
    position: "absolute",
    bottom: 30,
    left: 12,
    zIndex: 2,
  },
  categoryTextRight: {
    color: color.white,
    fontFamily: FONTS.bold,
    fontSize: 14,
    position: "absolute",
    bottom: 30,
    right: 12,
    zIndex: 2,
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  filterChip: {
    borderWidth: 1,
    borderColor: color.dark_green,
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginHorizontal: 4,
  },
  activeFilter: {
    backgroundColor: color.dark_green,
  },
  filterText: {
    fontFamily: FONTS.medium,
    color: color.dark_green,
    fontSize: 12,
  },
  productCard: {
    width: 180,
    backgroundColor: color.white,
    borderRadius: 16,
    padding: 12,
    marginRight: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: "100%",
    height: 100,
    borderRadius: 12,
    marginBottom: 8,
  },
  productTitle: {
    fontFamily: FONTS.bold,
    fontSize: 14,
  },
  productSold: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: color.light_gray,
  },
  tag: {
    backgroundColor: "#e6f5ec",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginVertical: 4,
  },
  tagText: {
    color: color.dark_green,
    fontSize: 12,
    fontFamily: FONTS.medium,
  },
  productDesc: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: color.light_gray,
  },
});
