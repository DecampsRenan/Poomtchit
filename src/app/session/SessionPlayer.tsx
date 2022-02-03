import { useCallback, useEffect, useRef, useState } from 'react';

import { Flex, IconButton, SimpleGrid, Spacer } from '@chakra-ui/react';
import { useLiveQuery } from 'dexie-react-hooks';
import Head from 'next/head';
import {
  RiPauseCircleLine,
  RiPlayCircleLine,
  RiRecordCircleLine,
  RiStopCircleLine,
} from 'react-icons/ri';
import { useParams } from 'react-router-dom';
import { ToneAudioBuffer, Transport, context, start } from 'tone';

import { BpmManager } from '@/app/session/BpmManager';
import { SoundCard } from '@/app/session/SoundCard';
import { db } from '@/config/db';

import { Card } from './Card';

export const SessionPlayer = () => {
  const recordedChunksRef = useRef([]);

  const { sessionId: sessionIdParam } = useParams();
  const sessionId = parseInt(sessionIdParam, 10);
  const isLoaded = useRef(false);

  const samples = useLiveQuery(() => db.samples.where({ sessionId }).toArray());

  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder>();
  const [isPlaying, setIsPlaying] = useState(false);

  const [sounds, setSounds] = useState<AudioBuffer[]>([]);

  // When the page is mounted, load available samples
  useEffect(() => {
    if (isLoaded.current || !samples?.length) return;
    console.log('loading samples');
    const audioSamples = samples.map((sample): AudioBuffer => {
      const buffer = new Float32Array(sample.arrayBuffer);
      const toneAudioBuffer = ToneAudioBuffer.fromArray(buffer);
      return toneAudioBuffer.get();
    });
    setSounds(audioSamples);
    isLoaded.current = true;
  }, [samples]);

  useEffect(() => {
    if (isPlaying) {
      Transport.start();
    } else {
      Transport.pause();
    }
  }, [isPlaying]);

  const initSoundSystem = useCallback(
    async (stream: MediaStream) => {
      await start();

      const options = { mimeType: 'audio/webm' };
      mediaRecorderRef.current = new MediaRecorder(stream, options);

      // TODO: memory leak, remember to remove the event
      mediaRecorderRef.current.addEventListener('dataavailable', (e) => {
        if (!recordedChunksRef?.current) return;
        if (e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      });

      // TODO: memory leak, remember to remove the event
      mediaRecorderRef.current.addEventListener('stop', async (e) => {
        const buffer = new Blob(recordedChunksRef.current);
        const audioBlobToBuffer = await buffer.arrayBuffer();
        const audioBuffer = await context.decodeAudioData(audioBlobToBuffer);
        const toneAudioBuffer = new ToneAudioBuffer(audioBuffer);

        // Persist sound in the indexed db
        try {
          await db.samples.add({
            sessionId,
            arrayBuffer: (toneAudioBuffer.toArray() as Float32Array).buffer,
          });
        } catch (error) {
          console.error(
            'Something went wrong while saving the new smaple',
            error
          );
        }

        setSounds((oldValue) => [...oldValue, audioBuffer]);

        recordedChunksRef.current = [];
        setIsRecording(false);
      });
    },
    [sessionId]
  );

  const handleStopRecording = async () => {
    if (!mediaRecorderRef?.current || !recordedChunksRef?.current) return;
    mediaRecorderRef.current.stop();
  };

  const handleStartRecording = () => {
    if (!mediaRecorderRef?.current) return;
    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then(initSoundSystem);
  }, [initSoundSystem]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <>
      <Head>
        <title>Jambox</title>
      </Head>

      <Flex flex="1" flexDir="column" p={2} bg="transparent">
        <SimpleGrid columns={[2, 3, 4]} spacing={[5, 8]}>
          {sounds.map((audioBuffer, i) => (
            <SoundCard key={i} audioBuffer={audioBuffer} />
          ))}
        </SimpleGrid>
      </Flex>

      <Card
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        m={2}
        alignItems="center"
      >
        <BpmManager />
        <Spacer />
        <IconButton
          variant="ghost"
          colorScheme={isRecording ? 'red' : null}
          aria-label={isRecording ? 'Stop recording' : 'Start recording'}
          icon={isRecording ? <RiStopCircleLine /> : <RiRecordCircleLine />}
          onClick={isRecording ? handleStopRecording : handleStartRecording}
        />

        <IconButton
          variant="ghost"
          aria-label={isPlaying ? 'Stop all sample' : 'Play all samples'}
          icon={isPlaying ? <RiPauseCircleLine /> : <RiPlayCircleLine />}
          onClick={handlePlayPause}
        />
      </Card>
    </>
  );
};
