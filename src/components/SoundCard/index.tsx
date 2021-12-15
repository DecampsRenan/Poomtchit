import React, { useEffect, useRef, useState } from 'react';

import { Button, ButtonGroup, Flex } from '@chakra-ui/react';
import * as Tone from 'tone';

export const SoundCard = ({ audioBuffer }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<Tone.Player>(null);

  const togglePlay = () => setIsPlaying(!isPlaying);

  useEffect(() => {
    playerRef.current = new Tone.Player({
      url: audioBuffer,
      loop: true,
    }).toDestination();
    return () => {
      playerRef?.current.dispose();
    };
  });

  useEffect(() => {
    if (!playerRef?.current) return;
    if (isPlaying) {
      playerRef.current.start();
    } else {
      playerRef.current.stop();
    }
  });

  return (
    <Flex flexDir="column">
      <Button
        rounded="none"
        minH={120}
        variant="ghost"
        onClick={togglePlay}
        bgColor="cyan.200"
      >
        {isPlaying ? 'Pause' : 'Play'}
      </Button>
      <ButtonGroup mt="-px" isAttached variant="outline" rounded="none">
        <Button disabled mr="-px" rounded="none" w="full">
          B
        </Button>
        <Button disabled mr="-px" rounded="none" w="full">
          R
        </Button>
        <Button disabled rounded="none" w="full">
          S
        </Button>
      </ButtonGroup>
    </Flex>
  );
};
