import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import {
  Form,
  json,
  redirect,
  useActionData,
  useLoaderData,
} from "@remix-run/react";
import { getAuthenticatedUser } from "~/auth.server";
import { authenticateUser, commitUserToken } from "~/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getAuthenticatedUser({ request });
  if (user) {
    redirect("/");
  }
  return json({});
};
export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const jsonData = Object.fromEntries(formData);
  console.log(jsonData);

  const response = await fetch("http://localhost:5000/auth/register", {
    method: "POST",
    body: JSON.stringify(jsonData),
    headers: { "Content-type": "application/json" },
  });

  const { access_token, error, message } = await response.json();
  if (error) {
    return json({ error, message });
  }
  if (access_token) {
    console.log(access_token);
    return await authenticateUser({ request, userToken: access_token });
  }
  return json({ error: true, message: "Une erreur inattendu est survenue !" });
};

export default function RegisterForm() {
  const formFeedback = useActionData<typeof action>();
  return (
    <Form method="POST">
      <input type="email" name="email" required placeholder="Votre email" />
      <input
        type="password"
        name="password"
        required
        placeholder="Mot de passe"
      />
      <input type="text" name="name" required placeholder="votre nom" />
      <button type="submit">Crée un compte</button>
      {formFeedback?.message ? <span>{formFeedback?.message}</span> : null}
    </Form>
  );
}
