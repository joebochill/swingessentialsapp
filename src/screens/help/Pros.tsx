import * as React from 'react';

// Components
import { Image, TouchableHighlight, View } from 'react-native';
import { CollapsibleHeaderLayout, Typography } from '../../components';

// Styles
import { useSharedStyles, useFlexStyles } from '../../styles';
import { useTheme } from 'react-native-paper';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/MainNavigator';
import { useSelector } from 'react-redux';
import { ApplicationState, Pro } from '../../__types__';
import { width } from '../../utilities/dimensions';
import { splitParagraphs } from '../../utilities';

export const Pros: React.FC<StackScreenProps<RootStackParamList, 'About'>> = (props) => {
    const theme = useTheme();
    const sharedStyles = useSharedStyles(theme);
    const flexStyles = useFlexStyles(theme);

    const prosList = useSelector((state: ApplicationState) => state.pros.prosList);

    return (
        <CollapsibleHeaderLayout
            title={'Meet Our Pros'}
            subtitle={'The folks behind the magic'}
            navigation={props.navigation}
        >
            <View style={flexStyles.paddingHorizontal}>
                {prosList.map((pro: Pro, proInd: number) => (
                    <View
                        key={`pro_${pro.id}`}
                        style={{
                            alignSelf: 'center',
                            // marginTop: proInd === 0 ? theme.spaces.medium : theme.spaces.xLarge,
                            // marginBottom: proInd === prosList.length - 1 ? 0 : theme.spaces.xLarge,
                        }}
                    >
                        <TouchableHighlight
                            underlayColor={theme.colors.onPrimary}
                            onPress={(): void => {}}
                            style={{
                                width: width / 2,
                                height: width / 2,
                                maxWidth: 200,
                                maxHeight: 200,
                                alignSelf: 'center',
                                borderRadius: width / 4,
                                overflow: 'hidden',
                                backgroundColor: theme.colors.surface,
                            }}
                        >
                            <Image
                                source={{
                                    uri: pro.image.startsWith('http')
                                        ? pro.image
                                        : `https://www.swingessentials.com/images/pros/${pro.image}`,
                                }}
                                style={{ width: '100%', height: '100%' }}
                            />
                        </TouchableHighlight>
                        <Typography
                            fontWeight={'semiBold'}
                            color={'primary'}
                            style={{
                                textAlign: 'center',
                                // marginTop: theme.spaces.medium,
                                // marginBottom: pro.title ? 0 : theme.spaces.medium,
                            }}
                        >
                            {pro.name}
                        </Typography>
                        {pro.title ? (
                            <Typography
                                fontWeight={'light'}
                                color={'primary'}
                                style={{
                                    textAlign: 'center',
                                    // marginBottom: theme.spaces.medium,
                                }}
                            >
                                {pro.title}
                            </Typography>
                        ) : null}

                        {splitParagraphs(pro.bio).map((p, ind) => (
                            <Typography key={`${pro.id}_p_${ind}`} style={[ind > 0 ? sharedStyles.paragraph : {}]}>
                                {p}
                            </Typography>
                        ))}
                    </View>
                ))}
            </View>
        </CollapsibleHeaderLayout>
    );
};
