import nextConnect from "next-connect";
import { signin } from "../../src/lib/database/middlewares/auth";
import cookieDef from "../../src/lib/database/middlewares/cookieDef";

const handler = nextConnect();

handler
  .use(cookieDef)
  .use((req, res, next) => {
    try {
      req.body = JSON.parse(req.body);
      return next();
    } catch (err) {
      console.error("Invalid JSON body", req.body);
      return res.status(400).json({ error: "Invalid JSON body" });
    }
  })
  .use(signin)
  .post((req, res) => {
    if (req.err) {
      console.error("Signin Error", req.err);
      res.status(401).json({ error: "Login Error" });
    } else {
      const future = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30 * 3);
      res.setHeader("Set-Cookie", [
        `refresh-token=${req.refresh_token}; HttpOnly; Path=/; Expires=${future.toUTCString()}; SameSite=Lax${process.env.NODE_ENV === "production" ? "; Secure" : ""}`,
      ]);
      res.json({
        token: req.access_token,
        session_data: req.user,
      });
    }
  });

export default handler;
