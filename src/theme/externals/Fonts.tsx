import { Global } from '@emotion/react';

export const Fonts = () => (
  <Global
    styles={`
      @font-face {
        font-family: 'ARCO';
        font-style: normal;
        font-weight: 700;
        font-display: swap;
        src: url(/fonts/ARCO.ttf) format('ttf');
        src: url(/fonts/ARCO.woff) format('woff');
      }
    `}
  />
);
