import React, { FC } from 'react';

import { Flex, FlexProps } from '@chakra-ui/react';

export type CardProps = FlexProps;

export const Card: FC<CardProps> = (props) => (
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
