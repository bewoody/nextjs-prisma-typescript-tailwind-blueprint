import * as bcrypt from "bcrypt";
import withHandler from "../../../lib/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../lib/db";
import { ResponseType } from "../../../types/types";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { email, name, password } = req.body;
  try {
    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser)
      res.status(409).json({
        ok: false,
        error: "This email is already taken.",
      });

    // hash password
    const uglyPassword = await bcrypt.hash(password, 10);
    await db.user.create({
      data: {
        name,
        email,
        password: uglyPassword,
      },
    });
    res.json({ ok: true });
  } catch (error) {
    res.json({ ok: false, error: "Can't create account." });
  }
}

export default withHandler({ methods: ["POST"], handler, isPrivate: false });
