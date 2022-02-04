import React, { useRef } from 'react';

import {
  Button,
  Center,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useHistory } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { Page, PageContent } from '@/app/layout';
import { db } from '@/config/db';

import { PageContainer } from '../layout/Page';
import { SessionCard } from './SessionCard';

export const PageDashboard = () => {
  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const sessionIdToDelete = useRef<number>();

  const sessions = useLiveQuery(() => db.sessions.toArray());
  const isSessionsEmpty = !sessions?.length;
  const filteredSessions = sessions?.sort((a, b) => {
    if (a.updatedAt > b.updatedAt) return -1;
    if (a.updatedAt < b.updatedAt) return 1;
    return 0;
  });

  const createNewSession = async () => {
    const now = new Date();
    const sessionName = uuidv4();
    const sessionId = await db.sessions.add({
      name: sessionName,
      createdAt: now,
      updatedAt: now,
    });

    history.push(`/session/${sessionId}`);
  };

  const handleConfirmDelete = (sessionId) => () => {
    sessionIdToDelete.current = sessionId;
    onOpen();
  };

  const handleOpenSession = (sessionId) => () => {
    db.sessions.update(sessionId, { updatedAt: new Date() });
    history.push(`session/${sessionId}`);
  };

  return (
    <Page>
      <PageContent>
        <Center>
          <Heading size="md" mb="4">
            🎶 Poomtchit
          </Heading>
        </Center>

        {isSessionsEmpty && (
          <Flex
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            p={4}
            borderRadius={4}
            borderWidth={1}
          >
            <Text mb={1} fontSize="lg" fontWeight="bold">
              No session available
            </Text>
            <Text maxWidth="sm">
              A session is a collection of samples you can play with. Click the
              create button below to start a new one !
            </Text>
          </Flex>
        )}

        <PageContainer position="fixed" bottom={0} left={0} right={0} p={4}>
          <Button colorScheme="brand" size="lg" onClick={createNewSession}>
            Create new session
          </Button>
        </PageContainer>

        <Stack>
          {filteredSessions?.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              onDelete={handleConfirmDelete(session.id)}
              onOpen={handleOpenSession(session.id)}
            />
          ))}
        </Stack>

        <Modal isOpen={isOpen} onClose={onClose} isCentered size="xs">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Delete session</ModalHeader>
            <ModalBody>
              <Text>
                You are about to delete the session. This operation cannot be
                undone. Continue ?
              </Text>
            </ModalBody>

            <ModalFooter px={0} pb={0} justifyContent="center">
              <Button
                flex={1}
                borderTopRadius={0}
                borderBottomRightRadius={0}
                borderTopWidth={1}
                variant="ghost"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                flex={1}
                borderTopRadius={0}
                borderBottomLeftRadius={0}
                borderLeftWidth={1}
                colorScheme="red"
                onClick={() => {
                  db.sessions.delete(sessionIdToDelete.current);
                  onClose();
                }}
              >
                Confirm deletion
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </PageContent>
    </Page>
  );
};
