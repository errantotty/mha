import { useEffect } from "react";
import "./App.css";

async function getJsonResource(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.json();
}

async function getTopStoriesIds(): Promise<number[]> {
  const ids = await getJsonResource(
    "https://hacker-news.firebaseio.com/v0/topstories.json"
  );

  if (!Array.isArray(ids)) {
    throw new Error(`Content-type error! Expected response to be an array`);
  }

  return ids;
}

interface Story {
  title: string;
  url: string;
  score: number;
  time: number;
  id: number;
  by: string;
  type: string;
}

function App() {
  useEffect(() => {
    async function loadStories() {
      try {
        const topStoriesIds = await getTopStoriesIds();
        let stories: Story[] = [];

        // not all results are actual stories, some can be an "ask"
        while (stories.length < 10) {
          // load 10 possible stories at a time
          const batch = topStoriesIds.splice(0, 10);
          const batchPromises = batch.map((id) =>
            getJsonResource(
              `https://hacker-news.firebaseio.com/v0/item/${id}.json`
            )
          );

          const items = await Promise.all(batchPromises);

          // a story has an url field and type "story"
          stories = [
            ...stories,
            ...items.filter((s) => !!s.url && s.type === "story"),
          ];
        }

        // keep only first 10
        stories = stories.slice(0, 10);

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
