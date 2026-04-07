export function VideoPlayer({ url }: { url: string }) {
  return (
    <div className="w-full aspect-video rounded-xl overflow-hidden border border-neutral-800 bg-black">
      <iframe
        src={url}
        title="Session recording"
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

