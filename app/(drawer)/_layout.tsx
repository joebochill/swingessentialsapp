import { DrawerContent } from '@/navigation/DrawerContent';
import { width } from '@/utilities/dimensions';
import { Drawer } from 'expo-router/drawer';

export default function DrawerLayout() {
    return (
        <Drawer
            screenOptions={{
                headerShown: false,
                drawerType: 'slide',
                swipeEdgeWidth: 64,
                drawerStyle: {
                    width: width * 0.9,
                },
            }}
            drawerContent={(props) => <DrawerContent {...props} />}
        >
            <Drawer.Screen name="(screens)" />
        </Drawer>
    );
}
