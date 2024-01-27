import { StackScreenProps } from "@react-navigation/stack";

export type RootStackParamList = {
    // '@ROUTE_GROUP/APP': undefined;
    // '@ROUTE/HOME': undefined,
    APP_GROUP: undefined,
    Home: undefined,
    Profile: { userId: string };
    Feed: { sort: 'latest' | 'top' } | undefined;
};

export type HomeScreenProps = StackScreenProps<RootStackParamList, 'Home'>;



// export type RootStackScreenProps<T extends keyof RootStackParamList> =
//     StackScreenProps<RootStackParamList, T>;

// export type HomeScreenProps = RootStackScreenProps<'@ROUTE/HOME'>;

export type Routes = {
    [key: string]: keyof RootStackParamList;
};

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList { }
    }
}