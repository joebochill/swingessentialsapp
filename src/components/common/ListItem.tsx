import React from 'react';
import { List, ListItemProps } from 'react-native-paper';
import { useAppTheme } from '../../theme';

export const ListItem: React.FC<ListItemProps & { bottomDivider?: boolean; topDivider?: boolean }> = (props) => {
    const { style, left, titleStyle, descriptionStyle, bottomDivider, topDivider, ...other } = props;
    const theme = useAppTheme();
    return (
        <List.Item
            {...other}
            left={left}
            style={[
                {
                    backgroundColor: theme.colors.surface,
                    paddingLeft: theme.spacing.md,
                    paddingRight: theme.spacing.md,
                    flexDirection: 'row',
                    alignItems: 'center',
                    minHeight: theme.size.xl,
                },
                topDivider
                    ? { borderTopWidth: 1, borderTopColor: theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }
                    : {},
                bottomDivider
                    ? {
                          borderBottomWidth: 1,
                          borderBottomColor: theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                      }
                    : {},
                // @ts-expect-error RNPaper ListItemType is buggy
                ...(Array.isArray(style) ? style : [style]),
            ]}
            titleStyle={[
                {
                    marginLeft: theme.spacing.sm,
                    fontSize: 16,
                },
                !left ? { marginLeft: -1 * theme.spacing.md } : {},
                ...(Array.isArray(titleStyle) ? titleStyle : [titleStyle]),
            ]}
            descriptionStyle={[
                {
                    marginLeft: theme.spacing.sm,
                },
                !left ? { marginLeft: -1 * theme.spacing.md } : {},
                ...(Array.isArray(descriptionStyle) ? descriptionStyle : [descriptionStyle]),
            ]}
        />
    );
};
