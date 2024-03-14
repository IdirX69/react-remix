import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { Form, json, useLoaderData } from "@remix-run/react";
import { getAuthenticatedUser } from "~/auth.server";
import { commitUserToken } from "~/session.server";
import { authenticateUser } from "../session.server";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getAuthenticatedUser({ request });

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

  return authenticateUser({ request, userToken: access_token });
};

export default function Index() {
  const { user } = useLoaderData<typeof loader>();

  const isConnected = user !== null;

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      {isConnected ? (
        <h1>Welcome {user.id ? user.id : "lol"}</h1>
      ) : (
        <LoginForm />
      )}
    </div>
  );
}

const LoginForm = () => {
  return (
    <Form method="POST">
      <input type="email" name="email" required />
      <input type="password" name="password" required />
      <button type="submit">Submit</button>
    </Form>
  );
};
