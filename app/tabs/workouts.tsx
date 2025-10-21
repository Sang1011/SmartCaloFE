import ExerciseCard from "@components/ui/excerciseCard";
import color from "@constants/color";
import { FONTS } from "@constants/fonts";
import { fetchAllPrograms } from "@features/programs";
import { RootState } from "@redux";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { navigateCustom } from "@utils/navigation";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type WorkoutDataType = {
  title: string;
  info: string;
  totalProgress: number;
  image: any;
};

export default function Workout() {
  const [workoutList, setWorkoutList] = useState<WorkoutDataType[]>([]);
  const dispatch = useAppDispatch();

  // Select the necessary state from the Redux store
  const { allPrograms, loading, error } = useAppSelector(
    (state: RootState) => state.program
  );

  // Fetch the data when the component mounts
  useEffect(() => {
    // Dispatch the async thunk to fetch all programs
    dispatch(fetchAllPrograms());
  }, [dispatch]); // Dependency array to run once

  // --- Render Logic ---

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
    <SafeAreaView style={{ flex: 1 }}>
      {loading ? (
        // ✅ Hiển thị loading khi đang tải
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={color.dark_green} />
          <Text style={styles.loadingText}>Đang tải danh sách luyện tập...</Text>
        </View>
      ) : (
        <>
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.headerText}>Luyện tập</Text>
          </View>

          {/* DANH SÁCH */}
          <ScrollView contentContainerStyle={{ padding: 16 }}>
            {allPrograms.map((item) => (
              <ExerciseCard
                key={item.id}
                des={item.description}
                title={item.name}
                notHaveProgress={true}
                image={item.imageUrl}
                onPress={() => {
                  navigateCustom("/schedule", {
                    params: {
                      programId: item.id,
                      imageUrl: item.imageUrl,
                    },
                  });
                }}
              />
            ))}
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 16,
    backgroundColor: color.white,
    alignItems: "center",
    justifyContent: "center",
    borderBottomColor: color.border,
    borderBottomWidth: 1,
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
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
});
