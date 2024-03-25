import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, json, redirect, useLoaderData } from "@remix-run/react";
import { getAuthenticatedUser } from "~/auth.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getAuthenticatedUser({ request });
  if (user) {
    redirect("/");
  }

  try {
    const urlParams = new URL(request.url).searchParams;
    const token = urlParams.get("token");

    const response = await fetch(
      `http://localhost:5000/auth/verify-reset-password-token?token=${token}`,
      {
        headers: { "Content-type": "application/json" },
      }
    );

    const { error, message } = await response.json();

    return json({ error, message, token });
  } catch (error) {
    const err = error as Error;
    return json({ error: true, message: err.message, token: "" }); // Returning an empty object as response
  }
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const jsonData = Object.fromEntries(formData);

  console.log(jsonData);

  const { action } = jsonData;

  switch (action) {
    case "request-password'reset":
      {
        const response = await fetch(
          "http://localhost:5000/auth/request-reset-password",
          {
            method: "POST",
            body: JSON.stringify(jsonData),
            headers: { "Content-type": "application/json" },
          }
        );

        const { error, message } = await response.json();
        if (error) {
          return json({ error, message });
        }
      }
      break;
    case "reset-password": {
      const response = await fetch(
        "http://localhost:5000/auth/reset-password",
        {
          method: "POST",
          body: JSON.stringify(jsonData),
          headers: { "Content-type": "application/json" },
        }
      );

      const { error, message } = await response.json();
      if (error) {
        return json({ error, message });
      }
    }
  }
};

export default function ForgotPasswordForm() {
  const { error, message, token } = useLoaderData<typeof loader>();

  if (!token) {
    return (
      <>
        <Form method="POST">
          <h1>Mot de passe oubliée</h1>
          <input type="email" name="email" required placeholder="Votre email" />

          <button type="submit">Récuperer mon mot de passe</button>
        </Form>
        <input type="hidden" name="action" value="request-password-reset" />
      </>
    );
  }
  if (token && error === true) {
    return (
      <>
        {error?.message ? <p>Error:{error}</p> : null}
        Message:{message}
      </>
    );
  }
  if (token && error === false) {
    return (
      <>
        <Form method="POST">
          <h1>Changez de mot de passe </h1>
          <input
            type="password"
            name="password"
            required
            placeholder="Choisissez un nouveau mot de passe"
          />

          <button type="submit">Récuperer mon mot de passe</button>
        </Form>
        <input
          type="hidden"
          name="action"
          value="reset-passwordrequest-password-reset"
        />
      </>
    );
  }
}
