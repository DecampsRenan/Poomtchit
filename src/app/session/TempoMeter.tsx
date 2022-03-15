import { FC, useEffect, useState } from 'react';

import { Box, HStack, StackProps } from '@chakra-ui/react';
import { Transport } from 'tone';

export type TempoMeterType = StackProps;

type TempoCircleProps = {
  isActive: boolean;
};

const TempoCircle: FC<TempoCircleProps> = ({ isActive }) => (
  <Box
    boxSize={3}
    borderRadius={6}
    borderWidth={1}
    borderColor={isActive ? 'brand.400' : 'brand.300'}
    bg={isActive ? 'brand.400' : 'transparent'}
  />
);

export const TempoMeter: FC<TempoMeterType> = (props) => {
  const tempoCircleToDisplay = Array.from(Array(4).keys());
  const [currentBeat, setCurrentBeat] = useState(0);

  useEffect(() => {
    const id = Transport.scheduleRepeat(() => {
      setCurrentBeat((oldBeat) => {
        if (oldBeat >= 7) {
          return 0;
        } else {
          return oldBeat + 1;
        }
      });
    }, '4n');

    return () => {
      Transport.clear(id);
    };
  }, []);

  return (
    <HStack {...props}>
      {tempoCircleToDisplay.map((i) => (
        <TempoCircle
          key={i}
          isActive={currentBeat >= i + 1 && currentBeat <= i + 4}
        />
      ))}
    </HStack>
  );
};
