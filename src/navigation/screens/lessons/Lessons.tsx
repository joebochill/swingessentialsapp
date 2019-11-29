import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Icon, ListItem } from 'react-native-elements';
import { wrapIcon } from '@pxblue/react-native-components';
import { VideoCard, SEHeader } from '../../../components';
import { ScrollView } from 'react-native-gesture-handler';
import { purple } from '../../../styles/colors';
import bg from '../../../images/bg.jpg';
import { withNavigation } from 'react-navigation';
import { ROUTES } from '../../../constants/routes';
const MoreIcon = wrapIcon({ IconClass: Icon, name: 'more-vert' });

export const Lessons = withNavigation(props => {
    return (
        <View style={styles.container}>
            <SEHeader
                expandable
                backgroundImage={bg}
                startExpanded={true}
                title={'Your Lessons'}
                subtitle={"...see how far you've come"}
                actionItems={[{ icon: MoreIcon, onPress: () => { } }]}
            />
            <ScrollView contentContainerStyle={{ padding: 16 }}>
                {[1, 2 , 3].map((item, ind) => (
                    <VideoCard
                        key={`lessonCard_${ind}`}
                        // headerColor={'transparent'}
                        // headerFontColor={purple[800]}
                        headerTitle={'06/25/2019'}
                        headerSubtitle={'In-Person Lesson'}
                        style={{ marginBottom: 16 }}
                        video={"l3Y3iJa6DvE"}
                        onExpand={() => props.navigation.push(ROUTES.LESSON)}
                        // hiddenContent={<ListItem title={'View Details'} chevron topDivider containerStyle={{paddingVertical: 0}} contentContainerStyle={{height: 56}} />}
                    />
                ))}
                <SafeAreaView />
            </ScrollView>
        </View>
    )
});
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
