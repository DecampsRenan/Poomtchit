import React, { useEffect, useRef, useState } from 'react';

import { Button, Center, Heading, Text } from '@chakra-ui/react';
import Head from 'next/head';

const Index = () => {
  const recordedChunksRef = useRef([]);
  const [isSaving, setIsSaving] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder>();

  // Create a hidden link and use it to download the created file
  const downloadSoundFile = () => {
    const recordedChunks = recordedChunksRef.current;
    const linkElt = document.createElement('a');
    linkElt.href = URL.createObjectURL(new Blob(recordedChunks));
    linkElt.download = 'MySound.wav';
    linkElt.click();
  };

  const initSave = (stream: MediaStream) => {
    const options = { mimeType: 'audio/webm' };
    mediaRecorderRef.current = new MediaRecorder(stream, options);

    mediaRecorderRef.current.addEventListener('dataavailable', function (e) {
      if (!recordedChunksRef?.current) return;
      if (e.data.size > 0) recordedChunksRef.current.push(e.data);
    });
  };

  const handleStop = () => {
    if (!mediaRecorderRef?.current) return;
    mediaRecorderRef.current.stop();
    setIsSaving(false);
  };
  const handleStart = () => {
    if (!mediaRecorderRef?.current) return;
    mediaRecorderRef.current.start();
    setIsSaving(true);
  };

  useEffect(() => {
    const initStream = (stream: MediaStream) => {
      initSave(stream);
    };

    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then(initStream);
  }, []);

  return (
    <>
      <Head>
        <title>Jambox</title>
      </Head>
      <Center flex="1" flexDir="column">
        <Heading>Jambox</Heading>
        <Text>Create a new jam</Text>
        <Button onClick={downloadSoundFile}>Download file</Button>
        <Button onClick={isSaving ? handleStop : handleStart}>
          {isSaving ? 'Stop' : 'Start'}
        </Button>
      </Center>
    </>
  );
};
export default Index;
