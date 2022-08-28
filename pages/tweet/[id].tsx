import { NextPage } from "next";
import { useRouter } from "next/router";
import useSWR from "swr";
import { TweetWithCount } from "..";
import useMutation from "../../lib/useMutation";

interface TweetResponse {
  ok: boolean;
  tweet: TweetWithCount;
  isLiked: boolean;
}

const Detail: NextPage = () => {
  const router = useRouter();
  const { data, error, mutate } = useSWR<TweetResponse>(
    `/api/tweet/${router.query?.id}`
  );
  const [like, { loading }] = useMutation(
    `/api/tweet/${router.query?.id?.toString()}/like`
  );
  const onClickLike = () => {
    if (!data) return;
    if (loading) return;
    mutate(
      (prev) =>
        prev && {
          ...prev,
          tweet: {
            ...prev.tweet,
            _count: {
              likes: prev.isLiked
                ? prev.tweet._count.likes === 0
                  ? 0
                  : prev.tweet._count.likes - 1
                : prev.tweet._count.likes + 1,
            },
          },
          isLiked: !prev.isLiked,
        },
      false
    );
    like({});
  };
  const isLoading = !data && !error;

  return (
    <div className=" bg-black">
      <div className="max-w-screen-xl mx-auto h-screen flex justify-center">
        <div className="w-1/2 border-x border-gray-700">
          <div className="p-6 border-b border-gray-700 flex items-center gap-10">
            <svg
              className="w-5 h-5 text-gray-300 cursor-pointer hover:text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              onClick={() => router.back()}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              ></path>
            </svg>
            <p className="text-white font-bold text-xl">Tweet</p>
          </div>
          <div className="p-6 border-b border-gray-700">
            {isLoading ? (
              <span>Loading...</span>
            ) : (
              <>
                <div className="flex flex-col gap-4 mb-4">
                  <p className="text-white">{data?.tweet?.user?.email}</p>
                  <p className="text-white text-2xl">
                    {data?.tweet?.description}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {data?.tweet?.createdAt}
                  </p>
                </div>
                <div className="py-4 border-y border-gray-700 flex items-center">
                  <span className="text-white text-sm">
                    {data?.tweet?._count.likes}
                  </span>
                  <span className="text-gray-600 ml-1 text-sm">Likes</span>
                  {data?.isLiked ? (
                    <svg
                      className="w-5 h-5 text-sky-500 inline-block ml-3 cursor-pointer"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                      onClick={onClickLike}
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5 text-gray-500 hover:text-sky-500 inline-block ml-3 cursor-pointer"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      onClick={onClickLike}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      ></path>
                    </svg>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
