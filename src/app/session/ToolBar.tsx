import { IconButton, Spacer } from '@chakra-ui/react';
import {
  RiPauseCircleLine,
  RiPlayCircleLine,
  RiRecordCircleLine,
  RiStopCircleLine,
} from 'react-icons/ri';

import { BpmManager } from './BpmManager';
import { Card } from './Card';

export const ToolBar = ({
  isRecording,
  onStopRecording,
  onStartRecording,
  isPlaying,
  onPlayPause,
}) => (
  <Card
    position="fixed"
    bottom={0}
    left={0}
    right={0}
    m={4}
    alignItems="center"
    ml={[4, 'auto']}
    maxW={['full', 80]}
  >
    <BpmManager />
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
);
