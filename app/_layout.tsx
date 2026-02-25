import { Stack } from "expo-router";

const RootLayout = () => {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="loginTwo" options={{ headerShown: false }} />
            <Stack.Screen name="register" options={{ headerShown: false }} />
            <Stack.Screen name="registerTwo" options={{ headerShown: false }} />
            <Stack.Screen name="homepage" options={{ headerShown: false }} />
            <Stack.Screen name="homepageTwo" options={{ headerShown: false }}   />
        </Stack>
    )
}

export default RootLayout;