import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { Form, json, redirect, useLoaderData } from "@remix-run/react";
import { getAuthenticatedUser } from "~/auth.server";
import { commitUserToken } from "~/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  console.log("user");
  const user = await getAuthenticatedUser({ request });
  if (user) {
    redirect("/");
  }
  return json({ user });
};
export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const jsonData = Object.fromEntries(formData);

  const response = await fetch("http://localhost:5000/auth/login", {
    method: "POST",
    body: JSON.stringify(jsonData),
    headers: { "Content-type": "application/json" },
  });

  const { access_token } = await response.json();
  console.log(access_token);
  return json(
    {},
    {
      headers: {
        "Set-Cookie": await commitUserToken({
          request,
          userToken: access_token,
        }),
      },
    }
  );
};

export default function RegisterForm() {
  return (
    <Form method="POST">
      <input type="email" name="email" required placeholder="Votre email" />
      <input
        type="password"
        name="password"
        required
        placeholder="Mot de passe"
      />
      <input type="text" name="firstname" required placeholder="votre nom" />
      <button type="submit">Crée un compte</button>
    </Form>
  );
}
