import { colors } from './colors';
import { layout } from './layout';
import { shadows } from './shadows';
import { spacing } from './spacing';
import { typography } from './typography';
import { zIndices } from './z-index';

const foundations = {
  colors,
  ...typography,
  shadows,
  space: spacing,
  layout,
  zIndices,
  layerStyles: {
    card: {
      borderRadius: 5,
      borderWidth: 1,
      shadow: 'md',
      bgColor: 'white',
      p: 2,
    },
  },
};

export default foundations;
