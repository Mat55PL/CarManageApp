import React, { useState } from 'react';
import { StyleSheet, Image, TouchableWithoutFeedback, Alert } from 'react-native';

import { ExternalLink } from './ExternalLink';
import { MonoText } from './StyledText';
import { Text, View } from './Themed';

import Colors from '@/constants/Colors';

export default function EditScreenInfo({ path }: { path: string }) {
  const [isBlurred, setIsBlurred] = useState(false);
  return (
    <View>
      <View style={styles.getStartedContainer}>
        <Text
          style={styles.getStartedText}
          lightColor="rgba(0,0,0,0.8)"
          darkColor="rgba(255,255,255,0.8)">
          Open up the code for this screen:
        </Text>

        <View
          style={[styles.codeHighlightContainer, styles.homeScreenFilename]}
          darkColor="rgba(255,255,255,0.05)"
          lightColor="rgba(0,0,0,0.05)">
          <MonoText>{path}</MonoText>
        </View>

        <Text
          style={styles.getStartedText}
          lightColor="rgba(0,0,0,0.8)"
          darkColor="rgba(255,255,255,0.8)">
          Change any of the text, save the file, and your app will automatically update.
        </Text>
      </View>

      <View style={styles.helpContainer}>
        <ExternalLink
          style={styles.helpLink}
          href="https://docs.expo.io/get-started/create-a-new-app/#opening-the-app-on-your-phonetablet">
          <Text style={styles.helpLinkText} lightColor={Colors.light.tint}>
            Tap here if your app doesn't automatically update after making changes
          </Text>
        </ExternalLink>
      </View>
      <TouchableWithoutFeedback
        onLongPress={() => {
          console.log('Stańczyk Dłuugo jebnięty');
          setIsBlurred(!isBlurred);
          Alert.alert('Kurwa', 'Stańczyk Dłuugo jebnięty', [
            { text: 'OK', onPress: () => console.log('OK Pressed') },
            { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
            { text: 'Dddupa', onPress: () => console.log('Dddupa Pressed') },
          ]);
        }}
        onPress={() => {
          console.log('Stańczyk tapnięty!');
        }}
      >
        <Image
          fadeDuration={4500}
          style={[styles.meme, isBlurred && styles.blurred]}
          source={require("@/assets/images/stan.jpg")} />
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightContainer: {
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'center',
  },
  helpContainer: {
    marginTop: 15,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    textAlign: 'center',
  },
  meme: {
    width: 200,
    height: 200,
    alignSelf: 'center',
  },
  blurred: {
    opacity: 0.5,
  },
});
