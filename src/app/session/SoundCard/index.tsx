import React, { useEffect, useRef, useState } from 'react';

import { Button, ButtonGroup, Flex } from '@chakra-ui/react';
import { Player, Transport } from 'tone';

export type UsePlayerParams = {
  audioBuffer: AudioBuffer;
};

export const usePlayer = ({ audioBuffer }: UsePlayerParams) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const playerRef = useRef<Player>(null);

  const togglePlay = () => setIsPlaying(!isPlaying);

  // React to global transport changes
  useEffect(() => {
    const setPlaying = () => {
      setIsPlaying(true);
    };

    const setPause = () => {
      setIsPlaying(false);
    };

    Transport.on('pause', setPause);
    Transport.on('start', setPlaying);

    return () => {
      Transport.off('pause', setPause);
      Transport.off('start', setPlaying);
    };
  }, []);

  // Initiate the player with the provided audioBuffer
  // this is a sample registered from the microphone
  useEffect(() => {
    playerRef.current = new Player({
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

  return {
    isMuted,
    isPlaying,
    restart,
    stop,
    togglePlay,
    toggleMute,
  };
};

export const SoundCard = ({ audioBuffer }) => {
  const { isMuted, isPlaying, restart, stop, togglePlay, toggleMute } =
    usePlayer({ audioBuffer });

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
