import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { ErrorMessage, LoadingMessage } from "./ErrorMessage";
import Head from "next/head";
import { UserImage } from "./Components";
import Image from "next/image";
import { Button, FollowButton } from "./Buttons/Buttons";
import { Edit } from "./Icons/Icons";
import { useEffect } from "react";
import Link from "next/link";

export default function ProfileHeader() {
  const router = useRouter();
  const { userId } = router.query;
  const { data: sessionData } = useSession();

  const tabs = [
    {
      name: "Videos",
      path: `/${String(userId)}/ProfileVideos`,
      current: router.pathname === `/[userId]/ProfileVideos`,
    },
    {
      name: "Playlists",
      path: `/${String(userId)}/ProfilePlaylists`,
      current: router.pathname === `/[userId]/ProfilePlaylists`,
    },
    {
      name: "Annoucements",
      path: `/${String(userId)}/ProfileAnnouncements`,
      current: router.pathname === `/[userId]/ProfileAnnouncements`,
    },
    {
      name: "Following",
      path: `/${String(userId)}/ProfileFollowing`,
      current: router.pathname === `/[userId]/ProfileFollowing`,
    },
  ];

  useEffect(() => {
    tabs.forEach((nav) => {
      nav.current = nav.path === router.pathname;
    });
  }, [router.pathname]);

  const { data, isLoading, error } = api.user.getChannelById.useQuery({
    id: userId as string,
    viewerId: sessionData?.user?.id ?? "",
  });

  const channel = data?.user;
  const viewer = data?.viewer;
  const errorTypes = !channel || !viewer || !data || error;

  const Error = () => {
    if (isLoading) {
      return <LoadingMessage />;
    } else if (errorTypes) {
      return (
        <ErrorMessage
          icon="GreenPeople"
          message="Error loading Channel"
          description="Sorry there is an error loading the channel at this time."
        />
      );
    } else {
      return <></>;
    }
  };

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <>
      <Head>
        <title>{channel?.name ? channel.name + " VidChil Channel" : ""}</title>
        <meta name="description" content={channel?.description ?? ""} />
        <link ref="icon" href="/favicon.ico" />
      </Head>
      {errorTypes ? (
        <Error />
      ) : (
        <>
          <Image
            className="h-32 w-full object-cover lg:h-64"
            src={channel.backgroundImage ?? "/background.jpg"}
            width={2000}
            height={2000}
            alt="Background"
          />
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="!-mt-8 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
              <div className="flex">
                <UserImage
                  className="-mt-2 h-28 w-28 rounded-full ring-4 ring-white sm:h-36 sm:w-36"
                  image={channel.image ?? ""}
                />
              </div>
              <div className="mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
                <div className="mt-6 min-w-0 flex-1 md:block">
                  <h1 className="truncate text-2xl font-bold text-gray-900">
                    {channel.name}
                  </h1>
                  <p className="text-regular text-gray-600">{channel.handle}</p>
                  <div className="mt-1 flex text-xs">
                    <p className="mr-2 text-sm text-gray-600">
                      {channel.followers} Followers
                    </p>
                    <p className="text-sm text-gray-600">
                      {channel.followings} Following
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex justify-stretch space-y-3 sm:space-x-4 sm:space-y-0">
                  {userId === sessionData?.user.id ? (
                    <Button
                      variant="primary"
                      className="ml-2 flex"
                      size="2xl"
                      href="/Settings"
                    >
                      <Edit className="mr-2 h-5 w-5 shrink-0 stroke-white" />
                      Edit
                    </Button>
                  ) : (
                    <FollowButton
                      followingId={userId as string}
                      viewer={{
                        hasFollowed: viewer.hasFollowed,
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="mb-8 mt-4 overflow-x-auto border-b border-gray-200">
            <nav className="flex min-w-max whitespace-nowrap" aria-label="Tabs">
              {tabs.map((tab) => (
                <Link
                  key={tab.name}
                  href={tab.path}
                  onClick={(e) => {
                    e.preventDefault();
                    void router.push(tab.path);
                  }}
                  className={classNames(
                    tab.current
                      ? "border-primary-500 bg-primary-50 text-primary-600"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                    "w-full border-b-4 px-1 py-4 text-center text-sm font-medium"
                  )}
                  aria-current={tab.current ? "page" : undefined}
                >
                  {tab.name}
                </Link>
              ))}
            </nav>
          </div>
        </>
      )}
    </>
  );
}
