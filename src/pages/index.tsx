import React, { useEffect, useRef, useState } from 'react';

import { Button, Center, Heading, Stack, Text } from '@chakra-ui/react';
import Head from 'next/head';

const Index = () => {
  const recordedChunksRef = useRef([]);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder>();

  const [sounds, setSounds] = useState([]);

  // Create a hidden link and use it to download the created file
  const handleDownloadSample =
    ({ soundData, name = `${Date.now()}` }) =>
    () => {
      const linkElt = document.createElement('a');
      linkElt.href = URL.createObjectURL(new Blob(soundData));
      linkElt.download = `${name}.wav`;
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
      </Center>
    </>
  );
};
export default Index;
