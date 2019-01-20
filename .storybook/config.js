import { configure } from '@storybook/react';
import { addDecorator } from '@storybook/react';
import { initScreenshot, withScreenshot } from 'storybook-chrome-screenshot';
import { configureViewport, INITIAL_VIEWPORTS } from "@storybook/addon-viewport";


addDecorator(initScreenshot());
addDecorator(
  withScreenshot({
    delay: 1000,
    viewport: [
      // Mobile
      {
        width: 375,
        height: 667,
      },
      // Tablet
      {
        width: 768,
        height: 800,
      },
      // Desktop
      {
        width: 1200,
        height: 800,
      },
    ],
  }),
);

const newViewports = {
  768: {
    name: "768px wide",
    styles: {
      width: "768px",
      height: "800px",
    },
  },
  992: {
    name: "992px wide",
    styles: {
      width: "990px",
      height: "800px",
    },
  },
  1200: {
    name: "1200px wide",
    styles: {
      width: "1200px",
      height: "800px",
    },
  },
};

configureViewport({
  viewports: {
    ...INITIAL_VIEWPORTS,
    ...newViewports,
  },
  defaultViewport: "responsive",
});

function loadStories() {
  require('../src/stories');
}

configure(loadStories, module);