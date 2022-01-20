import React, { useEffect, useRef, useState } from 'react';

import { Box, Button, Flex, SimpleGrid, Spacer } from '@chakra-ui/react';
import Head from 'next/head';
import * as Tone from 'tone';

import { BpmManager } from '@/components/BpmManager';
import { SoundCard } from '@/components/SoundCard';

const Index = () => {
  const recordedChunksRef = useRef([]);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder>();
  const [isPlaying, setIsPlaying] = useState(false);

  const [sounds, setSounds] = useState([]);

  useEffect(() => {
    if (isPlaying) {
      Tone.Transport.start();
    } else {
      Tone.Transport.pause();
    }
  }, [isPlaying]);

  // Create a hidden link and use it to download the created file
  const handleDownloadSample =
    ({ soundData, name = `${Date.now()}` }) =>
    () => {
      const linkElt = document.createElement('a');
      linkElt.href = URL.createObjectURL(new Blob(soundData));
      linkElt.download = `${name}.wav`;
      linkElt.click();
    };

  const initSave = async (stream: MediaStream) => {
    await Tone.start();
    setIsPlaying(true);

    const options = { mimeType: 'audio/webm' };
    mediaRecorderRef.current = new MediaRecorder(stream, options);

    mediaRecorderRef.current.addEventListener('dataavailable', (e) => {
      if (!recordedChunksRef?.current) return;
      if (e.data.size > 0) {
        recordedChunksRef.current.push(e.data);
      }
    });

    mediaRecorderRef.current.addEventListener('stop', async (e) => {
      const buffer = new Blob(recordedChunksRef.current);
      const audioBlobToBuffer = await buffer.arrayBuffer();
      const audioBuffer = await Tone.context.decodeAudioData(audioBlobToBuffer);

      setSounds((oldValue) => [...oldValue, audioBuffer]);
      recordedChunksRef.current = [];
      setIsRecording(false);
    });
  };

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
  }, []);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleBpmChange = (bpm) => {
    Tone.Transport.bpm.rampTo(bpm);
  };

  return (
    <>
      <Head>
        <title>Jambox</title>
      </Head>
      <Flex flex="1" flexDir="column" p="2" bg="transparent">
        {/* BPM Component */}
        <BpmManager onBpmChange={handleBpmChange} />

        <Spacer />

        <SimpleGrid columns={2} spacing={5}>
          {sounds.map((audioBuffer, i) => (
            <SoundCard key={i} audioBuffer={audioBuffer} />
          ))}
        </SimpleGrid>

        <Spacer />

        <Button
          colorScheme="green"
          onClick={isRecording ? handleStopRecording : handleStartRecording}
        >
          {isRecording ? 'Stop recording' : 'Start recording'}
        </Button>

        {/* {!!sounds?.length && (
          <Stack>
            {sounds.map((soundData, i) => (
              <Button
                key={i}
                onClick={handleDownloadSample({
                  soundData,
                  name: `sample-${i + 1}`,
                })}
              >
                Download sample {i + 1}
              </Button>
            ))}
          </Stack>
        )} */}

        <Button onClick={handlePlayPause}>
          {isPlaying ? `PAUSE` : `PLAY`}
        </Button>
      </Flex>
    </>
  );
};
export default Index;
