import { getUserToken, logout } from "./session.server";

export const getAuthenticatedUser = async ({
  request,
}: {
  request: Request;
}) => {
  const userToken = await getUserToken({ request });
  if (userToken === undefined) {
    return null;
  }
  try {
    const response = await fetch("http://localhost:5000/auth", {
      headers: {
        "Content-type": "application/json",
        Authorization: `Baerer ${userToken}`,
      },
    });

    return await response.json();
  } catch (error) {
    console.error(error);
    throw await logout({ request });
  }
};
