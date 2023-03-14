import { useEffect, useState } from "react";
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

enum Status {
  loading,
  error,
  completed,
}

type StoryItemProps = {
  story: Story;
};

function StoryItem({ story }: StoryItemProps) {
  const [karma, setKarma] = useState<number | null>(null);

  useEffect(() => {
    async function getKarma() {
      try {
        const authorInfo = await getJsonResource(
          `https://hacker-news.firebaseio.com/v0/user/${story.by}.json`
        );

        setKarma(authorInfo.karma);
      } catch {
        // we won't handle the error here, we will simply not display author karma
      }
    }

    getKarma();
  }, []);

  // story timestamp is in seconds so we need to convert it to ms
  const date = new Date(story.time * 1000);

  return (
    <div className="story-item">
      <div className="story-item-header">
        <h3>{story.title}</h3>
        <em>
          {date.toDateString()} {date.toLocaleTimeString()}
        </em>
      </div>
      <div>
        <img src={`https://picsum.photos/300/200?random=${story.id}`} />
      </div>
      <div className="story-item-info">
        <div>
          By:{" "}
          <strong>
            {story.by} {karma !== null && <span>({karma})</span>}
          </strong>{" "}
        </div>
        <div>
          Score: <strong>{story.score}</strong>
        </div>
        <div>
          <a target="_blank" href={story.url}>
            Read full story
          </a>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [status, setStatus] = useState<Status>(Status.loading);
  const [error, setError] = useState<Error>();
  const [stories, setStories] = useState<Story[]>();

  useEffect(() => {
    async function loadStories() {
      try {
        const topStoriesIds = await getTopStoriesIds();
        let results: Story[] = [];

        // not all results are actual stories, some can be an "ask"
        while (results.length < 10) {
          // load 10 possible stories at a time
          const batch = topStoriesIds.splice(0, 10);
          const batchPromises = batch.map((id) =>
            getJsonResource(
              `https://hacker-news.firebaseio.com/v0/item/${id}.json`
            )
          );

          const items = await Promise.all(batchPromises);

          // a story has an url field and type "story"
          results = [
            ...results,
            ...items.filter((s) => !!s.url && s.type === "story"),
          ];
        }

        // keep only first 10
        results = results.slice(0, 10);

        // sort ascending by score
        results.sort((a, b) => a.score - b.score);

        setStatus(Status.completed);
        setStories(results);
      } catch (e) {
        setStatus(Status.error);
        setError(e as Error);
      }
    }

    loadStories();
  }, []);

  return (
    <div className="App">
      <h1>Top stories</h1>
      <div className="stories">
        {status === Status.loading && "Loading..."}
        {status === Status.error && error?.message}
        {status === Status.completed &&
          stories?.map((s) => <StoryItem story={s} key={s.id} />)}
      </div>
    </div>
  );
}

export default App;
