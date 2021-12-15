import React, { useEffect, useRef, useState } from 'react';

import { Button, Flex, SimpleGrid, Spacer, Stack } from '@chakra-ui/react';
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

    console.log('ToneJS ready to play');
    const options = { mimeType: 'audio/webm' };
    mediaRecorderRef.current = new MediaRecorder(stream, options);

    mediaRecorderRef.current.addEventListener('dataavailable', function (e) {
      if (!recordedChunksRef?.current) return;
      if (e.data.size > 0) {
        recordedChunksRef.current.push(e.data);
        console.log(e.data);
      }
    });
  };

  const handleStopRecording = () => {
    if (!mediaRecorderRef?.current) return;
    mediaRecorderRef.current.stop();
    setSounds((oldValue) => [...oldValue, recordedChunksRef.current]);
    recordedChunksRef.current = [];
    setIsRecording(false);
  };

  const handleStartRecording = () => {
    if (!mediaRecorderRef?.current) return;
    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  useEffect(() => {
    // console.log('isSupported ? ', Tone.UserMedia.supported);
    // const meter = new Tone.Meter();
    // const mic = new Tone.UserMedia();
    // let intervalId = null;
    // mic.open().then(() => {
    //   mic.connect(meter);
    //   intervalId = setInterval(() => console.log(meter.getValue()), 100);
    // });
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then(initSave);
    // return () => {
    //   mic.close();
    //   clearInterval(intervalId);
    // };
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
      <Flex flex="1" flexDir="column" p="2">
        {/* BPM Component */}
        <BpmManager onBpmChange={handleBpmChange} />

        <Spacer />

        <SimpleGrid columns={2} spacing={5}>
          <SoundCard />
          <SoundCard />
          <SoundCard />
        </SimpleGrid>

        <Spacer />

        <Button
          colorScheme="green"
          onClick={isRecording ? handleStopRecording : handleStartRecording}
        >
          {isRecording ? 'Stop recording' : 'Start recording'}
        </Button>

        {!!sounds?.length && (
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
        )}

        <Button onClick={handlePlayPause}>
          {isPlaying ? `PAUSE` : `PLAY`}
        </Button>
      </Flex>
    </>
  );
};
export default Index;
