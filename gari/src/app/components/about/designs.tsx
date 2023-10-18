"use client";
import {
  Box,
  Image,
  Flex,
  Text,
  HStack
} from "@chakra-ui/react";
import React from 'react';
import { Parallax, ParallaxProvider, ParallaxBanner, ParallaxBannerLayer } from 'react-scroll-parallax';


interface PanelProps {
  imageUrl: string;
  content: string;
  boxHeight: string
  boxWidth: string
}

export default function generatePanel(panelProps: PanelProps) {
  return (
    <>

      <ParallaxBanner style={{ aspectRatio: '2 / 1' }}>
        <ParallaxBannerLayer image={panelProps.imageUrl} speed={-20} />
        <ParallaxBannerLayer>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Box bg='white' w={panelProps.boxWidth+"px"} h={panelProps.boxHeight+"px"} p={4} border="2px solid black">
              <Text fontSize={{ base: "md", lg: "3xl" }}color={"black"}>
                {panelProps.content}

              </Text>
            </Box>
          </div>
        </ParallaxBannerLayer>
      </ParallaxBanner>
    </>

  )
};


