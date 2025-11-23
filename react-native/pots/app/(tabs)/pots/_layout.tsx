import { Stack } from 'expo-router'

export default function PotsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="create" />
      <Stack.Screen name="[id]" />
    </Stack>
  )
}

