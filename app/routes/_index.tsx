import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { Form, json, useLoaderData } from "@remix-run/react";
import { commitUserToken } from "~/session.server";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};
export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json({ isLoggedIn: false });
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

export default function Index() {
  const { isLoggedIn } = useLoaderData<typeof loader>();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Remix</h1>
      <span>{isLoggedIn ? "Loged" : "Not logged"}</span>
      <Form method="POST">
        <input type="email" name="email" required />
        <input type="password" name="password" required />
        <button type="submit">Submit</button>
      </Form>
    </div>
  );
}
