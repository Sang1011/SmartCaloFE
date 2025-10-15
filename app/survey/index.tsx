import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

import { HAS_DONE_SURVEY } from "@constants/app";
import { RootState } from "@redux";
import { navigateCustom } from "@utils/navigation";
import Step10_ActivityLevel from "../survey/Step10_ActivityLevel";
import Step11_Demographics from "../survey/Step11_Demographics";
import Step12_Measurements from "../survey/Step12_Measurements";
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
  Step13_Completion,
];

export interface SurveyData {
  name?: string;
  goals?: string[];
  obstacles?: string[];
  eatingHabit?: string;
  healthyHabits?: string[];
  planningFrequency?: string;
  willingness?: string;
  activityLevel?: string;
  gender?: "male" | "female" | "other";
  age?: number;
  height?: number;
  weight?: number;
  targetWeight?: string;
}

const isNextButtonDisabled = (stepIndex: number, data: SurveyData): boolean => {
  switch (stepIndex) {
    case 0:
      return !data.name?.trim();
    case 1:
      return !data.goals || data.goals.length === 0;
    case 3:
      return !data.obstacles || data.obstacles.length === 0;
    case 5:
      return !data.healthyHabits || data.healthyHabits.length === 0;
    case 7:
      return !data.planningFrequency?.trim();
    case 8:
      return !data.willingness?.trim();
    case 9:
      return !data.activityLevel?.trim();
    case 10:
      return !data.age || !data.gender?.trim();
    case 11:
      return !data.height || !data.weight;
    default:
      return false;
  }
};

export default function SurveyScreen() {
  const user = useSelector((state: RootState) => state.auth.user);

  const [currentStep, setCurrentStep] = useState(0);
  const [surveyData, setSurveyData] = useState<SurveyData>({}); 
  const totalSteps = SURVEY_SCREENS.length;

  useEffect(() => {
    if (user?.name) {
      setSurveyData((prev) => ({ ...prev, name: user.name }));
      setCurrentStep(1);
    }
  }, [user]);

  const isNextDisabled = isNextButtonDisabled(currentStep, surveyData);

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    navigateCustom("/tabs", { flagKey: HAS_DONE_SURVEY });
  };

  const CurrentStepComponent = SURVEY_SCREENS[currentStep];

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
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
        />
      </SurveyLayout>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },
});