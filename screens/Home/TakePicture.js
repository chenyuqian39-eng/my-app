import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import {
    Alert,
    Button,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function TakePicture() {
    const cameraRef = useRef(null);
    const [permission, requestPermission] = useCameraPermissions();
    const [facing, setFacing] = useState('back');

    if (!permission) {
        return <View style={styles.container} />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.permissionContainer}>
                <Text style={styles.message}>We need your permission to use your camera</Text>
                <Button title="Grant permission" onPress={requestPermission} />
            </View>
        );
    }

    const toggleCameraFacing = () => {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    };

    const takePicture = async () => {
        if (!cameraRef.current) {
            return;
        }

        const photo = await cameraRef.current.takePictureAsync();
        Alert.alert('Photo taken', photo.uri);
    };

    return (
        <View style={styles.container}>
            <CameraView
                ref={cameraRef}
                style={styles.preview}
                facing={facing}
                flash="on"
            />
            <View style={styles.actions}>
                <TouchableOpacity onPress={toggleCameraFacing} style={styles.capture}>
                    <Text>FLIP</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={takePicture} style={styles.capture}>
                    <Text>SNAP</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black',
    },
    permissionContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    message: {
        marginBottom: 12,
        textAlign: 'center',
    },
    preview: {
        flex: 1,
    },
    actions: {
        position: 'absolute',
        bottom: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 10,
    },
});

/*
原来的 class component 写法先注释保留：

'use strict';

import React, { PureComponent } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Alert,
} from 'react-native';
import { RNCamera } from 'react-native-camera';

class ExampleApp extends PureComponent {
    render() {
        return (
            <View style={styles.container}>
                <RNCamera
                    ref={ref => {
                        this.camera = ref;
                    }}
                    style={styles.preview}
                    type={RNCamera.Constants.Type.back}
                    flashMode={RNCamera.Constants.FlashMode.on}
                    androidCameraPermissionOptions={{
                        title: 'Permission to use camera',
                        message: 'We need your permission to use your camera',
                        buttonPositive: 'Ok',
                        buttonNegative: 'Cancel',
                    }}
                    androidRecordAudioPermissionOptions={{
                        title: 'Permission to use audio recording',
                        message: 'We need your permission to use your audio',
                        buttonPositive: 'Ok',
                        buttonNegative: 'Cancel',
                    }}
                />
                <TouchableOpacity
                    onPress={() => Alert.alert('Hello')}
                    style={styles.capture}
                >
                    <Text> SNAP </Text>
                </TouchableOpacity>
            </View>
        );
    }
}

export default ExampleApp;
*/
