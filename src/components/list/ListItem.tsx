import { List, ListItemProps } from 'react-native-paper';
import { useAppTheme } from '../../styles/theme';

export const ListItem: React.FC<ListItemProps> = (props) => {
    const { style, titleStyle, ...other } = props;
    const theme = useAppTheme();
    return (
        <List.Item
            {...other}
            style={[
                {
                    backgroundColor: theme.colors.surface,
                    paddingHorizontal: theme.spacing.md,
                    // paddingLeft: 0,
                    // paddingVertical: 0,
                    flexDirection: 'row',
                    alignItems: 'center',
                    minHeight: theme.size.xl,
                    // minHeight: 'auto'
                },
                ...(Array.isArray(style) ? style : [style]),
            ]}
            titleStyle={[
                {
                    marginLeft: theme.spacing.sm,
                    fontSize: 16,
                },
                ...(Array.isArray(titleStyle) ? titleStyle : [titleStyle]),
            ]}
        />
    );
};
