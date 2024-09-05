/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {Uri} from 'monaco-editor';
import React, {useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  PermissionsAndroid,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import GoogleCloudSpeechToText, {
  SpeechRecognizeEvent,
  VoiceStartEvent,
  SpeechErrorEvent,
  VoiceEvent,
  SpeechStartEvent,
} from 'react-native-google-cloud-speech-to-text';
import {useEffect} from 'react';
type SectionProps = PropsWithChildren<{
  title: string;
}>;

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [listen, setlisten] = useState(false);
  const [transcript, setResult] = React.useState<string>('');

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };
  useEffect(() => {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, {
      title: 'Cool Photo App Camera Permission',
      message:
        'Cool Photo App needs access to your camera ' +
        'so you can take awesome pictures.',
      buttonNeutral: 'Ask Me Later',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    });
  }, []);

  useEffect(() => {
    // GoogleCloudSpeechToText.setApiKey('key_____');
    GoogleCloudSpeechToText.onVoice(onVoice);
    GoogleCloudSpeechToText.onVoiceStart(onVoiceStart);
    GoogleCloudSpeechToText.onVoiceEnd(onVoiceEnd);
    GoogleCloudSpeechToText.onSpeechError(onSpeechError);
    GoogleCloudSpeechToText.onSpeechRecognized(onSpeechRecognized);
    GoogleCloudSpeechToText.onSpeechRecognizing(onSpeechRecognizing);
    return () => {
      GoogleCloudSpeechToText.removeListeners();
    };
  }, []);
  const onSpeechError = (_error: SpeechErrorEvent) => {
    console.log('onSpeechError: ', _error);
  };

  const onSpeechRecognized = (result: SpeechRecognizeEvent) => {
    console.log('onSpeechRecognized: ', result);
    setResult(result.transcript);
  };

  const onSpeechRecognizing = (result: SpeechRecognizeEvent) => {
    console.log('onSpeechRecognizing: ', result);
    setResult(result.transcript);
  };

  const onVoiceStart = (_event: VoiceStartEvent) => {
    console.log('onVoiceStart', _event);
  };

  const onVoice = (_event: VoiceEvent) => {
    console.log('onVoice', _event);
  };

  const onVoiceEnd = () => {
    console.log('onVoiceEnd: ');
  };

  const startRecognizing = async () => {
    const result: SpeechStartEvent = await GoogleCloudSpeechToText.start({
      speechToFile: true,
    });
    console.log('startRecognizing', result);
  };

  const stopRecognizing = async () => {
    await GoogleCloudSpeechToText.stop();
  };
  return (
    <SafeAreaView style={backgroundStyle}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '20%',
        }}>
        <Text style={{fontSize: 30, marginBottom: 25}}>
          {listen ? 'Listening ' : 'Press to command!'}
        </Text>
        <TouchableOpacity
          onPress={() => {
            setlisten(true);

            startRecognizing();
          }}>
          <Image
            style={{height: 100, width: 100}}
            source={require('./assests/voice.png')}></Image>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setlisten(false);

            stopRecognizing();
          }}>
          <Image
            style={{height: 100, width: 100}}
            source={require('./assests/voice.png')}></Image>
        </TouchableOpacity>

        <Text>Teanscript {transcript}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
