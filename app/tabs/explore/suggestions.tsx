import color from "@constants/color";
import { FONTS } from "@constants/fonts";
import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function SuggestionsScreen() {
  const [activeFilter, setActiveFilter] = useState("Tất Cả");
  const [currentBanner, setCurrentBanner] = useState(0);
  const flatListRef = useRef(null);

  const filters = ["Tất Cả", "Mới Nhất", "Bán Chạy"];

  const categories = [
    {
      id: 1,
      title: "Tập Luyện",
      image: require("../../../assets/images/workout.png"),
    },
    {
      id: 2,
      title: "Thực Phẩm",
      image: require("../../../assets/images/food.png"),
    },
    {
      id: 3,
      title: "Sức Khỏe",
      image: require("../../../assets/images/health.png"),
    },
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

  const banners = [
    {
      id: 1,
      title: "Inulin Powder",
      desc: "Chất xơ tự nhiên hỗ trợ tiêu hoá, tăng lợi khuẩn đường ruột.",
      color: "#E2F3E8",
      image: require("../../../assets/images/powder.png"),
    },
    {
      id: 2,
      title: "Whey Protein",
      desc: "Bổ sung protein tinh khiết giúp phục hồi cơ và tăng sức mạnh.",
      color: "#F8E8E9",
      image: require("../../../assets/images/whey.png"),
    },
    {
      id: 3,
      title: "Omega 3",
      desc: "Dầu cá nguyên chất giúp cải thiện trí nhớ và tim mạch.",
      color: "#E6F2FF",
      image: require("../../../assets/images/powder.png"),
    },
    {
      id: 4,
      title: "Vitamin C+",
      desc: "Tăng cường đề kháng, giảm mệt mỏi, đẹp da mỗi ngày.",
      color: "#FFF6E5",
      image: require("../../../assets/images/powder.png"),
    },
  ];

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / 350); // vì bannerCard width = 350
    setCurrentBanner(index);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color={color.light_gray}
          style={{ marginLeft: 8 }}
        />
        <TextInput placeholder="Tìm sản phẩm" style={styles.searchInput} />
      </View>

      {/* Banner Carousel */}
      <View>
        <FlatList
          ref={flatListRef}
          data={banners}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          onScroll={handleScroll}
          scrollEventThrottle={16}
          renderItem={({ item }) => (
            <View style={[styles.bannerCard, { backgroundColor: item.color }]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.bannerTitle}>{item.title}</Text>
                <Text style={styles.bannerDesc}>{item.desc}</Text>
                <TouchableOpacity style={styles.bannerButton}>
                  <Text style={styles.bannerButtonText}>Xem Chi Tiết</Text>
                </TouchableOpacity>
              </View>
              <Image
                source={item.image}
                style={styles.bannerImage}
                resizeMode="contain"
              />
            </View>
          )}
        />

        {/* Dot Indicator */}
        <View style={styles.dotContainer}>
          {banners.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, currentBanner === index && styles.activeDot]}
            />
          ))}
        </View>
      </View>

      {/* Danh Mục */}
      <Text style={styles.sectionTitle}>Danh Mục</Text>
      <View style={styles.categoryRow}>
        {categories.map((cat) => (
          <TouchableOpacity key={cat.id} style={styles.categoryCard}>
            <Image source={cat.image} style={styles.categoryImage} />
            <View
              style={cat.id % 2 ? styles.overlayLeft : styles.overlayRight}
            />
            <Text
              style={
                cat.id % 2 ? styles.categoryTextLeft : styles.categoryTextRight
              }
            >
              {cat.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Bộ lọc */}
      <View style={styles.filterRow}>
        {filters.map((f) => (
          <TouchableOpacity
            key={f}
            style={[
              styles.filterChip,
              activeFilter === f && styles.activeFilter,
            ]}
            onPress={() => setActiveFilter(f)}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === f && { color: color.white },
              ]}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Danh sách sản phẩm */}
      <Text style={styles.sectionTitle}>Gợi ý cho bạn</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 10, marginBottom: 30, display: "flex", justifyContent: "center", flexDirection: "row", alignItems: "center" }}
        renderItem={({ item }) => (
          <TouchableOpacity activeOpacity={0.8} style={styles.productCardNew}>
            <View style={styles.imageWrapper}>
              <Image
                source={item.image}
                style={styles.productImageNew}
                resizeMode="contain"
              />
              <View style={styles.categoryTag}>
                <Text style={styles.categoryTagText}>{item.category}</Text>
              </View>
            </View>
            <View style={styles.productInfo}>
              <Text style={styles.productTitleNew} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.productDescNew} numberOfLines={2}>
                {item.desc}
              </Text>
              <View style={styles.productFooter}>
                <Text style={styles.productSoldNew}>{item.sold} đã bán</Text>
                <TouchableOpacity style={styles.buyButton}>
                  <Text style={styles.buyButtonText}>Mua</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
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
  bannerCard: {
    width: 350,
    flexDirection: "row",
    borderRadius: 20,
    marginVertical: 15,
    marginHorizontal: 15,
    padding: 16,
    alignItems: "center",
    marginRight: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bannerTitle: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    marginBottom: 6,
    color: color.dark_green,
  },
  bannerDesc: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: "#444",
    marginBottom: 8,
    maxWidth: 160,
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
    fontSize: 13,
  },
  bannerImage: {
    width: 110,
    height: 110,
    marginLeft: 8,
  },
  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: color.dark_green,
    width: 10,
    height: 10,
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
    borderColor: color.white,
    borderWidth: 2.5,
    transform: [{ rotate: "-28.22deg" }, { translateY: -20 }],
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
  productCardNew: {
    width: 180,
    backgroundColor: color.white,
    borderRadius: 20,
    marginRight: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    overflow: "hidden",
  },

  imageWrapper: {
    width: "100%",
    height: 120,
    backgroundColor: "#f5faf7",
    justifyContent: "center",
    alignItems: "center",
  },

  productImageNew: {
    width: 100,
    height: 100,
  },

  categoryTag: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: color.dark_green,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },

  categoryTagText: {
    color: color.white,
    fontFamily: FONTS.medium,
    fontSize: 11,
  },

  productInfo: {
    padding: 12,
  },

  productTitleNew: {
    fontFamily: FONTS.bold,
    fontSize: 15,
    color: "#2b2b2b",
    marginBottom: 4,
  },

  productDescNew: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: "#666",
    lineHeight: 16,
    marginBottom: 8,
  },

  productFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  productSoldNew: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: color.light_gray,
  },

  buyButton: {
    backgroundColor: color.dark_green,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },

  buyButtonText: {
    color: color.white,
    fontFamily: FONTS.medium,
    fontSize: 12,
  },
});
