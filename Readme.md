# Merkle home assignment

This home assignment is based on vite-react-typescript boilerplate.
It does come with some nice css setup supporting light/dark mode.

## How to run

The project can be run via npm or yarn. For npm it is as simple as:

```bash
npm i
npm run dev
```

after which the project should be accessible at `http://localhost:5173/`.

## The solution

I tried to keep things as simple as possible, and because the App.tsx file didn't grow
too big, I chose to keep the code in one place.

After a bit of experimenting with the `topstories.json` endpoint, I have noticed that
not all results returned are stories. Some of them are "asks" meaning they have an
embedded text as a `text` field. For this reason, I chose to load 10 items at a time
until I have enough stories loaded to be displayed. I could have made the while loop
to load only one item at a time but that meant on a slow network, it could take a while.
Having some parallel requests is a bit of an optimization (maybe a premature one).

The author karma score is "lazy" loaded on each story item component mount. If that request
errors for some reason, I chose to not display the score instead of alarming the user.

For the layout, I have been using flexbox and tried to do my best in adjusting the spacing
so it looks decent (I spent quite some time tweaking it). In a somehow mobile-first approach,
I chose to make the maximum size of a story item to maximum 300px. This allows 4 items per row
on desktop and 1 item per row on mobile.

For the story image, I used a service that randomly generates and image from the web. A static
asset of same size could have been used but this makes the app a bit more "alive".

It seems that it took me 6 hours to write the solution with a few breaks, including lunch time.
It has definitely been fun to work on it, especially the layout adjustments.

/Elvis