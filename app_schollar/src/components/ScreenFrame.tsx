import React, { ReactNode } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { componentStyles } from '../styles/components.styles';

type ScreenFrameProps = {
  title: string;
  subtitle?: string;
  tag?: string;
  children: ReactNode;
};

export function ScreenFrame({ title, subtitle, tag, children }: ScreenFrameProps) {
  return (
    <View style={componentStyles.shell}>
      <View style={componentStyles.heroHaloTop} />
      <View style={componentStyles.heroHaloBottom} />
      <SafeAreaView style={componentStyles.shell}>
        <ScrollView contentContainerStyle={componentStyles.shellScroll} showsVerticalScrollIndicator={false}>
          <View style={componentStyles.heroCard}>
            {tag ? (
              <View style={componentStyles.heroTag}>
                <Text style={componentStyles.heroTagText}>{tag}</Text>
              </View>
            ) : null}
            <Text style={componentStyles.heroTitle}>{title}</Text>
            {subtitle ? <Text style={componentStyles.heroSubtitle}>{subtitle}</Text> : null}
          </View>
          <View style={componentStyles.shellContent}>{children}</View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}