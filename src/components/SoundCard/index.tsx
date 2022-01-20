import React, { useEffect, useRef, useState } from 'react';

import { Button, ButtonGroup, Flex } from '@chakra-ui/react';
import * as Tone from 'tone';

export const SoundCard = ({ audioBuffer }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const playerRef = useRef<Tone.Player>(null);

  const togglePlay = () => setIsPlaying(!isPlaying);

  useEffect(() => {
    const setPlaying = () => {
      setIsPlaying(true);
    };
    const setPause = () => {
      setIsPlaying(false);
    };
    Tone.Transport.on('pause', setPause);
    Tone.Transport.on('start', setPlaying);

    return () => {
      Tone.Transport.off('pause', setPause);
      Tone.Transport.off('start', setPlaying);
    };
  }, []);

  useEffect(() => {
    playerRef.current = new Tone.Player({
      url: audioBuffer,
      loop: true,
    }).toDestination();
    return () => {
      playerRef?.current.dispose();
    };
  }, [audioBuffer]);

  useEffect(() => {
    if (!playerRef?.current) return;
    if (isPlaying) {
      playerRef.current.start();
    } else {
      playerRef.current.stop();
    }
  }, [isPlaying]);

  const restart = () => {
    playerRef?.current.restart();
  };

  const stop = () => {
    setIsPlaying(false);
    playerRef?.current.stop();
  };

  const toggleMute = () => {
    playerRef?.current.set({ mute: !isMuted });
    setIsMuted(!isMuted);
  };

  return (
    <Flex flexDir="column">
      <Button
        rounded="none"
        minH={120}
        variant="ghost"
        onClick={togglePlay}
        bgColor="cyan.200"
      >
        {isPlaying ? 'Stop' : 'Play'}
      </Button>
      <ButtonGroup mt="-px" isAttached variant="outline" rounded="none">
        <Button
          disabled={!isPlaying}
          mr="-px"
          rounded="none"
          w="full"
          onClick={restart}
        >
          Begin
        </Button>
        <Button mr="-px" rounded="none" w="full" onClick={toggleMute}>
          {isMuted ? 'Unmute' : 'Mute'}
        </Button>
        <Button disabled={!isPlaying} rounded="none" w="full" onClick={stop}>
          Stop
        </Button>
      </ButtonGroup>
    </Flex>
  );
};
