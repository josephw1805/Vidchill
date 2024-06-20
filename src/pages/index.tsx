import Head from "next/head";
import {
  ErrorMessage,
  Layout,
  LoadingMessage,
  MultiColumnVideo,
} from "../components/Components";
import { type NextPage } from "next";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const { data, isLoading, error } = api.video.getRandomVideos.useQuery(30);
  const errorTypes = error ?? !data ?? data.videos.length === 0;

  const Error = () => {
    if (isLoading) {
      return <LoadingMessage />;
    } else if (errorTypes) {
      return (
        <ErrorMessage
          message="No vidoes"
          description="Sorry there are no videos at this time"
        />
      );
    } else {
      return <></>;
    }
  };

  return (
    <>
      <Head>
        <title>VidChil</title>
        <meta
          name="description"
          content=" Enjoy the videos and music you love, upload original content, and share it all with friends, family, and the world on VidChil."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        {errorTypes ? (
          <Error />
        ) : (
          <MultiColumnVideo
            videos={
              data?.videos.map((video) => ({
                id: video?.id ?? "",
                title: video?.title ?? "",
                thumbnailUrl: video?.thumbnailUrl ?? "",
                createdAt: video?.createdAt ?? new Date(),
                views: video?.views ?? 0,
              })) ?? []
            }
            users={
              data?.users.map((user) => ({
                name: user?.name ?? "",
                image: user?.image ?? "",
              })) ?? []
            }
          />
        )}
      </Layout>
    </>
  );
};

export default Home;
