import Color from "@constants/color";
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

export default function TermsScreen() {
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
        <Text style={styles.headerTitle}>Điều khoản sử dụng</Text>
        <View style={{ width: scale(22) }} /> {/* placeholder để căn giữa */}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.paragraph}>
          Ứng dụng <Text style={styles.bold}>SmartCalo</Text> được phát triển
          nhằm hỗ trợ người dùng theo dõi dinh dưỡng, quản lý bữa ăn và cải
          thiện lối sống lành mạnh. Việc tải và sử dụng ứng dụng này đồng nghĩa
          với việc bạn đã đọc, hiểu và đồng ý với các điều khoản dưới đây.
        </Text>

        <Text style={styles.sectionTitle}>1. Tải xuống và cài đặt</Text>
        <Text style={styles.paragraph}>
          Ứng dụng SmartCalo được cung cấp miễn phí trên trang web chính thức:{"\n"}
          <Text style={styles.bold}>https://smartcalo-landingpage.vercel.app/</Text>{"\n"}
          Khi tải xuống và cài đặt ứng dụng từ trang này, bạn xác nhận rằng:
          {"\n"}- Bạn hiểu rõ nguồn tải là từ nhà phát triển chính thức.
          {"\n"}- Chúng tôi không chịu trách nhiệm nếu bạn tải ứng dụng từ
          nguồn không đáng tin cậy dẫn đến lỗi hoặc mất dữ liệu.
        </Text>

        <Text style={styles.sectionTitle}>2. Tài khoản người dùng</Text>
        <Text style={styles.paragraph}>
          Khi đăng ký, bạn cần cung cấp thông tin chính xác và chịu trách nhiệm
          bảo mật tài khoản. Nếu phát hiện hoạt động bất thường, hãy liên hệ đội
          ngũ hỗ trợ của SmartCalo để được giúp đỡ.
        </Text>

        <Text style={styles.sectionTitle}>3. Quyền và trách nhiệm</Text>
        <Text style={styles.paragraph}>
          - Không sử dụng ứng dụng cho mục đích vi phạm pháp luật hoặc phát tán
          nội dung độc hại.{"\n"}- Không can thiệp hoặc chỉnh sửa mã nguồn của
          ứng dụng.{"\n"}- Người dùng chịu trách nhiệm với toàn bộ dữ liệu và
          thông tin đã nhập trong ứng dụng.
        </Text>

        <Text style={styles.sectionTitle}>4. Gói dịch vụ</Text>
        <Text style={styles.paragraph}>
          SmartCalo cung cấp hai gói dịch vụ:
          {"\n"}{"\n"}
          <Text style={styles.bold}>• Gói FREE</Text> — Bao gồm các tính năng cơ
          bản như:
          {"\n"}- Nhận diện thức ăn (3 lần/ngày)
          {"\n"}- Theo dõi BMI/BMR/TDEE
          {"\n"}- Tập luyện thể thao
          {"\n"}- Thực đơn cơ bản, ghi nhật ký ăn uống, tra cứu món ăn
          {"\n"}- Kiểm tra điểm danh hàng ngày
          {"\n"}- Ghi lại lịch sử thay đổi cân nặng và chiều cao
          {"\n"}{"\n"}
          <Text style={styles.bold}>• Gói PREMIUM</Text> — Mở khóa thêm các
          tính năng nâng cao:
          {"\n"}- Nhận diện thức ăn không giới hạn
          {"\n"}- Áp dụng thực đơn và tạo thực đơn tùy chỉnh theo cá nhân
          {"\n"}- AI Chatbox tư vấn chế độ ăn
          {"\n"}- Xem chi tiết dinh dưỡng của của bữa ăn đã ghi
          {"\n"}{"\n"}
          Mọi thanh toán hoặc nâng cấp được thực hiện trực tiếp qua hệ thống của ứng dụng
          SmartCalo, không thông qua App Store hoặc Google Play. Sau
          khi kích hoạt gói PREMIUM, khoản phí sẽ không được hoàn lại.
        </Text>

        <Text style={styles.sectionTitle}>5. Quyền chấm dứt sử dụng</Text>
        <Text style={styles.paragraph}>
          SmartCalo có quyền tạm ngưng hoặc khóa tài khoản nếu phát hiện hành vi
          vi phạm điều khoản, gian lận thanh toán hoặc gây ảnh hưởng đến cộng
          đồng người dùng khác.
        </Text>

        <Text style={styles.sectionTitle}>6. Bảo mật & dữ liệu</Text>
        <Text style={styles.paragraph}>
          Chúng tôi cam kết không chia sẻ thông tin cá nhân của bạn với bên thứ
          ba khi chưa có sự đồng ý. Mọi dữ liệu được lưu trữ an toàn trên hệ
          thống máy chủ được bảo mật.
        </Text>

        <Text style={styles.sectionTitle}>7. Liên hệ hỗ trợ</Text>
        <View
          style={{
            justifyContent: "flex-start",
            alignItems: "center",
            flexDirection: "row",
            gap: 8,
          }}
        >
          <Fontisto name="email" size={22} color={Color.black} />
          <Text style={styles.paragraph}>Email: pentasmartcalo@gmail.com</Text>
        </View>

        <Text
          style={{
            color: Color.black_40,
            width: "100%",
            marginTop: 15,
            fontSize: scale(12),
          }}
        >
          Cập nhật lần cuối: 27/10/2025
        </Text>
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
    color: Color.gray_dark,
    lineHeight: scale(19),
  },
  bold: {
    fontFamily: FONTS.semiBold,
    color: Color.black,
  },
});
