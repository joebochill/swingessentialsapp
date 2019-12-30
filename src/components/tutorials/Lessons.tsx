import React, { useState } from 'react';

import { View, SectionList } from 'react-native';
import { Icon } from 'react-native-elements';

import { H7, H4, Body } from '../index';
import { TutorialModal } from './';
import { sharedStyles } from '../../styles';
import { sizes, spaces, unit } from '../../styles/sizes';
import { ListItem } from 'react-native-elements';
import { getLongDate, getDate } from '../../utilities';
import { useTheme } from '../../styles/theme';

import Carousel, { Pagination } from 'react-native-snap-carousel';
import { width } from '../../utilities/dimensions';
import { SEButton } from '../SEButton';
import { whiteOpacity } from '../../styles/colors';

const sections = [
    {
        bucketName: getLongDate(Date.now()),
        data: [
            {
                date: getDate(Date.now()),
                new: true
            },
            {
                date: getDate(Date.now() - 24 * 60 * 60 * 1000),
                new: false
            }
        ],
    }
]

export const LessonsTutorial = props => {
    const [page, setPage] = useState(0);
    const theme = useTheme();

    const slides = [
        (
            <View>
                <H4 font={'semiBold'} style={{ textAlign: 'center', color: theme.colors.onPrimary[50] }}>{'Welcome to Swing Essentials™!'}</H4>
                <H7 font={'light'} style={{ textAlign: 'center', marginTop: spaces.small, color: theme.colors.onPrimary[50] }}>When you have submitted your golf swing for analysis, your lessons will appear in this list.</H7>
                <SectionList
                    style={{ marginTop: spaces.large }}
                    scrollEnabled={false}
                    renderSectionHeader={({ section: { bucketName, index } }) => (
                        <H7 style={{ color: theme.colors.onPrimary[50], marginBottom: spaces.xSmall }}>{bucketName}</H7>
                    )}
                    sections={sections}
                    renderItem={({ item, index }) =>
                        (
                            <ListItem
                                containerStyle={sharedStyles.listItem}
                                contentContainerStyle={sharedStyles.listItemContent}
                                bottomDivider
                                topDivider={index === 0}
                                title={<Body>{item.date}</Body>}
                                rightTitle={item.new ? <H7>NEW</H7> : undefined}
                                rightIcon={{
                                    name: 'chevron-right',
                                    color: theme.colors.text[500],
                                    size: sizes.small
                                }}
                            />
                        )
                    }
                    keyExtractor={(item): string => 'complete_' + item.date}
                />
            </View>
        ),
        (
            <View>
                <H4 font={'semiBold'} style={{ textAlign: 'center', color: theme.colors.onPrimary[50] }}>{'Sign Up Today'}</H4>
                <H7 font={'light'} style={{ textAlign: 'center', marginTop: spaces.small, color: theme.colors.onPrimary[50] }}>You can sign in or register for an account by clicking the account icon in the header.</H7>
                <Icon name='person' color={'white'} size={sizes.xLarge} containerStyle={{ marginVertical: spaces.large }} />
                <SEButton
                    title="GOT IT"
                    containerStyle={{ flex: 1 }}
                    buttonStyle={{ backgroundColor: theme.colors.primary[500] }}
                // onPress={() => this.props.close()}
                />
            </View>
        )
    ];
    return (
        <TutorialModal
            visible={true}
            onClose={() => { }}
        >
            <>
                <Carousel
                    data={slides}
                    renderItem={({ item, index }) => slides[index]}
                    sliderWidth={width}
                    itemWidth={width - 2 * spaces.medium}
                    onSnapToItem={(index) => setPage(index)}
                />
                <Pagination
                    dotsLength={slides.length}
                    activeDotIndex={page}
                    dotStyle={{
                        width: unit(10),
                        height: unit(10),
                        borderRadius: unit(10),
                        marginHorizontal: 0,
                        backgroundColor: whiteOpacity(0.9)
                    }}
                    inactiveDotOpacity={0.5}
                    inactiveDotScale={0.8}
                />
            </>
        </TutorialModal>
    )
};