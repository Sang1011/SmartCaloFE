import { Text, Button, View } from "react-native";
import { saveBooleanData } from "../../stores";
import { HAS_OPENED_APP, IS_LOGGED_IN } from "../../constants/app";
import { router } from "expo-router";

export default function SurveyScreenStep1() {
  // sang intro
  const goToIntro = async () => {
    await saveBooleanData(HAS_OPENED_APP, false); // reset flag
    router.replace("/introScreen");
  };

  // sang welcome
  const goToWelcome = async () => {
    await saveBooleanData(HAS_OPENED_APP, true);
    router.replace("/welcomeScreen");
  };

  // sang login
  const goToLogin = async () => {
    await saveBooleanData(IS_LOGGED_IN, false); // giả sử logout
    router.replace("/login");
  };

  // sang scan
  const goToScan = async () => {
    await saveBooleanData(IS_LOGGED_IN, false);
    router.replace("/scan");
  };

  return (
    <View>
      <Text>SurveyScreenStep1</Text>
      <Button title="Đi Intro" onPress={goToIntro} />
      <Button title="Đi Welcome" onPress={goToWelcome} />
      <Button title="Đi Login" onPress={goToLogin} />
      <Button title="Đi Scan" onPress={goToScan} />
    </View>
  );
}
