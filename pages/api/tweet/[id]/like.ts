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
  const alreadyExists = await db.like.findFirst({
    where: {
      tweetId: +id.toString(),
      userId: user?.id,
    },
  });
  if (alreadyExists) {
    await db.like.delete({
      where: {
        id: alreadyExists.id,
      },
    });
  } else {
    await db.like.create({
      data: {
        user: {
          connect: {
            id: user?.id,
          },
        },
        tweet: {
          connect: {
            id: +id.toString(),
          },
        },
      },
    });
  }
  res.json({
    ok: true,
  });
}

export default withApiSession(withHandler({ methods: ["POST"], handler }));
