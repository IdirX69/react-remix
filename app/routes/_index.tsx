import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form, json } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};
export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const jsonData = Object.fromEntries(formData);
  const response = await fetch("http://localhost:5000/auth/login", {
    method: "POST",
    body: JSON.stringify(jsonData),
  });
  const token = await response.json();
  console.log(token);
  return json({});
};

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Remix</h1>
      <Form method="POST">
        <input type="email" name="email" required />
        <input type="password" name="password" required />
        <button type="submit">Submit</button>
      </Form>
    </div>
  );
}
