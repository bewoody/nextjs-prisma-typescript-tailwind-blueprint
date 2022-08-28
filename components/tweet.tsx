import { useRouter } from "next/router";
import { TweetWithCount } from "../pages";

export default function TweetItem({
  id,
  description,
  user,
  createdAt,
  _count,
}: TweetWithCount) {
  const router = useRouter();
  return (
    <div
      className="flex flex-col p-6 border-b border-gray-700 gap-2 cursor-pointer"
      onClick={() => router.push(`/tweet/${id}`)}
    >
      <div>
        <span className="text-white font-bold">{user.email}</span>
        <span className="text-gray-600 text-sm ml-4">{createdAt}</span>
      </div>
      <p className="text-white">{description}</p>
      <div>
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-gray-500 hover:text-sky-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            ></path>
          </svg>
          <span className="text-gray-500 text-sm">{_count.likes}</span>
        </div>
      </div>
    </div>
  );
}
