import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import {
  Form,
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  json,
  useMatches,
  useRouteLoaderData,
} from "@remix-run/react";
import { getAuthenticatedUser } from "./auth.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getAuthenticatedUser({ request });

  return json({ user });
};

export const useOptionalUser = () => {
  const data = useRouteLoaderData<typeof loader>("root");
  if (data?.user) {
    return data.user;
  }
  return null;
};

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export default function App() {
  const user = useOptionalUser();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <nav>
          {user ? (
            <Form method="POST" action="logout">
              <button type="submit">Se deconnecter</button>
            </Form>
          ) : (
            <Link to="/register">Crée un compte</Link>
          )}
        </nav>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
