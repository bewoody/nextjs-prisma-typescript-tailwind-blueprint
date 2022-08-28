import { Tweet, User } from "@prisma/client";
import { NextPage } from "next";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import TweetItem from "../components/tweet";
import useMutation from "../lib/useMutation";
import useUser from "../lib/useUser";

interface UploadTweetForm {
  description: string;
}

interface UploadTweetMutation {
  ok: boolean;
  tweet: Tweet;
}

export interface TweetWithCount extends Tweet {
  _count: {
    likes: number;
  };
  user: User;
}

interface TweetsResponse {
  ok: boolean;
  tweets: TweetWithCount[];
}

const Home: NextPage = () => {
  const { user, isLoading: userLoading } = useUser();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<UploadTweetForm>({ mode: "onChange" });
  const { data, error, mutate } = useSWR<TweetsResponse>("/api/tweet");
  const [create, { data: createData, loading: createLoading }] =
    useMutation<UploadTweetMutation>("/api/tweet");
  const isLoading = !data && !error;
  const onValid = ({ description }: UploadTweetForm) => {
    if (createLoading) return;
    mutate(
      (prev) =>
        prev &&
        ({
          ...prev,
          tweets: [
            {
              id: prev.tweets[0].id + 1,
              description,
              user: {
                id: user?.id,
                name: user?.name,
                email: user?.email,
              },
              userId: user?.id,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              _count: {
                likes: 0,
              },
            },
            ...prev.tweets,
          ],
        } as any),
      false
    );
    create({ description });
  };
  useEffect(() => {
    if (createData?.ok) {
      reset();
    }
  }, [createData, reset]);
  return (
    <div className=" bg-black">
      <div className="max-w-screen-xl mx-auto h-screen flex justify-center">
        <div className="w-1/2 border-x border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <p className="text-white font-bold text-xl">Home</p>
            <form
              className="flex flex-col gap-6 mt-5"
              onSubmit={handleSubmit(onValid)}
            >
              <textarea
                {...register("description", { required: true })}
                rows={4}
                className="bg-transparent w-full text-white p-2"
                placeholder="What's happening?"
              />
              <input
                type="submit"
                className="text-white py-2 px-8 bg-sky-500 rounded-2xl w-full font-semibold hover:bg-sky-600 transition ease-in-out disabled:bg-gray-500 disabled:text-gray-600"
                value={"Tweet"}
                disabled={!isValid || createLoading}
              />
            </form>
          </div>
          {userLoading && isLoading ? (
            <span className="text-white">Loading...</span>
          ) : (
            data?.tweets?.map((tweet) => (
              <TweetItem key={tweet.id} {...tweet} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
