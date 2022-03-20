import { Button, Flex, Text } from '@chakra-ui/react';
import dayjs from 'dayjs';
import { useLiveQuery } from 'dexie-react-hooks';

import { db } from '@/config/db';

export const SessionCard = ({ session, onDelete, onOpen }) => {
  const nbSample = useLiveQuery(() =>
    db.samples.where({ sessionId: session.id }).count()
  );

  return (
    <Flex layerStyle="card" flexDir="column" p={0}>
      <Flex mb={2} flexDir="column" p={4}>
        <Text fontWeight="bold">
          Session du {dayjs(session.createdAt).format('DD/MM/YYYY')}
        </Text>
        <Text fontSize="sm" color="gray.500">
          Last opened {dayjs(session.updatedAt).format('DD/MM/YYYY HH:mm')}
        </Text>
        <Text fontSize="sm" color="gray.500">
          {nbSample
            ? `${nbSample} Sample${nbSample > 1 ? 's' : ''}`
            : 'No samples'}
        </Text>
      </Flex>
      <Flex alignItems="center" justifyContent="center" borderTopWidth={1}>
        <Button
          variant="ghost"
          borderTopRadius={0}
          borderBottomRightRadius={0}
          textAlign="center"
          flex={1}
          colorScheme="red"
          onClick={onDelete}
        >
          Delete
        </Button>
        <Button
          variant="ghost"
          borderTopRadius={0}
          borderBottomLeftRadius={0}
          textAlign="center"
          flex={1}
          borderLeftWidth={1}
          onClick={onOpen}
        >
          Open
        </Button>
      </Flex>
    </Flex>
  );
};
