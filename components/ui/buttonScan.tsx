import { Pressable, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import color from "@constants/color";

interface ButtonScanProps {
    onPress: () => void;
}

export default function ButtonScan({ onPress }: ButtonScanProps) {
    return(
        <Pressable style={styles.button} onPress={onPress}>
            <LinearGradient
                colors={[color.scan_button_outer_top, color.scan_button_outer_bottom]}
                style={styles.gradientOuter}
            />
            <View style={styles.white}>
                <LinearGradient
                colors={[color.scan_button_inner_left, color.scan_button_inner_right]}
                style={styles.gradientInner}
                start={{ x: 0, y: 0 }}        
                end={{ x: 1, y: 0 }}
            />
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        width: 64,
        height: 64,
        position: "relative",
    },
    gradientOuter: {
        flex: 1,
        borderRadius: 9999,
    },
    white: {
        position: "absolute",
        width: 56,
        height: 56,
        top: 28,
        left: 28,
        borderRadius: 9999,
        backgroundColor: color.white,
        transform: [{ translateX: -24 }, { translateY: -24 }],
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    gradientInner : {
        width: "90%",
        height: "90%",
        borderRadius: 9999,
    }
})