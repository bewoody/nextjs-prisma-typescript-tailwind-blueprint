import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Input from "../components/input";
import useMutation from "../lib/useMutation";
import { ResponseType } from "../types/types";

interface LoginForm {
  email: string;
  password: string;
}

const LogIn: NextPage = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm<LoginForm>({ mode: "onChange" });
  const [signin, { data, loading }] =
    useMutation<ResponseType>("/api/users/signin");
  const onValid = ({ email, password }: LoginForm) => {
    if (loading) return;
    signin({ email, password });
  };
  useEffect(() => {
    if (data && data?.ok) {
      router.push("/");
    }
  }, [data]);
  return (
    <div className="grid grid-cols-2 h-screen">
      <div
        className="flex justify-center items-center"
        style={{
          backgroundImage:
            "url('https://abs.twimg.com/sticky/illustrations/lohp_1302x955.png')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <svg
          className="w-96 h-96 text-white"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
            clipRule="evenodd"
          ></path>
        </svg>
      </div>
      <div className="flex flex-col justify-center px-8 bg-black">
        <svg
          className="w-12 h-12 text-white"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
            clipRule="evenodd"
          ></path>
        </svg>
        <h1 className="text-white text-6xl font-bold my-12">
          지금 일어나고 있는 일
        </h1>
        <div className="flex flex-col gap-6 w-full">
          <h3 className="text-white text-3xl font-semibold">
            오늘 트위터에 가입하세요.
          </h3>
          <hr className="border-gray-700" />
          <div>
            <button
              onClick={() => router.push("/create-account")}
              className="text-white py-2 px-8 bg-sky-500 rounded-2xl w-full font-semibold hover:bg-sky-600 transition ease-in-out"
            >
              이메일 주소로 가입하기
            </button>
          </div>
          <div className="mt-10 flex flex-col gap-5 items-start w-full">
            <p className="text-white font-semibold text-lg w-full">
              이미 트위터에 가입하셨나요?
            </p>
            <form
              className="flex flex-col gap-6 w-full"
              onSubmit={handleSubmit(onValid)}
            >
              <Input
                register={register("email", {
                  required: "Email is required.",
                  pattern: {
                    value:
                      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    message: "This is not an email format.",
                  },
                })}
                name="email"
                placeholder="Please Enter Email"
                type="text"
              />
              <Input
                register={register("password", {
                  required: "Password is required.",
                })}
                name="password"
                placeholder="Please Enter Password"
                type="password"
              />
              <input
                type="submit"
                className="bg-white rounded-2xl font-semibold py-2 px-8 w-full hover:bg-gray-200 transition ease-in-out disabled:bg-gray-500 disabled:text-gray-600"
                value={loading ? "로그인 중" : "로그인"}
                disabled={!isValid || loading}
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
