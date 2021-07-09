import * as React from 'react';
import { Dimensions } from 'react-native';
export function ScaleWidth(size, originalMeasure, deviceMeasure) {
	console.log('used');
	var scale = (size / originalMeasure) * deviceMeasure;
	return scale;
}
