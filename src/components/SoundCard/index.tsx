import React, { useState } from 'react';

import { Box, Button, ButtonGroup, Center, Flex } from '@chakra-ui/react';

export const SoundCard = () => {
  const [isPlaying, setIsPlaying] = useState();

  const togglePlay = () => setIsPlaying(isPlaying);

  return (
    <Flex flexDir="column">
      <Button
        rounded="none"
        minH={120}
        variant="ghost"
        onClick={togglePlay}
        bgColor="gray.300"
      >
        {isPlaying ? 'Pause' : 'Play'}
      </Button>
      <ButtonGroup mt="-px" isAttached variant="outline" rounded="none">
        <Button mr="-px" rounded="none" w="full">
          B
        </Button>
        <Button mr="-px" rounded="none" w="full">
          R
        </Button>
        <Button rounded="none" w="full">
          S
        </Button>
      </ButtonGroup>
    </Flex>
  );
};
