import { useCallback, useMemo, useState } from "react";
import { Dish } from "../types/dishes"; // Đảm bảo đường dẫn này đúng

// Định nghĩa kiểu dữ liệu cho Filter
export type TimeFilter = "<= 20 phút" | "<= 60 phút" | "<= 120 phút" | "> 120 phút";
export type TypeFilter = "Đồ mặn" | "Đồ chay" | "Tráng miệng";
export const allTimeFilters: TimeFilter[] = ["<= 20 phút", "<= 60 phút", "<= 120 phút", "> 120 phút"];
export const allTypes: TypeFilter[] = ["Đồ mặn", "Đồ chay", "Tráng miệng"];

export const useFilterState = (allDishes: Dish[]) => {
  // === Filter Modal States ===
  const [includedIngredients, setIncludedIngredients] = useState<string[]>([]);
  const [excludedIngredients, setExcludedIngredients] = useState<string[]>([]);
  const [selectedTimeFilter, setSelectedTimeFilter] = useState<TimeFilter | null>(null);
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<TypeFilter | null>(null);

  // States hỗ trợ Modal
  const [searchIncludedText, setSearchIncludedText] = useState("");
  const [searchExcludedText, setSearchExcludedText] = useState("");
  const [showAllIngredients, setShowAllIngredients] = useState(false);
  const [isExpandingIngredientsIncluded, setIsExpandingIngredientsIncluded] = useState(false);
  const [isExpandingIngredientsExcluded, setIsExpandingIngredientsExcluded] = useState(false);

  // Danh sách nguyên liệu duy nhất (Memoized)
  const uniqueIngredients = useMemo(() => {
    const ingredientSet = new Set<string>();
    allDishes.forEach((dish) => {
      const ingredients = dish.ingredients
        ? dish.ingredients.split(",").map((s) => s.trim())
        : [];
      ingredients.forEach((ing) => {
        if (ing) ingredientSet.add(ing);
      });
    });
    return Array.from(ingredientSet).sort((a, b) => a.localeCompare(b));
  }, [allDishes]);

  // Hàm Reset Filter
  const handleResetFilter = useCallback(() => {
    setIncludedIngredients([]);
    setExcludedIngredients([]);
    setSelectedTimeFilter(null);
    setSelectedTypeFilter(null);
    setSearchIncludedText("");
    setSearchExcludedText("");
    setShowAllIngredients(false);
  }, []);

  // Hàm Toggle Checkbox Nguyên liệu
  const toggleIngredient = useCallback(
    (ingredient: string, type: "included" | "excluded") => {
      const setList = type === "included" ? setIncludedIngredients : setExcludedIngredients;
      const otherList = type === "included" ? excludedIngredients : includedIngredients;

      setList((prev) => {
        if (prev.includes(ingredient)) {
          return prev.filter((i) => i !== ingredient);
        } else {
          // Ngăn không cho chọn cùng một nguyên liệu ở cả 2 list
          if (otherList.includes(ingredient)) return prev;
          return [...prev, ingredient];
        }
      });
    },
    [includedIngredients, excludedIngredients]
  );

  // Hàm Lọc Nguyên liệu hiển thị trong Modal
  const getFilteredIngredients = useCallback(
    (searchText: string) => {
      const lowerSearchText = searchText.toLowerCase();

      const filteredBySearch = uniqueIngredients.filter(ing =>
        ing.toLowerCase().includes(lowerSearchText)
      );

      // Nếu không phải đang trong chế độ "Xem tất cả" và không có tìm kiếm, chỉ hiện 5 cái đầu
      if (!showAllIngredients && lowerSearchText.length === 0) {
        return filteredBySearch.slice(0, 5);
      }

      return filteredBySearch;
    },
    [uniqueIngredients, showAllIngredients]
  );

  // Xử lý Loading và Toggle "Xem tất cả"
  const handleToggleShowAllIngredients = (type: "included" | "excluded") => {
    const setExpanding = type === "included" ? setIsExpandingIngredientsIncluded : setIsExpandingIngredientsExcluded;
    setExpanding(true);
    setTimeout(() => {
      setShowAllIngredients((prev) => !prev);
      setExpanding(false);
    }, 300);
  };

  return {
    // Filter State
    includedIngredients,
    excludedIngredients,
    selectedTimeFilter,
    selectedTypeFilter,
    
    // Setters
    setIncludedIngredients,
    setExcludedIngredients,
    setSelectedTimeFilter,
    setSelectedTypeFilter,

    // Utility State/Functions
    uniqueIngredients,
    searchIncludedText,
    setSearchIncludedText,
    searchExcludedText,
    setSearchExcludedText,
    showAllIngredients,
    isExpandingIngredientsIncluded,
    isExpandingIngredientsExcluded,
    
    // Handlers
    handleResetFilter,
    toggleIngredient,
    getFilteredIngredients,
    handleToggleShowAllIngredients,
  };
};

export type UseFilterStateType = ReturnType<typeof useFilterState>;