import React, { useEffect, useRef, useState } from 'react';

import { Button, Center, Flex, Text } from '@chakra-ui/react';
import * as Tone from 'tone';

export type BpmManagerProps = {
  onBpmChange?(newBpmValue: number): void;
};

export const BpmManager = ({ onBpmChange }) => {
  const [bpm, setBpm] = useState(90);
  const oldBpmRef = useRef(bpm);

  useEffect(() => {
    const synthA = new Tone.FMSynth().toDestination();
    const synthB = new Tone.AMSynth().toDestination();
    const beatSound = new Tone.Loop((time) => {
      synthA.triggerAttackRelease('C6', '38n', time);
    }, '1n').start(0);

    const quarterBeatSound = new Tone.Loop((time) => {
      synthB.triggerAttackRelease('C5', '38n', time);
    }, '4n').start(0);

    return () => {
      beatSound.dispose();
      quarterBeatSound.dispose();
      synthA.dispose();
      synthB.dispose();
    };
  }, []);

  useEffect(() => {
    if (oldBpmRef?.current !== bpm) {
      oldBpmRef.current = bpm;
      onBpmChange?.(bpm);
    }
  }, [bpm, onBpmChange]);

  return (
    <Flex flexDir="column" bgColor="gray.300" p="2">
      <Center>
        <Text fontSize="2xl" fontWeight="bold">
          {`${bpm} bpm`}
        </Text>
      </Center>
      <Flex>
        <Center>
          <Button onClick={() => setBpm(bpm - 1)}>-</Button>
        </Center>
        <Center flex="1">TAP (available soon)</Center>
        <Center>
          <Button onClick={() => setBpm(bpm + 1)}>+</Button>
        </Center>
      </Flex>
    </Flex>
  );
};
