import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import color from "@constants/color";
import { updateProfileThunk } from "@features/users";
import { useAppDispatch } from "@redux/hooks";
import { navigateCustom } from "@utils/navigation";

import { globalStyles } from "@constants/fonts";
import {
  ActivityLevel,
  Gender,
  HealthGoal,
  UpdateProfileDto,
} from "../../types/me";
import Step10_ActivityLevel from "../survey/Step10_ActivityLevel";
import Step11_Demographics from "../survey/Step11_Demographics";
import Step12_Measurements from "../survey/Step12_Measurements";
import Step12a_TargetMonths from "../survey/Step12a_TargetMonths";
import Step13_Completion from "../survey/Step13_Completion";
import Step1_Name from "../survey/Step1_Name";
import Step2_Goals from "../survey/Step2_Goals";
import Step3_Info from "../survey/Step3_Info";
import Step4_Obstacles from "../survey/Step4_Obstacles";
import Step5_Info from "../survey/Step5_Info";
import Step6_Habits from "../survey/Step6_Habits";
import Step7_Info from "../survey/Step7_Info";
import Step8_PlanningFrequency from "../survey/Step8_PlanningFrequency";
import Step9_Willingness from "../survey/Step9_Willingness";
import SurveyLayout from "../survey/SurveyLayout";

const SURVEY_SCREENS = [
  Step1_Name,
  Step2_Goals,
  Step3_Info,
  Step4_Obstacles,
  Step5_Info,
  Step6_Habits,
  Step7_Info,
  Step8_PlanningFrequency,
  Step9_Willingness,
  Step10_ActivityLevel,
  Step11_Demographics,
  Step12_Measurements,
  Step12a_TargetMonths, // Bước mới thêm
  Step13_Completion,
];

export interface SurveyData {
  name: string;
  goal: HealthGoal;
  obstacles?: string[];
  eatingHabit?: string;
  healthyHabits?: string[];
  planningFrequency?: string;
  willingness?: string;
  activityLevel: ActivityLevel;
  targetMonths: number;
  gender: Gender;
  age: number;
  height: number;
  weight: number;
  targetWeight: number;
}

const isNextButtonDisabled = (stepIndex: number, data: SurveyData): boolean => {
  switch (stepIndex) {
    case 0:
      return !data.name?.trim();
    case 1:
      return false;
    case 3:
      return !data.obstacles || data.obstacles.length === 0;
    case 5:
      return !data.healthyHabits || data.healthyHabits.length === 0;
    case 7:
      return !data.planningFrequency?.trim();
    case 8:
      return !data.willingness?.trim();
    case 9:
      return false;
    case 10:
      return false;
    case 11:
      return false;
    case 12:
      return false;
    default:
      return false;
  }
};

export default function SurveyScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [surveyData, setSurveyData] = useState<SurveyData>({
    name: "",
    age: 18,
    height: 150,
    weight: 50,
    gender: Gender.Male,
    activityLevel: 0,
    targetWeight: 50,
    targetMonths: 2,
    goal: 0,
  });
  const totalSteps = SURVEY_SCREENS.length;

  const isNextDisabled = isNextButtonDisabled(currentStep, surveyData);
  const [loading, setLoading] = useState(true);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500); // giả lập loading 2.5s
    return () => clearTimeout(timer);
  }, []);

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleUpdateUser = async () => {
    const objectSend: UpdateProfileDto = {
      name: surveyData.name,
      age: surveyData.age,
      height: surveyData.height,
      weight: surveyData.weight,
      startWeight: surveyData.weight,
      targetWeight: surveyData.targetWeight,
      targetMonths: surveyData.targetMonths,
      goal: surveyData.goal,
      gender: surveyData.gender,
      activityLevel: surveyData.activityLevel,
    };

    const result = await dispatch(updateProfileThunk(objectSend));

    if (updateProfileThunk.rejected.match(result)) {
      Alert.alert("Đã có lỗi xảy ra");
      navigateCustom("/login");
    } else {
      navigateCustom("/tabs");
    }
  };

  const handleFinish = () => {
    setLoading(true);
    handleUpdateUser();
  };

  const validateTargetWeight = (data: SurveyData) => {
    const { goal, weight, targetWeight } = data;
    if (!weight || !targetWeight) return true;
  
    if (goal === HealthGoal.LoseWeight) return targetWeight < weight;
    if (goal === HealthGoal.GainWeight) return targetWeight > weight;
    return true;
  };
  
  const isTargetValid = validateTargetWeight(surveyData);

  const CurrentStepComponent = SURVEY_SCREENS[currentStep];

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={color.dark_green || "#6C9C39"} />
          <Text style={[styles.loadingText, globalStyles.semiBold]}>
            Đang tải dữ liệu...
          </Text>
        </View>
      ) : (
        <SurveyLayout
          currentStep={currentStep + 1}
          totalSteps={totalSteps}
          onBack={handleBack}
          onNext={handleNext}
          isFinalStep={currentStep === totalSteps - 1}
          isNextDisabled={isNextDisabled}
        >
          <CurrentStepComponent
            surveyData={surveyData}
            updateSurveyData={setSurveyData}
            isTargetValid={isTargetValid}
          />
        </SurveyLayout>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
});