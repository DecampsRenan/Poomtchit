import React, { useCallback, useEffect, useRef, useState } from 'react';

import {
  Button,
  Center,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { Transport } from 'tone';

export type BpmManagerProps = {
  onBpmChange?(newBpmValue: number): void;
};

export const useBpm = () => {
  const [bpm, setBpm] = useState(90);
  const oldBpmRef = useRef(bpm);

  const handleBpmChange = useCallback((bpm) => Transport.bpm.rampTo(bpm), []);

  useEffect(() => {
    if (oldBpmRef?.current !== bpm) {
      oldBpmRef.current = bpm;
      handleBpmChange(bpm);
    }
  }, [bpm, handleBpmChange]);

  return {
    bpm,
    setBpm,
  };
};

export const BpmManager = ({ onBpmChange }: BpmManagerProps) => {
  const { bpm, setBpm } = useBpm();
  const { onOpen, onClose, isOpen } = useDisclosure();

  return (
    <>
      <Button variant="ghost" fontWeight="bold" onClick={onOpen}>
        {`${bpm} bpm`}
      </Button>

      <Modal isOpen={isOpen} size="xs" isCentered onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update BPM</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Center>
              <Text>{`${bpm} bpm`}</Text>
            </Center>
          </ModalBody>

          <ModalFooter px={0} pb={0} justifyContent="center">
            <Button
              size="lg"
              flex={1}
              borderTopRadius={0}
              borderBottomRightRadius={0}
              borderTopWidth={1}
              variant="ghost"
              onClick={() => setBpm(bpm - 10)}
            >
              -10
            </Button>
            <Button
              size="lg"
              flex={1}
              borderRadius={0}
              borderTopWidth={1}
              variant="ghost"
              onClick={() => setBpm(bpm - 1)}
            >
              -1
            </Button>
            <Button
              size="lg"
              flex={1}
              borderTopRadius={0}
              borderTopWidth={1}
              variant="ghost"
              onClick={() => setBpm(bpm + 1)}
            >
              +1
            </Button>
            <Button
              size="lg"
              flex={1}
              borderRadius={0}
              borderBottomLeftRadius={0}
              borderTopWidth={1}
              variant="ghost"
              onClick={() => setBpm(bpm + 10)}
            >
              +10
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
