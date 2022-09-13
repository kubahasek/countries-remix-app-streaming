import type { Transition } from "@remix-run/react/dist/transition";
import React from "react";
import type { MouseEventHandler } from "react";
import { BarLoader } from "react-spinners";
import { Theme } from "utils/theme-provider";
import { useSpinDelay } from "spin-delay";

const Navbar = ({
  toggleTheme,
  theme,
  state,
}: {
  toggleTheme: MouseEventHandler;
  theme: Theme | null;
  state: Transition;
}) => {
  const showLoading = useSpinDelay(state.state === "loading", {
    delay: 200,
    minDuration: 300,
  });
  return (
    <header>
      <nav className="flex shadow-lg p-7 justify-between">
        <div>
          <h1 className="text-1xl font-bold text-darktext dark:text-white">
            Where in the world?
          </h1>
        </div>
        <div>
          {showLoading && (
            <BarLoader color={theme === "dark" ? "#808080" : "#808080"} />
          )}
        </div>
        <div>
          {theme === Theme.DARK ? (
            <i className="fa-solid fa-moon text-darktext dark:text-white"></i>
          ) : (
            <i className="fa-solid fa-sun text-darktext dark:text-white"></i>
          )}
          <button className="ml-2" onClick={toggleTheme}>
            <h3 className="text-darktext dark:text-white">Dark mode</h3>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
