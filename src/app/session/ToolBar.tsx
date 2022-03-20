import { Flex, IconButton, Spacer } from '@chakra-ui/react';
import {
  RiPauseCircleLine,
  RiPlayCircleLine,
  RiRecordCircleLine,
  RiStopCircleLine,
} from 'react-icons/ri';

import { PageContainer } from '@/app/layout';
import { BpmManager } from '@/app/session/BpmManager';
import { TempoMeter } from '@/app/session/TempoMeter';

export const ToolBar = ({
  isRecording,
  onStopRecording,
  onStartRecording,
  isPlaying,
  onPlayPause,
}) => (
  <PageContainer
    bottom={0}
    left={0}
    right={0}
    position="fixed"
    p={4}
    zIndex={1}
  >
    <Flex layerStyle="card" alignItems="center">
      <BpmManager />
      <Spacer />
      <TempoMeter />
      <Spacer />
      <IconButton
        variant="ghost"
        colorScheme={isRecording ? 'red' : null}
        aria-label={isRecording ? 'Stop recording' : 'Start recording'}
        icon={isRecording ? <RiStopCircleLine /> : <RiRecordCircleLine />}
        onClick={isRecording ? onStopRecording : onStartRecording}
      />

      <IconButton
        variant="ghost"
        aria-label={isPlaying ? 'Stop all sample' : 'Play all samples'}
        icon={isPlaying ? <RiPauseCircleLine /> : <RiPlayCircleLine />}
        onClick={onPlayPause}
      />
    </Flex>
  </PageContainer>
);
