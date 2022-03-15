import { IconButton, Spacer } from '@chakra-ui/react';
import {
  RiPauseCircleLine,
  RiPlayCircleLine,
  RiRecordCircleLine,
  RiStopCircleLine,
} from 'react-icons/ri';

import { TempoMeter } from '@/app/session/TempoMeter';

import { PageContainer } from '../layout';
import { BpmManager } from './BpmManager';
import { Card } from './Card';

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
    <Card alignItems="center">
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
    </Card>
  </PageContainer>
);
