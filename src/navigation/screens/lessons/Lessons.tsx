import * as React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Button, Icon, ListItem } from 'react-native-elements';
import { Header } from '@pxblue/react-native-components';
import { EmptyState, wrapIcon, ScoreCard, Body } from '@pxblue/react-native-components';
import { withNavigation } from 'react-navigation';
import { ROUTES } from '../../../constants/routes';
import topology from '../../../images/bg.jpg';

import YouTube from 'react-native-youtube';
import { ScrollView } from 'react-native-gesture-handler';
// import * as Colors from '@pxblue/colors';
const MenuIcon = wrapIcon({ IconClass: Icon, name: 'menu' });
const FullscreenIcon = wrapIcon({ IconClass: Icon, name: 'open-in-new' });
const MoreIcon = wrapIcon({ IconClass: Icon, name: 'more-vert' });

export const Lessons = withNavigation(props => (
    <View style={styles.container}>
        <Header
            expandable
            startExpanded={true}
            navigation={{ icon: MenuIcon, onPress: () => props.navigation.openDrawer() }}
            title={'Your Lessons'}
            backgroundImage={topology}
            subtitle={"...see how far you've come"}
            actionItems={[
                { icon: MoreIcon, onPress: () => { } }
            ]}
        />
        <ScrollView contentContainerStyle={{ padding: 16 }}>
            {[1, 2, 3, 4, 5].map((item, ind) => (
                <ScoreCard
                    key={`lessonCard_${ind}`}
                    headerTitle={'Avoiding the Slice'}
                    headerSubtitle={'06/25/2019'}
                    headerInfo={'In-Person Lesson'}
                    style={{marginBottom: 16}}
                    actionItems={[
                        { icon: FullscreenIcon, onPress: () => { } }
                    ]}
                >
                    <YouTube
                        videoId="l3Y3iJa6DvE" // The YouTube video ID
                        play={false}             // control playback of video with true/false
                        fullscreen={false}       // control whether the video should play in fullscreen or inline
                        loop={false}             // control whether the video should loop when ended
                        showinfo={false}
                        modestbranding={true}
                        controls={2}
                        rel={false}
                        style={{ width: 382, height: 215, margin: -16 }}
                    />
                </ScoreCard>
            ))}
            <SafeAreaView />
        </ScrollView>
    </View>
));
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
