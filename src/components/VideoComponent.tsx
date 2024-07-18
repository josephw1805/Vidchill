import Image from "next/image";
import Link from "next/link";
import { Thumbnail } from "./Components";
import moment from "moment";

interface VideoComponentProps {
  videos: {
    id: string;
    title: string;
    thumbnailUrl: string;
    createdAt: Date;
    views: number;
  }[];
  users: {
    image: string;
    name: string;
  }[];
  refetch?: () => Promise<unknown>;
}

export const MultiColumnVideo: React.FC<VideoComponentProps> = ({
  videos,
  users,
}) => {
  return (
    <div className="flex flex-wrap gap-7 justify-center">
      {videos.map((video, index) => {
        const user = users[index];
        if (!user) return null;

        return (
          <Link
            key={video.id}
            href={`/video/${video.id}`}
            className="flex flex-col items-start justify-between hover:bg-gray-100"
          >
            <div className="relative w-full ">
              <Thumbnail thumbnailUrl={video.thumbnailUrl} />
              <div className="items-top relative mt-4 flex gap-x-4">
                <UserImage image={user.image} />
                <div className="max-w-[300px]">
                  <VideoTitle title={video.title} limitHeight />
                  <VideoInfo views={video.views} createdAt={video.createdAt} />
                  <UserName name={user.name || ""} />
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export const SingleColumnVideo: React.FC<VideoComponentProps> = ({
  videos,
  users,
}) => {
  return (
    <>
      {videos.map((video, index) => {
        const user = users[index];
        if (!user) {
          return null;
        }

        return (
          <Link href={`/video/${video.id}`} key={video.id}>
            <div className="flex flex-col gap-4 hover:bg-gray-100 lg:flex-row">
              <div className="relative aspect-[16/9] sm:aspect-[2/1] lg:w-64 lg:shrink-0">
                <Thumbnail thumbnailUrl={video.thumbnailUrl} />
              </div>
              <div>
                <VideoTitle title={video.title} />
                <VideoInfo views={video.views} createdAt={video.createdAt} />

                <div className="relative mt-2 flex flex-row items-center gap-x-4">
                  <UserImage image={user.image || ""} />
                  <UserName name={user.name || ""} />
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </>
  );
};

export const SmallSingleColumnVideo: React.FC<VideoComponentProps> = ({
  videos,
  users,
  refetch,
}) => (
  <>
    {videos.map((video, index) => {
      const user = users[index];
      if (!user) {
        return null;
      }
      return (
        <Link href={`/video/${video.id}`} key={video.id} onClick={refetch}>
          <div className="relative isolate my-4 flex flex-col gap-4 rounded-2xl border hover:bg-gray-100 lg:flex-row">
            <div className="aspect-[16/9] sm:aspect-[2/1] lg:w-52 lg:shrink-0">
              <Thumbnail thumbnailUrl={video.thumbnailUrl} />
            </div>
            <div className="mt2 flex w-full flex-col items-start overflow-hidden text-sm max-lg:mx-2">
              <VideoTitle title={video.title} limitHeight limitSize />
              <VideoInfo views={video.views} createdAt={video.createdAt} />
              <UserName name={user.name || ""} />
            </div>
          </div>
        </Link>
      );
    })}
  </>
);

export function VideoTitle({
  title,
  limitHeight,
  limitSize,
}: {
  title: string;
  limitHeight?: boolean;
  limitSize?: boolean;
}) {
  return (
    <h1
      className={`max-w-md font-semibold leading-6 text-gray-900 group-hover:text-gray-600 ${limitSize ? "text-base" : "text-lg"} ${
        limitHeight ? "h-6 overflow-hidden" : ""
      }`}
    >
      {title}
    </h1>
  );
}

export function VideoInfo({
  views,
  createdAt,
}: {
  views: number;
  createdAt: Date;
}) {
  return (
    <div className="mt-1 flex max-h-6 items-start overflow-hidden text-sm">
      <p className="mr-2 text-gray-600">
        {views}
        <span> Views</span>
      </p>
      <p className="text-gray-600">{moment(createdAt).fromNow()}</p>
    </div>
  );
}

export function UserImage({
  image,
  className = "",
}: {
  image: string;
  className?: string;
}) {
  return (
    <div className={`relative h-9 w-9 ${className}`}>
      <Image
        src={image || "/profile.jpg"}
        alt="profile image"
        className="absolute rounded-full"
        fill
      />
    </div>
  );
}

export function UserName({ name }: { name: string }) {
  return (
    <p className="max-h-6 overflow-hidden text-sm font-semibold leading-6 text-gray-900">
      {name}
    </p>
  );
}
