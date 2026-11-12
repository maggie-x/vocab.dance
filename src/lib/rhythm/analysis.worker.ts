/* eslint-disable no-restricted-globals */
import { bandFeatures } from './dsp';

self.onmessage = (e: MessageEvent<{ data: Float32Array; sr: number }>) => {
  const { data, sr } = e.data;
  const result = bandFeatures(data, sr, (fraction) => self.postMessage({ progress: fraction }));
  (self as unknown as Worker).postMessage(result, [...result.odf.map((a) => a.buffer), ...result.amp.map((a) => a.buffer)]);
};

export {};
