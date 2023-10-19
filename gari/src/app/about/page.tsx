"use client";

import generatePanel from "../components/about/designs";
import { ParallaxProvider, Parallax } from "react-scroll-parallax";

export default function About() {
  const panel1props = {
    imageUrl:
      "https://images.unsplash.com/photo-1566020587334-bd85998d544e?auto=format&fit=crop&q=80&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&w=2833",
    content:
      "Gari generates a map of roads in Bhutan highlighting areas with sharp turns and steep slopes.",
    boxWidth: "900",
    boxHeight: "125",
  };
  const panel2props = {
    imageUrl:
      "https://coolbackgrounds.io/images/backgrounds/white/pure-white-background-85a2a7fd.jpg",
    content: `The reason why I created Gari was due to the alarming number of incidents where a vehicle veered off the road and I felt that this issue had to be addressed more. Although most of this could be attributed to the drivers from drinking, speeding or reckless driving, there could also be other external factors such as the condition of the vehicle, roads, weather and environment. Regardless of the causes, regions with sharp turns and areas of steep slops are high-risk zones which should have guardrails put in places as studies show that guardrails and other barriers can reduce fatalities.`,
    boxWidth: "1300",
    boxHeight: "350",
  };

  const panel3props = {
    imageUrl:
      "https://images.unsplash.com/photo-1622308933972-d07f377c6161?auto=format&fit=crop&q=80&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&w=2938",
    content:
      "Gari (गारी) is the hindi word for car which is a loanword used by Bhutanese in informal contexts to which I felt was a more casual way to name this interface.",
    boxWidth: "1200",
    boxHeight: "125",
  };

  const panel4props = {
    imageUrl:
      "https://coolbackgrounds.io/images/backgrounds/white/pure-white-background-85a2a7fd.jpg",
    content:
      "In terms of extension, ideally a system to record a detailed entry about the accident location would help as there is a lack of data on locations of past car accidents to understand patterns in the landscape, climate and geography of these locations to identify potential high-risk zones for drivers. These locations can be prioritized first during projects involving road renovation. Better road infrastructure also would enhance economic development, accessibility and connectivity.",
    boxWidth: "1250",
    boxHeight: "300",
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
