import { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import dashjs from "dashjs";
import Hls from "hls.js";
import { channels } from "~/data/channels";
type Channel = {
  id: number;
  title: string;
  logo: string;
  stream_link: string;
};

export const meta = () => [
  { title: "PH IPTV Player" },
  { name: "description", content: "Free PH IPTV streaming with Remix." },
];

export default function Index() {
  const playerRef = useRef<HTMLVideoElement>(null);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);

  const channels: Channel[] = [
    {
      id: 87,
      title: "NBA TV Philippines",
      logo:
        "https://upload.wikimedia.org/wikipedia/en/thumb/d/de/NBA_TV_Philippines.png/1200px-NBA_TV_Philippines.png",
      stream_link:
        "https://qp-pldt-live-grp-02-prod.akamaized.net/out/u/pl_nba.mpd",
    },
    {
      id: 2,
      title: "TV5 HD",
      logo:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/TV5_%28Philippines%29_logo.svg/2048px-TV5_%28Philippines%29_logo.svg.png",
      stream_link:
        "https://qp-pldt-live-grp-02-prod.akamaized.net/out/u/tv5_hd.mpd",
    },
    // Add more channels as needed...
  ];

  useEffect(() => {
    const video = playerRef.current;
    if (!video || !streamUrl) return;

    // Cleanup any existing instances
    video.src = "";
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
    } else if (streamUrl.endsWith(".mpd")) {
      const player = dashjs.MediaPlayer().create();
      player.initialize(video, streamUrl, true);
    } else {
      video.src = streamUrl;
    }

    video.play().catch(() => {});
  }, [streamUrl]);

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <h1 className="text-2xl font-bold text-center mb-6">FREE PH IPTV</h1>

      {/* Video Player */}
      <div className="flex justify-center mb-8">
        <video
          ref={playerRef}
          className="video-js w-full max-w-4xl aspect-video rounded"
          controls
          autoPlay
        />
      </div>

      {/* Channel List */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {channels.map((ch) => (
          <button
            key={ch.id}
            onClick={() => setStreamUrl(ch.stream_link)}
            className="bg-gray-800 hover:bg-gray-700 rounded p-2 flex flex-col items-center"
          >
            <img src={ch.logo} alt={ch.title} className="h-12 object-contain" />
            <span className="mt-2 text-sm text-center">{ch.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
