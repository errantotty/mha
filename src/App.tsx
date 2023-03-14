import { useEffect } from "react";
import "./App.css";

async function getJsonResource(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.json();
}

async function getTopStoriesIds(numItems: number = 10): Promise<number[]> {
  const stories = await getJsonResource(
    "https://hacker-news.firebaseio.com/v0/topstories.json"
  );

  if (!Array.isArray(stories)) {
    throw new Error(`Content-type error! Expected response to be an array`);
  }

  return stories.slice(0, numItems);
}

interface Story {
  title: string;
  url: string;
  score: number;
  time: number;
  id: number;
  by: string;
}

function App() {
  useEffect(() => {
    async function loadStories() {
      try {
        const topStoriesIds = await getTopStoriesIds();

        const getStoryPromises = topStoriesIds.map((id) =>
          getJsonResource(
            `https://hacker-news.firebaseio.com/v0/item/${id}.json`
          )
        );

        const stories: Story[] = await Promise.all(getStoryPromises);

        // sort ascending by score
        stories.sort((a, b) => a.score - b.score);

        console.log(stories);
      } catch (e) {
        console.log(e);
      }
    }

    loadStories();
  }, []);

  return (
    <div className="App">
      <h1>Top stories</h1>
    </div>
  );
}

export default App;
