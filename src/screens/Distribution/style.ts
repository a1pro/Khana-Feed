import { StyleSheet } from 'react-native';
import COLORS from '../../utils/Colors';
import { responsiveFontSize, verticalScale } from '../../utils/Metrics';

const styles = StyleSheet.create({
    container: { flex: 1, },
    backgroundimage: { height: "100%", width: "100%", resizeMode: "contain" },
    input: {
        width: "95%",
        alignSelf: "center"
    },
    txt: {
        textAlign: 'left',
        marginTop: verticalScale(10),
        marginBottom: verticalScale(15),
        marginLeft: verticalScale(20),
        fontSize: responsiveFontSize(16),
    },
    view: {
        alignItems: 'flex-start',
        marginLeft: 10,
        marginTop: 20,
        marginBottom: 10,
        alignSelf: "center",
    },
    tchbtn: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.appColor || '#4CAF50',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 25,
        backgroundColor: '#fff',
        position: 'relative'
    },
    view2: {
        backgroundColor: COLORS.appColor || '#4CAF50',
        width: 35,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        right: -14,
        bottom: -14,
        borderWidth: 2,
        borderColor: '#fff',
        elevation: 2,
    },
    tchbtn2: {
        backgroundColor: COLORS.appColor,
        margin: 20,
        borderRadius: 8,
        padding: 15,
        alignItems: 'center',
    }
})
export default styles