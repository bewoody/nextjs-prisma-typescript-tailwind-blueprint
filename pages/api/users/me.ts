import { NextApiRequest, NextApiResponse } from "next";
import { ResponseType } from "../../../types/types";
import db from "../../../lib/db";
import { withApiSession } from "../../../lib/withSession";
import withHandler from "../../../lib/withHandler";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "GET") {
    const profile = await db.user.findUnique({
      where: { id: req.session.user?.id },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    res.json({
      ok: true,
      profile,
    });
  }
}

export default withApiSession(withHandler({ methods: ["GET"], handler }));
