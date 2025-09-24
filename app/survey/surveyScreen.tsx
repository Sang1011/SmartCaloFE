import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import SurveyLayout from "../survey/SurveyLayout";
// import Step10_ActivityLevel from "../components/survey/Step10_ActivityLevel";
// import Step11_Demographics from "../components/survey/Step11_Demographics";
// import Step12_Measurements from "../components/survey/Step12_Measurements";
// import Step13_AccountCreation from "../components/survey/Step13_AccountCreation";
// import Step14_Completion from "../components/survey/Step14_Completion";
import Step1_Name from "../survey/Step1_Name";
import Step2_Goals from "../survey/Step2_Goals";
import Step3_Info from "../survey/Step3_Info";
import Step4_Obstacles from "../survey/Step4_Obstacles";
import Step5_Info from "../survey/Step5_Info";
import Step6_Habits from "../survey/Step6_Habits";
import Step7_Info from "../survey/Step7_Info";
import Step8_PlanningFrequency from "../survey/Step8_PlanningFrequency";
// import Step9_Willingness from "../components/survey/Step9_Willingness";

const SURVEY_SCREENS = [
  Step1_Name,
  Step2_Goals,
  Step3_Info,
  Step4_Obstacles,
  Step5_Info,
  Step6_Habits,
  Step7_Info,
  Step8_PlanningFrequency,
  // Step9_Willingness,
  // Step10_ActivityLevel,
  // Step11_Demographics,
  // Step12_Measurements,
  // Step13_AccountCreation,
  // Step14_Completion,
];

export interface SurveyData {
  name?: string;
  goals?: string[];
  obstacles?: string[];
  eatingHabit?: string;
  healthyHabits?: string[];
  planningFrequency?: string[];
  willingness?: number;
  activityLevel?: string;
  gender?: "male" | "female";
  age?: string;
  height?: string;
  weight?: string;
  targetWeight?: string;
  email?: string;
  password?: string;
}

export default function SurveyScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [surveyData, setSurveyData] = useState<SurveyData>({ willingness: 3 });

  const totalSteps = SURVEY_SCREENS.length;

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
    console.log("Survey Data Submitted:", surveyData);
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
    backgroundColor: "#ffff",
  },
});
