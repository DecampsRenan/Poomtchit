import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Box, Button, Center, Flex, Spacer, Text } from '@chakra-ui/react';
import kaboom, { KaboomCtx } from 'kaboom';
import { Draw, Transport } from 'tone';

export type BpmManagerProps = {
  onBpmChange?(newBpmValue: number): void;
};

export const BpmManager = ({ onBpmChange }: BpmManagerProps) => {
  const [bpm, setBpm] = useState(90);
  const oldBpmRef = useRef(bpm);
  let k = useRef<KaboomCtx>();
  let canvasRef = useRef();

  useEffect(() => {
    if (!k.current && canvasRef.current) {
      k.current = kaboom({
        canvas: canvasRef.current,
        background: [255, 255, 255],
        global: false,
        touchToMouse: false,
      });
    }
  }, []);

  useEffect(() => {
    if (!k.current) return;
    let isNewBeat = false;
    let frameCounter = 10;

    const scheduledEventId = Transport.scheduleRepeat((time) => {
      Draw.schedule(() => {
        isNewBeat = true;
      }, time);
    }, '4n');

    const cancelOnDraw = k.current.onDraw(() => {
      if (isNewBeat) {
        frameCounter -= 0.8;
        k.current.drawRect({
          width: k.current.width(),
          height: k.current.height(),
          pos: k.current.vec2(0, 0),
          color: k.current.WHITE,
          outline: {
            color: k.current.RED,
            width: k.current.lerp(-frameCounter - 10, 0, 100 * k.current.dt()),
          },
        });
        if (frameCounter <= 0) {
          isNewBeat = false;
          frameCounter = 10;
        }
      }
    });

    return () => {
      Transport.clear(scheduledEventId);
      cancelOnDraw();
    };
  }, []);

  const handleBpmChange = useCallback(
    (bpm) => {
      Transport.bpm.rampTo(bpm);
      onBpmChange?.(bpm);
    },
    [onBpmChange]
  );

  useEffect(() => {
    if (oldBpmRef?.current !== bpm) {
      oldBpmRef.current = bpm;
      handleBpmChange(bpm);
    }
  }, [bpm, handleBpmChange]);

  return (
    <>
      <Box
        as="canvas"
        ref={canvasRef}
        position="fixed"
        zIndex={-1}
        w="full"
        h="full"
        m={-2}
      />
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
          {/* <Center flex="1">TAP (available soon)</Center> */}
          <Spacer />
          <Center>
            <Button onClick={() => setBpm(bpm + 1)}>+</Button>
          </Center>
        </Flex>
      </Flex>
    </>
  );
};
