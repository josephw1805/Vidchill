import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FollowButton } from "~/components/Buttons/Buttons";
import {
  ErrorMessage,
  Layout,
  LoadingMessage,
  ProfileHeader,
  UserImage,
} from "~/components/Components";
import { api } from "~/utils/api";

const ProfileFollowings: NextPage = () => {
  const router = useRouter();
  const { userId } = router.query;
  const { data: sessionData } = useSession();
  const {
    data: user,
    isLoading,
    error,
  } = api.user.getUserFollowings.useQuery({
    id: userId as string,
    viewerId: sessionData?.user.id,
  });

  const errorTypes =
    !user?.followings ?? error ?? user?.followings.length === 0;
  const Error = () => {
    if (isLoading) {
      return <LoadingMessage />;
    } else if (userId == sessionData?.user.id && errorTypes) {
      return (
        <ErrorMessage
          icon="GreenPeople"
          message="No people followed"
          description="You have not follow anyone else. Follow someone now!"
        />
      );
    } else if (errorTypes) {
      return (
        <ErrorMessage
          icon="GreenPeople"
          message="No people followed"
          description="This profile has not follow a new person."
        />
      );
    } else {
      return <></>;
    }
  };

  return (
    <Layout>
      <>
        <ProfileHeader />
        {errorTypes ? (
          <Error />
        ) : (
          <ul role="list" className="-mt-8 divide-y divide-gray-200">
            {user?.followings.map((following) => (
              <li className="py-4" key={following.following.id}>
                <div className="flex gap-2">
                  <UserImage
                    className="h-11 w-11"
                    image={following.following?.image ?? ""}
                  />
                  <div className="flex w-full flex-row justify-between">
                    <div className="flex flex-col text-sm">
                      <p className="font-semibold text-gray-900">
                        {following.following.name}
                      </p>
                      <p className="text-gray-600">
                        {following.following?.handle}
                      </p>
                    </div>
                    <FollowButton
                      followingId={following.following.id}
                      viewer={{ hasFollowed: following.viewerHasFollowed }}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </>
    </Layout>
  );
};

export default ProfileFollowings;
