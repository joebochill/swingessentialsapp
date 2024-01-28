import * as React from 'react';

// Components
import { Image, TouchableHighlight, View } from 'react-native';
import { CollapsibleHeaderLayout, Spacer, Stack, Typography } from '../../components';

// Styles
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/MainNavigator';
import { useSelector } from 'react-redux';
import { ApplicationState, Pro } from '../../__types__';
import { width } from '../../utilities/dimensions';
import { splitParagraphs } from '../../utilities';
import { useAppTheme } from '../../styles/theme';

export const Pros: React.FC<StackScreenProps<RootStackParamList, 'About'>> = (props) => {
    const theme = useAppTheme();
    const prosList = useSelector((state: ApplicationState) => state.pros.prosList);

    return (
        <CollapsibleHeaderLayout
            title={'Meet Our Pros'}
            subtitle={'The folks behind the magic'}
            navigation={props.navigation}
        >
            <Stack
                space={theme.spacing.xxl}
                style={{ paddingHorizontal: theme.spacing.md, marginTop: theme.spacing.xl }}
            >
                {prosList.map((pro: Pro) => (
                    <View key={`pro_${pro.id}`}>
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
                                backgroundColor: theme.colors.primaryContainer,
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
                            variant={'bodyLarge'}
                            fontWeight={'semiBold'}
                            color={'primary'}
                            style={{
                                textAlign: 'center',
                                marginTop: theme.spacing.sm,
                            }}
                        >
                            {pro.name}
                        </Typography>
                        {pro.title ? (
                            <Typography
                                variant={'bodyLarge'}
                                fontWeight={'light'}
                                color={'primary'}
                                style={{
                                    textAlign: 'center',
                                    lineHeight: 16,
                                }}
                            >
                                {pro.title}
                            </Typography>
                        ) : null}
                        <Spacer size={theme.spacing.md} />
                        {splitParagraphs(pro.bio).map((p, ind) => (
                            <Typography
                                variant={'bodyLarge'}
                                fontWeight={'light'}
                                key={`${pro.id}_p_${ind}`}
                                style={[ind > 0 ? { marginTop: theme.spacing.md } : {}]}
                            >
                                {p}
                            </Typography>
                        ))}
                    </View>
                ))}
            </Stack>
        </CollapsibleHeaderLayout>
    );
};
