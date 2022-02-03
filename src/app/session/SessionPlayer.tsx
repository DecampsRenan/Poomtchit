import { useCallback, useEffect, useRef, useState } from 'react';

import {
  Button,
  Flex,
  IconButton,
  SimpleGrid,
  Spacer,
  Text,
} from '@chakra-ui/react';
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

import { BpmManager, useBpm } from '@/app/session/BpmManager';
import { SoundCard } from '@/app/session/SoundCard';
import { db } from '@/config/db';

export const SessionPlayer = () => {
  const recordedChunksRef = useRef([]);

  const { sessionId: sessionIdParam } = useParams();
  const sessionId = parseInt(sessionIdParam, 10);
  const isLoaded = useRef(false);

  const session = useLiveQuery(() => db.sessions.get(sessionId));

  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder>();
  const [isPlaying, setIsPlaying] = useState(false);

  const [sounds, setSounds] = useState<AudioBuffer[]>([]);
  const { bpm, setBpm } = useBpm();

  useEffect(() => {
    if (isLoaded.current) return;
    if (!session || !session.samples?.length) return;
    const audioSamples = session.samples?.map(
      (arrayBuffer: ArrayBuffer): AudioBuffer => {
        const buffer = new Float32Array(arrayBuffer);
        const toneAudioBuffer = ToneAudioBuffer.fromArray(buffer);
        return toneAudioBuffer.get();
      }
    );
    setSounds(audioSamples);
    isLoaded.current = true;
  }, [session]);

  useEffect(() => {
    if (isPlaying) {
      Transport.start();
    } else {
      Transport.pause();
    }
  }, [isPlaying]);

  const initSave = useCallback(async (stream: MediaStream) => {
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

      setSounds((oldValue) => [...oldValue, audioBuffer]);

      recordedChunksRef.current = [];
      setIsRecording(false);
    });
  }, []);

  useEffect(() => {
    if (!session?.id || !sounds?.length) return;
    (async () => {
      try {
        // persist new sound in local db
        // convert them into blob
        const arrayBuffers = sounds.map((audioBuffer) => {
          const toneAudioBuffer = new ToneAudioBuffer(audioBuffer);
          const arrayBuffer = toneAudioBuffer.toArray() as Float32Array;
          return arrayBuffer.buffer;
        });

        await db.sessions.update(session.id, { samples: arrayBuffers });
      } catch (error) {
        console.log('something goes wrong while persisting new sample', error);
      }
    })();
  }, [sounds, session?.id]);

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
      .then(initSave);
  }, [initSave]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <>
      <Head>
        <title>Jambox</title>
      </Head>

      <Flex flex="1" flexDir="column" p="2" bg="transparent">
        <SimpleGrid columns={[2, 3, 4]} spacing={[5, 8]}>
          {sounds.map((audioBuffer, i) => (
            <SoundCard key={i} audioBuffer={audioBuffer} />
          ))}
        </SimpleGrid>
      </Flex>

      <Flex
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        m={2}
        flexDir="row"
        p={2}
        borderRadius="md"
        shadow="md"
        borderWidth={1}
        bgColor="white"
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
          aria-label={isPlaying ? `PAUSE` : `PLAY`}
          icon={isPlaying ? <RiPauseCircleLine /> : <RiPlayCircleLine />}
          onClick={handlePlayPause}
        />
      </Flex>
    </>
  );
};
