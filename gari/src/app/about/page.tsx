"use client";

import { ParallaxProvider, ParallaxBanner } from "react-scroll-parallax";

export default function About() {
  let isMobile = false;
  if (typeof window !== "undefined") {
    isMobile = window.innerWidth <= 768;
  }

  interface PanelProps {
    imageUrl: string;
    content: string;
  }

  function generatePanel(panelProps: PanelProps) {
    return (
      <ParallaxBanner
        layers={[{ image: panelProps.imageUrl, speed: -20 }]}
        style={{ aspectRatio: "2/1", height: "500px" }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              border: "2px solid black",
              width: "70%",
            }}
          >
            <h1
              style={{
                fontSize: isMobile ? "sm" : "2rem",
                color: "black",
                fontWeight: "thin",
              }}
            >
              {panelProps.content}
            </h1>
          </div>
        </div>
      </ParallaxBanner>
    );
  }

  const panel1props = {
    imageUrl:
      "https://images.unsplash.com/photo-1566020587334-bd85998d544e?auto=format&fit=crop&q=80&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&w=2833",
    content:
      "Gari generates a map of roads in Bhutan highlighting points with sharp turns and steep slopes.",
  };
  const panel2props = {
    content: `There is an alarming number of vehicles going off road from steep slopes which could be attributed to drinking, speeding, reckless driving, condition of the vehicle, roads, weather and environment. Regardless of the causes, Gari highlights high-risk zones where guardrails and other barriers must be placed to reduce fatalities.`,
    imageUrl:
      "https://i.pinimg.com/originals/84/2a/d6/842ad68b315b0f586c30b465221da609.jpg",
  };

  const panel3props = {
    imageUrl:
      "https://images.unsplash.com/photo-1622308933972-d07f377c6161?auto=format&fit=crop&q=80&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&w=2938",
    content:
      "Gari (गारी) is the hindi word for car which is a loanword used by most Bhutanese in informal contexts to refer to a car.",
  };

  const panel4props = {
    content:
      "Ideally a system to record a detailed entry about the accident location would help as there is a lack of data on locations of past car accidents to understand patterns in the landscape, climate and geography of these locations to identify potential high-risk zones for drivers. These locations can be prioritized first during projects involving road renovation. Better road infrastructure also would enhance economic development, accessibility and connectivity.",
    imageUrl:
      "https://i.pinimg.com/originals/84/2a/d6/842ad68b315b0f586c30b465221da609.jpg",
  };

  return (
    <main>
      <ParallaxProvider>
        {generatePanel(panel1props)}
        {generatePanel(panel2props)}
        {generatePanel(panel3props)}
        {generatePanel(panel4props)}
      </ParallaxProvider>
    </main>
  );
}
