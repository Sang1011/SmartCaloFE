import { default as color, default as Color } from "@constants/color";
import { FONTS } from "@constants/fonts";
import { Ionicons } from "@expo/vector-icons";
import Fontisto from "@expo/vector-icons/Fontisto";
import { navigateCustom } from "@utils/navigation";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { scale } from "react-native-size-matters";

export default function PrivacyScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* 🔙 Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigateCustom("/tabs/profile")}>
          <Ionicons
            name="arrow-back"
            size={scale(22)}
            color={Color.dark_green}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chính sách quyền riêng tư</Text>
        <View style={{ width: scale(22) }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.paragraph}>
          Ứng dụng <Text style={styles.bold}>SmartCalo</Text> tôn trọng và cam
          kết bảo vệ quyền riêng tư của người dùng. Chính sách này mô tả cách
          chúng tôi thu thập, sử dụng và bảo mật thông tin cá nhân của bạn.
        </Text>

        <Text style={styles.sectionTitle}>1. Thông tin được thu thập</Text>
        <Text style={styles.paragraph}>
          Chúng tôi có thể thu thập các loại thông tin sau:{"\n"}- Họ tên, địa
          chỉ email, và thông tin đăng nhập.{"\n"}- Dữ liệu dinh dưỡng, cân
          nặng, chiều cao, và mục tiêu sức khỏe.{"\n"}- Thông tin thiết bị và
          hoạt động sử dụng ứng dụng.
        </Text>

        <Text style={styles.sectionTitle}>2. Mục đích sử dụng thông tin</Text>
        <Text style={styles.paragraph}>
          Thông tin thu thập được dùng để:{"\n"}- Cung cấp, duy trì và cải thiện
          trải nghiệm người dùng.{"\n"}- Cá nhân hóa gợi ý thực đơn và kế hoạch
          dinh dưỡng.{"\n"}- Gửi thông báo liên quan đến tài khoản hoặc cập nhật
          dịch vụ.
        </Text>

        <Text style={styles.sectionTitle}>3. Bảo mật dữ liệu</Text>
        <Text style={styles.paragraph}>
          SmartCalo áp dụng các biện pháp kỹ thuật để bảo vệ dữ liệu khỏi truy
          cập, sửa đổi hoặc tiết lộ trái phép. Tuy nhiên, không có phương thức
          truyền dữ liệu nào qua Internet hoàn toàn an toàn, và chúng tôi không
          thể đảm bảo tuyệt đối.
        </Text>

        <Text style={styles.sectionTitle}>4. Quyền của người dùng</Text>
        <Text style={styles.paragraph}>
          Bạn có quyền yêu cầu truy cập, chỉnh sửa hoặc xóa dữ liệu cá nhân của
          mình bất kỳ lúc nào. Vui lòng gửi yêu cầu qua email hỗ trợ của chúng
          tôi để được xử lý.
        </Text>

        <Text style={styles.sectionTitle}>5. Thay đổi chính sách</Text>
        <Text style={styles.paragraph}>
          Chính sách này có thể được cập nhật định kỳ. Mọi thay đổi sẽ được
          thông báo trong ứng dụng hoặc qua email trước khi áp dụng.
        </Text>

        <Text style={styles.sectionTitle}>6. Liên hệ</Text>
        <Text style={styles.paragraph}>
          Nếu bạn có câu hỏi liên quan đến quyền riêng tư, vui lòng liên hệ:
        </Text>
        <View
          style={{
            justifyContent: "flex-start",
            alignItems: "center",
            flexDirection: "row",
            gap: 8
          }}
        >
          <Fontisto name="email" size={24} color="black" />
          <Text>Email: pentasmartcalo@gmail.com</Text>
        </View>
        <Text style={{color: color.black_40, width: "100%", marginTop: 15}}>Cập nhật lần cuối: 27/10/2025</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(20),
    paddingVertical: scale(15),
    borderBottomWidth: 1,
    borderBottomColor: Color.gray_light,
  },
  headerTitle: {
    fontSize: scale(16),
    fontFamily: FONTS.semiBold,
    color: Color.dark_green,
  },
  content: {
    padding: scale(20),
    paddingBottom: scale(40),
  },
  sectionTitle: {
    fontSize: scale(16),
    fontFamily: FONTS.semiBold,
    color: Color.black,
    marginTop: scale(15),
    marginBottom: scale(5),
  },
  paragraph: {
    fontSize: scale(13),
    fontFamily: FONTS.regular,
    color: Color.black_70,
    lineHeight: scale(19),
  },
  bold: {
    fontFamily: FONTS.semiBold,
    color: Color.black,
  },
});
