import * as bcrypt from "bcrypt";
import withHandler from "../../../lib/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../lib/db";
import { withApiSession } from "../../../lib/withSession";
import { ResponseType } from "../../../types/types";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { email, password } = req.body;
  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) return res.status(404).end();
    // check password
    const passwordOk = await bcrypt.compare(password, user.password);
    if (!passwordOk) {
      res.status(400).json({ ok: false, error: "Incorrect password." });
    }
    req.session.user = {
      id: user.id,
    };
    await req.session.save();
    res.json({ ok: true });
  } catch (error) {
    res.json({ ok: false, error: "Can't create account." });
  }
}

export default withApiSession(
  withHandler({ methods: ["POST"], handler, isPrivate: false })
);
