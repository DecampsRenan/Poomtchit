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

import { ConfirmMenuItem } from '@/components';

import { Card } from '../Card';

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

export type SoundCardProps = {
  audioBuffer: AudioBuffer;
  onRemove?: () => void;
};

export const SoundCard = ({ audioBuffer, onRemove }: SoundCardProps) => {
  const { isMuted, isPlaying, restart, stop, togglePlay, toggleMute } =
    usePlayer({ audioBuffer });

  return (
    <Card flexDir="column" p={0}>
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
    </Card>
  );
};
