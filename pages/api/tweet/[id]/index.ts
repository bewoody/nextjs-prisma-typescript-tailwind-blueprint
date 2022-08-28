import withHandler from "../../../../lib/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../../lib/db";
import { withApiSession } from "../../../../lib/withSession";
import { ResponseType } from "../../../../types/types";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { id },
    session: { user },
  } = req;
  const tweet = await db.tweet.findUnique({
    where: {
      id: +id.toString(),
    },
    include: {
      _count: {
        select: {
          likes: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
  if (!tweet) res.status(404).json({ ok: false });
  const isLiked = Boolean(
    await db.like.findFirst({
      where: {
        tweetId: tweet?.id,
        userId: user?.id,
      },
      select: {
        id: true,
      },
    })
  );
  res.json({
    ok: true,
    tweet,
    isLiked,
  });
}

export default withApiSession(withHandler({ methods: ["GET"], handler }));
