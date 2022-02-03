import { Flex } from '@chakra-ui/react';

export const Card = (props) => (
  <Flex
    flexDir="row"
    p={2}
    borderRadius="md"
    shadow="md"
    borderWidth={1}
    bgColor="white"
    {...props}
  />
);
