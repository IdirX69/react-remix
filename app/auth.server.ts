import { getUserToken, logout } from "./session.server";

export const getAuthenticatedUser = async ({
  request,
}: {
  request: Request;
}) => {
  const userToken = await getUserToken({ request });
  console.log(userToken);

  if (userToken === undefined) {
    return null;
  }
  try {
    const response = await fetch("http://localhost:5000/auth", {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    });
    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
    throw await logout({ request });
  }
};
