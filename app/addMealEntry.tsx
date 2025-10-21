import color from "@constants/color";
import { FONTS } from "@constants/fonts";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import { navigateCustom } from "@utils/navigation";
import { useState } from "react";
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const mealOptions = [
    { label: "Sáng (Breakfast)", value: "breakfast" },
    { label: "Trưa (Lunch)", value: "lunch" },
    { label: "Chiều (Afternoon)", value: "afternoon" },
    { label: "Tối (Dinner)", value: "dinner" },
    { label: "Ăn nhẹ (Snack)", value: "snack" },
];

// --- Component Dropdown (Giữ nguyên) ---
const MealDropdown = ({
    selectedValue,
    onValueChange,
    options,
    isVisible,
    onClose,
}) => {
    const displayLabel =
        options.find((opt) => opt.value === selectedValue)?.label ||
        options[0].label;

    return (
        <Modal animationType="fade" transparent visible={isVisible} onRequestClose={onClose}>
            <Pressable style={modalStyles.centeredView} onPress={onClose}>
                <View style={modalStyles.modalView}>
                    <Text style={modalStyles.modalTitle}>Chọn bữa ăn</Text>
                    {options.map((item) => (
                        <Pressable
                            key={item.value}
                            style={[
                                modalStyles.option,
                                selectedValue === item.value && modalStyles.selectedOption,
                            ]}
                            onPress={() => {
                                onValueChange(item.value);
                                onClose();
                            }}
                        >
                            <Text
                                style={[
                                    modalStyles.optionText,
                                    selectedValue === item.value && modalStyles.selectedOptionText,
                                ]}
                            >
                                {item.label}
                            </Text>
                        </Pressable>
                    ))}
                </View>
            </Pressable>
        </Modal>
    );
};
// --- End Component Dropdown ---

// Component phụ để hiển thị từng chỉ số dinh dưỡng nhỏ
// Đã thêm màu nền và màu chữ cho chỉ số
const NutrientItem = ({ label, value, unit, bgColor, valueColor }) => (
    <View style={[styles.nutrientItem, { backgroundColor: bgColor }]}>
        <Text style={[styles.nutrientValue, { color: valueColor }]}>{value} {unit}</Text>
        <Text style={styles.nutrientLabel}>{label}</Text>
    </View>
);

// --- Component Dinh Dưỡng MỚI (Calo làm nổi bật & có màu) ---
const NutritionSummary = ({ nutrition }) => (
    <View style={styles.nutritionSummaryContainer}>
        {/* HÀNG 1: CALO (TO NHẤT) */}
        <View style={styles.caloRow}>
            <View style={styles.caloMacro}>
            <Text style={[styles.caloValue]}>
                {nutrition.calories} kcal
            </Text>
            <Text style={styles.caloLabel}>Calo</Text>
            </View>
        </View>

        <View style={styles.horizontalDivider} />

        {/* HÀNG 2: 4 CHỈ SỐ CÒN LẠI (2 CỘT & có màu nền) */}
        <View style={styles.macroRow}>
            <NutrientItem 
                label="Protein" 
                value={nutrition.protein} 
                unit="g" 
                bgColor={color.summary_protein_bg} // Màu nền
                valueColor={color.summary_protein_color} // Màu chữ
            />
            <NutrientItem 
                label="Chất béo" 
                value={nutrition.fat} 
                unit="g" 
                bgColor={color.summary_fat_bg} // Màu nền
                valueColor={color.summary_fat_color} // Màu chữ
            />
            <NutrientItem 
                label="Chất xơ" 
                value={nutrition.fiber} 
                unit="g" 
                bgColor={color.summary_fiber_bg} // Màu nền
                valueColor={color.summary_fiber_color} // Màu chữ
            />
            <NutrientItem 
                label="Đường" 
                value={nutrition.sugar} 
                unit="g" 
                bgColor={color.summary_sugar_bg} // Màu nền
                valueColor={color.summary_sugar_color} // Màu chữ
            />
        </View>
    </View>
);
// --- End Component Dinh Dưỡng MỚI ---


// --- Component chính (Giữ nguyên logic) ---
export default function AddMealEntry() {
    const [servings, setServing] = useState("1");
    const [selectedMeal, setSelectedMeal] = useState("lunch");
    const [isModalVisible, setIsModalVisible] = useState(false);

    // Dữ liệu dinh dưỡng gốc cho 1 khẩu phần (Giữ nguyên)
    const baseNutrition = {
        calories: 200,
        fat: 10,
        fiber: 5,
        sugar: 8,
        protein: 15,
    };

    // Tính toán giá trị dinh dưỡng theo khẩu phần
    const numericServings = parseInt(servings) || 0;
    const nutrition = {
        calories: baseNutrition.calories * numericServings,
        fat: baseNutrition.fat * numericServings,
        fiber: baseNutrition.fiber * numericServings,
        sugar: baseNutrition.sugar * numericServings,
        protein: baseNutrition.protein * numericServings,
    };

    const handleSave = () => {
        console.log(`Thêm ${servings} khẩu phần (${selectedMeal})`);
        // navigateCustom("/tabs");
    };

    const displayMealLabel =
        mealOptions.find((opt) => opt.value === selectedMeal)?.label ||
        mealOptions[1].label;

    return (
        <SafeAreaView edges={["top"]} style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Ionicons
                    name="chevron-back-outline"
                    size={24}
                    color="black"
                    onPress={() => navigateCustom("/dishes")}
                />
                <Text style={styles.headerTitle}>Thêm vào lịch sử</Text>
                <View style={{ width: 40 }} />
            </View>

            {/* Body */}
            <View style={styles.body}>
                
                {/* 1. Thông tin dinh dưỡng đã di chuyển lên trên */}
                <NutritionSummary nutrition={nutrition} />

                {/* 2. Nhập khẩu phần */}
                <Text style={styles.label}>Khẩu phần đã tiêu thụ</Text>
                <View style={styles.inputRow}>
                    <TextInput
                        style={[styles.input, styles.textInput]}
                        value={servings}
                        onChangeText={(text: string) => {
                            const filtered = text.replace(/[^0-9]/g, "");
                            setServing(filtered);
                        }}
                        keyboardType="numeric"
                        placeholder="Nhập khẩu phần..."
                    />
                    <View style={[styles.input, styles.unitTextContainer]}>
                        <Text style={styles.unitText}>Khẩu phần</Text>
                    </View>
                </View>

                {/* 3. Chọn bữa ăn */}
                <Text style={styles.label}>Bữa ăn trong ngày</Text>
                <Pressable
                    style={[styles.inputContainer, styles.dropdownInput]}
                    onPress={() => setIsModalVisible(true)}
                >
                    <Text style={styles.dropdownText}>{displayMealLabel}</Text>
                    <AntDesign name="down" size={16} color={color.dark_green} />
                </Pressable>

                {/* 4. Nút lưu */}
                <Pressable style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Thêm vào lịch sử</Text>
                </Pressable>
            </View>

            {/* Modal chọn bữa ăn */}
            <MealDropdown
                isVisible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                selectedValue={selectedMeal}
                onValueChange={setSelectedMeal}
                options={mealOptions}
            />
        </SafeAreaView>
    );
}

// --- Styles Bổ Sung và Thay Đổi ---
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: color.white },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: color.light_gray,
    },
    headerTitle: {
        fontFamily: FONTS.semiBold,
        fontSize: 18,
        color: color.black,
    },
    body: { flex: 1, padding: 16 },
    label: {
        fontFamily: FONTS.semiBold,
        fontSize: 16,
        color: color.black,
        marginTop: 20,
        marginBottom: 8,
    },
    
    // --- STYLES MỚI CHO SUMMARY DINH DƯỠNG ---
    nutritionSummaryContainer: {
        paddingTop: 10,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: color.light_gray,
        marginBottom: 10,
    },
    // Hàng CALO (Nổi bật)
    caloRow: {
        alignItems: 'center',
        paddingBottom: 10,
    },
    caloMacro: {
        width: '48%', // Điều chỉnh thành 48% để có không gian cho gap 
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 4,
        borderRadius: 10, // Bo góc cho thẻ màu
        marginBottom: 10, // Khoảng cách giữa các hàng
        justifyContent: 'center',
        backgroundColor: color.dark_green
    },
    caloValue: {
        fontFamily: FONTS.bold,
        fontSize: 28, // Kích thước lớn hơn
        color: color.white,
    },
    caloLabel: {
        fontFamily: FONTS.semiBold,
        fontSize: 14,
        color: color.white_60,
    },
    horizontalDivider: {
        height: 1,
        backgroundColor: color.light_gray,
        marginHorizontal: 10,
    },
    // Hàng MACRO (4 chỉ số chia 2 cột)
    macroRow: {
        flexDirection: 'row',
        flexWrap: 'wrap', 
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingTop: 15,
        gap: 10, // Thêm khoảng cách giữa các item
    },
    nutrientItem: {
        width: '48%', // Điều chỉnh thành 48% để có không gian cho gap 
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 4,
        borderRadius: 8, // Bo góc cho thẻ màu
        marginBottom: 10, // Khoảng cách giữa các hàng
        justifyContent: 'center',
    },
    nutrientValue: {
        fontFamily: FONTS.bold,
        fontSize: 16,
        // Màu chữ được set inline
    },
    nutrientLabel: {
        fontFamily: FONTS.regular,
        fontSize: 12,
        color: color.black_60, // Màu chữ nhãn
    },
    // --- END STYLES MỚI CHO SUMMARY DINH DƯỠNG ---

    inputRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: color.dark_green,
        borderRadius: 8,
        height: 50,
        paddingHorizontal: 12,
        fontFamily: FONTS.regular,
        fontSize: 16,
        color: color.black,
    },
    textInput: { width: "65%" },
    unitTextContainer: {
        width: "32%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: color.gray_light,
        borderColor: color.gray_dark,
    },
    unitText: {
        fontFamily: FONTS.semiBold,
        fontSize: 16,
        color: color.black,
    },
    inputContainer: {
        borderWidth: 1,
        borderColor: color.dark_green,
        borderRadius: 8,
        height: 50,
        paddingHorizontal: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    dropdownInput: {},
    dropdownText: {
        fontFamily: FONTS.regular,
        fontSize: 16,
        color: color.black,
    },
    
    saveButton: {
        backgroundColor: color.dark_green,
        paddingVertical: 15,
        borderRadius: 10,
        marginTop: 40,
        alignItems: "center",
    },
    saveButtonText: {
        color: color.white,
        fontFamily: FONTS.bold,
        fontSize: 16,
    },
});

// --- Styles cho Modal (Giữ nguyên) ---
const modalStyles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
    },
    modalView: {
        margin: 20,
        backgroundColor: color.white,
        borderRadius: 15,
        padding: 25,
        alignItems: "center",
        width: "80%",
    },
    modalTitle: {
        fontFamily: FONTS.bold,
        fontSize: 18,
        marginBottom: 15,
        color: color.dark_green,
    },
    option: {
        paddingVertical: 10,
        width: "100%",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: color.light_gray,
    },
    optionText: {
        fontFamily: FONTS.regular,
        fontSize: 16,
        color: color.black,
    },
    selectedOption: {
        backgroundColor: color.light_green,
        borderRadius: 5,
        paddingHorizontal: 20,
        marginVertical: 2,
    },
    selectedOptionText: {
        fontFamily: FONTS.semiBold,
        color: color.dark_green,
    },
});