import { HeadersFunction, json, LoaderFunction } from "@remix-run/node";
import {
  Await,
  Form,
  Link,
  useLoaderData,
  useSearchParams,
  useSubmit,
  useTransition,
} from "@remix-run/react";
import { useState, Suspense } from "react";
import { Theme, useTheme } from "utils/theme-provider";
import CountryCard from "~/components/CountryCard";
import Navbar from "~/components/Navbar";
import { defer } from "@remix-run/node";
import type { Country } from "./country/$id";
import SkeletonCard from "../components/SkeletonCard";

type LoaderData = {
  data: string[];
};

export let headers: HeadersFunction = ({ loaderHeaders }) => loaderHeaders;

export function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const region = url.searchParams.get("region");
  const search = url.searchParams.get("search");
  if (region) {
    const data: Promise<Country[]> = fetch(
      `https://restcountries.com/v3.1/region/${region}`
    ).then((res) => res.json());
    return defer(
      { countries: data },
      { headers: { "Cache-Control": "public, max-age=60" } }
    );
  }
  const data: Promise<Country[]> = fetch(
    "https://restcountries.com/v3.1/all"
  ).then((res) => res.json());

  return defer(
    { countries: data },
    { headers: { "Cache-Control": "public, max-age=60" } }
  );
}

export default function Index() {
  const [theme, setTheme] = useTheme();
  const [searchParams] = useSearchParams();
  const filter = searchParams.get("region");
  // const search = searchParams.get("search");
  const [search, setSearch] = useState("");
  const submit = useSubmit();
  const data = useLoaderData<typeof loader>();
  const toggleTheme = () => {
    setTheme((prevTheme: Theme | null) =>
      prevTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT
    );
  };
  const state = useTransition();

  return (
    <div>
      <Navbar theme={theme} toggleTheme={toggleTheme} state={state} />
      <main>
        <div className="lg:flex lg:justify-between lg:w-[80%] lg:mx-auto">
          <div className="w-[90%] m-auto mt-4 relative flex items-center lg:w-[50%]">
            <div className="absolute flex items-center ml-3">
              <i className="fa-solid fa-magnifying-glass text-darkgray dark:text-white"></i>
            </div>
            <Form method="get" action=".">
              <input
                className="w-full rounded-sm pl-10 pt-3 pb-3 pr- shadow-lg dark:bg-darkblue dark:text-white"
                type="text"
                name="search"
                id=""
                placeholder="Search for a country..."
                onChange={(e) => setSearch(e.target.value)}
              />
            </Form>
          </div>
          <div className="w-[90%] m-auto mt-4 lg:flex lg:justify-end">
            <Form method="get" action="." className="w-full flex justify-end">
              <select
                name="region"
                id=""
                onChange={(e) => {
                  submit(e.currentTarget.form);
                }}
                className="rounded-sm pr-5 pl-3 pb-3 pt-3 bg-white border-none shadow-lg lg:w-1/3 dark:bg-darkblue dark:text-white"
                value={typeof filter === "string" ? filter : ""}
              >
                <option hidden value="">
                  Filter by region
                </option>
                <option value="Africa">Africa</option>
                <option value="Americas">Americas</option>
                <option value="Asia">Asia</option>
                <option value="Europe">Europe</option>
                <option value="Oceania">Oceania</option>
              </select>
            </Form>
          </div>
        </div>
        <div className="grid grid-cols-1 w-[80%] m-auto items-center mt-4 lg:grid-cols-4 lg:gap-4">
          <Suspense
            fallback={Array(8)
              .fill("")
              .map((index) => {
                return <SkeletonCard key={index} />;
              })}
          >
            <Await
              resolve={data.countries}
              errorElement={<p>There was an error!</p>}
            >
              {(countries) =>
                countries
                  .filter((c) =>
                    c.name.common
                      .toLowerCase()
                      .includes(
                        typeof search === "string" ? search.toLowerCase() : ""
                      )
                  )
                  .map((country) => (
                    <Link
                      prefetch="intent"
                      to={`/country/${country.cca2}`}
                      key={country.cca2}
                    >
                      <CountryCard key={country.cca2} country={country} />
                    </Link>
                  ))
              }
            </Await>
          </Suspense>
        </div>
      </main>
    </div>
  );
}
