import React from "react";

import type { Country } from "../routes/country/$id";

type Props = {
  country: Country;
};

const ConutryCard = ({ country }: Props) => {
  return (
    <div className="flex flex-col rounded-md shadow-lg mb-4 text-darktext dark:text-white dark:bg-darkblue">
      <div className="w-full">
        <img
          src={country.flags.svg}
          alt=""
          className="rounded-t-md h-[200px] w-full object-cover"
        />
      </div>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-3">{country.name.common}</h1>
        <p className="font-bold">
          Population:{" "}
          <span className="font-normal">
            {country.population.toLocaleString("en-us")}
          </span>
        </p>
        <p className="font-bold">
          Capital: <span className="font-normal">{country.capital}</span>
        </p>
        <p className="font-bold">
          Region: <span className="font-normal">{country.region}</span>
        </p>
      </div>
    </div>
  );
};

export default ConutryCard;
