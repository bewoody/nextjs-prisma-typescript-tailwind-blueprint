import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Input from "../components/input";
import useMutation from "../lib/useMutation";
import { ResponseType } from "../types/types";

interface CreateAccountForm {
  name: string;
  email: string;
  password: string;
}

const CreateAccount: NextPage = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<CreateAccountForm>({ mode: "onChange" });
  const [signup, { data, loading }] =
    useMutation<ResponseType>("/api/users/signup");
  const onValid = ({ name, email, password }: CreateAccountForm) => {
    if (loading) return;
    signup({ name, email, password });
  };
  useEffect(() => {
    if (data?.ok) {
      router.push("/log-in");
    }
    if (data && !data.ok) {
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
            계정을 생성하세요.
          </h3>
          <form
            className="flex flex-col gap-6"
            onSubmit={handleSubmit(onValid)}
          >
            <div>
              <Input
                register={register("name", { required: "Name is required." })}
                type="text"
                name="name"
                placeholder="이름"
                required
              />
              {errors.name ? (
                <p className="text-sm text-red-500 font-normal mt-2">
                  {errors.name.message}
                </p>
              ) : null}
            </div>
            <div>
              <Input
                register={register("email", {
                  required: "Email is required.",
                  pattern: {
                    value:
                      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    message: "This is not an email format.",
                  },
                })}
                type="email"
                name="email"
                placeholder="이메일"
                required
              />
              {errors.email ? (
                <p className="text-sm text-red-500 font-normal mt-2">
                  {errors.email.message}
                </p>
              ) : null}
            </div>
            <div>
              <Input
                register={register("password", {
                  required: "Password is required.",
                })}
                type="password"
                name="password"
                placeholder="비밀번호"
                required
              />
              {errors.password ? (
                <p className="text-sm text-red-500 font-normal mt-2">
                  {errors.password.message}
                </p>
              ) : null}
            </div>
            <input
              className="bg-white rounded-2xl font-semibold py-2 px-8 w-full hover:bg-gray-200 transition ease-in-out disabled:bg-gray-500 cursor-pointer"
              type="submit"
              value={loading ? "회원가입 중" : "회원가입"}
              disabled={!isValid || loading}
            />
          </form>
          <span
            className="text-sky-500 text-center cursor-pointer"
            onClick={() => router.push("/log-in")}
          >
            로그인 하러 가기
          </span>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;
