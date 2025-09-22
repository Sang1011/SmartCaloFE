import SCScan from "@components/ui/SCScan";
import { SafeAreaView } from "react-native";

export default function Scan(){
    return(
        <SafeAreaView style={{ flex: 1 }}>
            <SCScan />
        </SafeAreaView>
    )
}