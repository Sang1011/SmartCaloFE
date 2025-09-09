import { StyleSheet, Text, View } from "react-native";

export default function SCCarousel(){
    return (
        <View style={styles.container}>
            <Text>Carousel</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
});