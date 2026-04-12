import React from 'react';
import { Text, View } from 'react-native';

import { componentStyles } from '../styles/components.styles';

type StatTileProps = {
  value: string;
  label: string;
};

export function StatTile({ value, label }: StatTileProps) {
  return (
    <View style={componentStyles.statTile}>
      <Text style={componentStyles.statValue}>{value}</Text>
      <Text style={componentStyles.statLabel}>{label}</Text>
    </View>
  );
}