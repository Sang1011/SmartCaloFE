import color from "@constants/color";
import { FONTS } from "@constants/fonts";
import { Ionicons } from "@expo/vector-icons";
import { navigateCustom } from "@utils/navigation";
import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { SafeAreaView } from "react-native-safe-area-context";

const downsampleData = (data, maxPoints = 50) => {
  const step = Math.ceil(data.length / maxPoints);
  return data.filter((_, index) => index % step === 0);
};

const formatDate = (date) => {
  const d = new Date(date);
  return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}`;
};


const weightData = [
  { value: 65.5, date: "2025-07-01" },
  { value: 65.2, date: "2025-07-15" },
  { value: 64.9, date: "2025-08-01" },
  { value: 64.6, date: "2025-08-15" },
  { value: 64.3, date: "2025-09-01" },
  { value: 64.0, date: "2025-09-15" },
  { value: 63.8, date: "2025-09-30" },
];

const heightData = [
  { value: 160, date: "2025-07-01" },
  { value: 160.1, date: "2025-07-15" },
  { value: 160.1, date: "2025-08-01" },
  { value: 160.2, date: "2025-08-15" },
  { value: 160.2, date: "2025-09-01" },
  { value: 160.3, date: "2025-09-15" },
  { value: 160.3, date: "2025-09-30" },
];

export default function BodyHistory() {
  // 🟩 Lấy ngày hiện tại
  const today = new Date();

  // 🟩 Tạo bản sao và trừ đi 7 ngày
  const lastWeek = new Date(today);
  lastWeek.setDate(today.getDate() - 7);

  const [startDate, setStartDate] = useState(lastWeek);
  const [endDate, setEndDate] = useState(today);
  const [timeRange, setTimeRange] = useState<"1w" | "1m" | "3m" | null>("1w");
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [selecting, setSelecting] = useState<"start" | "end">("start");

  const handleQuickRange = (range: "1w" | "1m" | "3m") => {
    setTimeRange(range);
    const now = new Date();
    const newEnd = now;
    let newStart;
    switch (range) {
      case "1w":
        newStart = new Date(now);
        newStart.setDate(now.getDate() - 7);
        break;
      case "1m":
        newStart = new Date(now);
        newStart.setMonth(now.getMonth() - 1);
        break;
      case "3m":
      default:
        newStart = new Date(now);
        newStart.setMonth(now.getMonth() - 3);
        break;
    }
    setStartDate(newStart);
    setEndDate(newEnd);
  };

  const handleConfirm = (date: Date) => {
    if (selecting === "start") {
      // Không cho phép start >= end
      if (date >= endDate) {
        alert("Ngày bắt đầu phải nhỏ hơn ngày kết thúc!");
        setDatePickerVisible(false);
        return;
      }
      setStartDate(date);
    } else {
      // Không cho phép end <= start
      if (date <= startDate) {
        alert("Ngày kết thúc phải lớn hơn ngày bắt đầu!");
        setDatePickerVisible(false);
        return;
      }
      setEndDate(date);
    }
    setDatePickerVisible(false);
    setTimeRange(null); 
  };

  const getFilteredData = (data) =>
    data
      .filter(
        (d) => new Date(d.date) >= startDate && new Date(d.date) <= endDate
      )
      .map((d) => ({
        value: d.value,
        label: formatDate(d.date),
      }));

  const filteredWeightData = useMemo(
    () => downsampleData(getFilteredData(weightData)),
    [startDate, endDate]
  );
  const filteredHeightData = useMemo(
    () => downsampleData(getFilteredData(heightData)),
    [startDate, endDate]
  );

  const renderChartOrEmpty = (data, title : string) => (
    <View style={styles.chartBox}>
      <Text style={styles.chartTitle}>{title}</Text>
      {data.length > 0 ? (
        <LineChart
          data={data}
          color={color.dark_green}
          thickness={3}
          curved
          hideDataPoints={false}
          yAxisColor={color.dark_green}
          xAxisColor={color.dark_green}
          initialSpacing={20}
          spacing={50}
          showValuesAsDataPointsText
          textColor={color.dark_green} // màu chữ
          textFontSize={12}
          dataPointsHeight={12}
        />
      ) : (
        <Text style={styles.noDataText}>
          Không có dữ liệu trong khoảng thời gian này
        </Text>
      )}
    </View>
  );

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={color.dark_green}
            onPress={() => navigateCustom("/bodyInfo")}
          />
          <Text style={styles.title}>Lịch sử thay đổi cơ thể</Text>
        </View>

        {/* Chọn khoảng thời gian */}
        <View style={styles.dateRangeBox}>
          <Pressable
            style={styles.dateButton}
            onPress={() => {
              setSelecting("start");
              setDatePickerVisible(true);
            }}
          >
            <Text style={styles.dateText}>Từ: {formatDate(startDate)}</Text>
          </Pressable>

          <Pressable
            style={styles.dateButton}
            onPress={() => {
              setSelecting("end");
              setDatePickerVisible(true);
            }}
          >
            <Text style={styles.dateText}>Đến: {formatDate(endDate)}</Text>
          </Pressable>
        </View>

        {/* Bộ chọn nhanh */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.rangeButtons}
        >
          {[
            { key: "1w", label: "1 Tuần gần nhất" },
            { key: "1m", label: "1 Tháng gần nhất" },
            { key: "3m", label: "3 Tháng gần nhất" },
          ].map((r) => (
            <Pressable
              key={r.key}
              style={[
                styles.rangeButton,
                timeRange === r.key && styles.rangeButtonActive,
              ]}
              onPress={() => handleQuickRange(r.key as "1w" | "1m" | "3m")}
            >
              <Text
                style={[
                  styles.rangeButtonText,
                  timeRange === r.key && styles.rangeButtonTextActive,
                ]}
              >
                {r.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Biểu đồ */}
        {renderChartOrEmpty(filteredWeightData, "Cân nặng (kg)")}
        {renderChartOrEmpty(filteredHeightData, "Chiều cao (cm)")}
      </ScrollView>

      {/* Modal chọn ngày */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={() => setDatePickerVisible(false)}
        date={selecting === "start" ? startDate : endDate}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.background, padding: 16 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  title: { fontSize: 18, fontFamily: FONTS.bold, color: color.dark_green },
  dateRangeBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  dateButton: {
    flex: 1,
    backgroundColor: color.white,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    elevation: 2,
    marginHorizontal: 4,
  },
  dateText: {
    fontFamily: FONTS.medium,
    color: color.dark_green,
  },
  rangeButtons: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 4,
    marginBottom: 12,
    gap: 4,
  },
  rangeButton: {
    borderWidth: 1,
    borderColor: color.dark_green,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 10,
  },
  rangeButtonActive: { backgroundColor: color.dark_green },
  rangeButtonText: {
    fontFamily: FONTS.medium,
    color: color.dark_green,
  },
  rangeButtonTextActive: { color: color.white },
  chartBox: {
    backgroundColor: color.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    minHeight: 180, // luôn có khung để bố cục không nhảy
    justifyContent: "center",
  },
  chartTitle: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: color.dark_green,
    marginBottom: 8,
  },
  noDataText: {
    textAlign: "center",
    fontFamily: FONTS.medium,
    color: "#888",
    marginTop: 30,
  },
});
