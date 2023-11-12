import React from "react";

const Header = () => {
  return (
    <header>
      <div className="logo">
        <h1>Walkie-Typie</h1>
      </div>
      <nav>
        <ul>
          <li className="Home">
            <a href="/">Home</a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
