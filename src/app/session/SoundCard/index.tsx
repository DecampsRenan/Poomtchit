import React, { useEffect, useRef, useState } from 'react';

import {
  Button,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  Portal,
} from '@chakra-ui/react';
import {
  RiMore2Fill,
  RiSkipBackFill,
  RiStopFill,
  RiVolumeMuteFill,
  RiVolumeUpFill,
} from 'react-icons/ri';
import { Player, Transport } from 'tone';

import { Sample } from '@/config/db';

import { ConfirmMenuItem } from '@/components';

export type UsePlayerParams = {
  audioBuffer: AudioBuffer;
};

export const usePlayer = ({ audioBuffer }: UsePlayerParams) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const playerRef = useRef<Player>(null);
  // const queuedOps = useRef([]);

  const togglePlay = () => {
    // queuedOps.current.push(() => setIsPlaying(!isPlaying));
    setIsPlaying(!isPlaying);
  };

  // useEffect(() => {
  //   // unqueue samples operations on each beat (so everything is synced to the bpm)
  //   const scheduleId = Transport.schedule(() => {
  //     const operations = queuedOps.current;
  //     if (!operations?.length) return;
  //     operations.forEach((operation) => operation());
  //     queuedOps.current = [];
  //   }, '1m');

  //   return () => {
  //     Transport.clear(scheduleId);
  //   };
  // }, []);

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
    // queuedOps.current.push(() => playerRef?.current.restart());
    playerRef?.current.restart();
  };

  const stop = () => {
    // queuedOps.current.push(() => setIsPlaying(false));
    setIsPlaying(false);
  };

  const toggleMute = () => {
    // queuedOps.current.push(() => playerRef?.current.set({ mute: !isMuted }));
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

export type SoundCardProps = {
  audioBuffer: AudioBuffer;
  sample: Sample;
  onRemove?: () => void;
};

export const SoundCard = ({
  audioBuffer,
  onRemove,
  sample,
}: SoundCardProps) => {
  const { isMuted, isPlaying, restart, stop, togglePlay, toggleMute } =
    usePlayer({ audioBuffer });

  return (
    <Flex layerStyle="card" flexDir="column" p={0}>
      <Flex justifyContent="center" position="relative">
        <Button
          minHeight={20}
          rounded="none"
          variant="ghost"
          onClick={togglePlay}
          w="full"
        >
          {isPlaying ? 'Stop' : 'Play'}
        </Button>

        <Menu>
          <MenuButton
            as={IconButton}
            position="absolute"
            top={0}
            right={0}
            variant="ghost"
            aria-label="Open sample settings"
            icon={<RiMore2Fill />}
          />
          <Portal>
            <MenuList>
              <ConfirmMenuItem
                confirmText="Are you sure?"
                onClick={() => onRemove?.()}
              >
                Remove sample
              </ConfirmMenuItem>
            </MenuList>
          </Portal>
        </Menu>
      </Flex>
      <Flex borderTopWidth={1}>
        <IconButton
          flexGrow={1}
          disabled={!isPlaying}
          aria-label="Go to start"
          icon={<RiSkipBackFill />}
          rounded="none"
          onClick={restart}
        />
        <IconButton
          flexGrow={1}
          rounded="none"
          icon={isMuted ? <RiVolumeMuteFill /> : <RiVolumeUpFill />}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
          onClick={toggleMute}
        />
        <IconButton
          flexGrow={1}
          icon={<RiStopFill />}
          disabled={!isPlaying}
          aria-label="Stop sample"
          rounded="none"
          onClick={stop}
        />
      </Flex>
    </Flex>
  );
};
