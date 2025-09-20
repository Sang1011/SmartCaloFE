import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import Color from "@constants/color";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export const UserTab = ({ isActive } : { isActive: boolean }) => {
    return (
        <>
        {isActive ? (
            <FontAwesome name="user" size={24} color={Color.dark_green} />
        ) : (
            <FontAwesome name="user-o" size={24} color={Color.grey} />
        )}
        </>
    )
};

export const LogTab = ({ isActive } : { isActive: boolean }) => {
    return (
        <>
        {isActive ? (
            <MaterialCommunityIcons name="home" size={24} color={Color.dark_green} />
        ) : (
            <MaterialCommunityIcons name="home-outline" size={24} color={Color.grey} />
        )}
        </>
    )
};

export const MenuTab = ({ isActive } : { isActive: boolean }) => {
    return (
        <>
        {isActive ? (
            <MaterialCommunityIcons name="book" size={24} color={Color.dark_green} />
        ) : (
            <MaterialCommunityIcons name="book-outline" size={24} color={Color.grey} />
        )}
        </>
    )
};

export const BetweenTab = ({ isActive } : { isActive: boolean }) => {
    return (
        <>
        {isActive ? (
            <Ionicons name="close-sharp" size={24} color={Color.white} />
        ) : (
            <Ionicons name="menu-sharp" size={24} color={Color.white} />
        )}
        </>
    )
};


export const ExploreTab = ({ isActive } : { isActive: boolean }) => {
    return (
        <>
        {isActive ? (
            <MaterialIcons name="auto-graph" size={24} color={Color.dark_green} />
        ) : (
            <MaterialIcons name="auto-graph" size={24} color={Color.grey} />
        )}
        </>
    )
};