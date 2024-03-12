import { createCookieSessionStorage, redirect } from "@remix-run/node";

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: { name: "__session", secrets: ["secredtdepoliche"] },
  });

export const getUserToken = async ({ request }: { request: Request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  return session.get("userToken");
};
export const commitUserToken = async ({
  request,
  userToken,
}: {
  request: Request;
  userToken: string;
}) => {
  const session = await getSession(request.headers.get("Cookie"));
  session.set("userToken", userToken);
  return await commitSession(session);
};
export const logout = async ({
  request,
  userToken,
}: {
  request: Request;
  userToken: string;
}) => {
  const session = await getSession(request.headers.get("Cookie"));
  const desstroyedSession = await destroySession(session);
  return redirect("/", {
    headers: { "Set-Cookie": desstroyedSession },
  });
};
