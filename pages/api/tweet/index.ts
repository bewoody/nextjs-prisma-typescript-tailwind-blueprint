import withHandler from "../../../lib/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../lib/db";
import { withApiSession } from "../../../lib/withSession";
import { ResponseType } from "../../../types/types";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "GET") {
    const tweets = await db.tweet.findMany({
      include: {
        _count: {
          select: { likes: true },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.json({
      ok: true,
      tweets,
    });
  }
  if (req.method === "POST") {
    const {
      body: { description },
      session: { user },
    } = req;
    const tweet = await db.tweet.create({
      data: {
        description,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });
    res.json({
      ok: true,
      tweet,
    });
  }
}

export default withApiSession(
  withHandler({ methods: ["GET", "POST"], handler })
);
