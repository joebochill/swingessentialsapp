import { View } from "react-native"
import { Text } from "react-native-paper";
import { HomeScreenProps } from "../navigation/navigation.types";
import { useGetLessonsQuery } from "../api/services/lessonsService";


export const HomeScreen: React.FC<HomeScreenProps> = (props) => {
    // Using a query hook automatically fetches data and returns query values
    const { data, error, isLoading } = useGetLessonsQuery();
    // Individual hooks are also accessible under the generated endpoints:
    // const { data, error, isLoading } = pokemonApi.endpoints.getPokemonByName.useQuery('bulbasaur')

    return (
        <View>
            <Text>Swing Essentials Home</Text>
            <Text>{`Loading: ${isLoading}`}</Text>
            <Text>{`Error: ${error}`}</Text>
            <Text>{`Data: Pending(${data?.pending.length}), Closed(${data?.closed.length})`}</Text>

        </View>
    )
}