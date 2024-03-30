import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, json, redirect } from "@remix-run/react";
import { getAuthenticatedUser } from "~/auth.server";

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

  const response = await fetch("http://localhost:5000/articles", {
    method: "POST",
    body: JSON.stringify(jsonData),
    headers: { "Content-type": "application/json" },
  });

  const { error, message } = await response.json();
  if (!error) {
    return json({ error, message });
  }

  return json({ error: true, message: "Une erreur inattendu est survenue !" });
};

export default function AddArticle() {
  return (
    <Form method="POST">
      <input type="text" name="name" required placeholder="Nom de l'article" />
      <input
        type="text"
        name="description"
        required
        placeholder="Déscription de l'article"
      />
      <input type="number" name="price" required placeholder="votre nom" />
      <input type="file" name="image" required placeholder="addresse" />
      <button type="submit">Ajouter</button>
    </Form>
  );
}
