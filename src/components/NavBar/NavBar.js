import React, { useState } from "react";

const NavBar = ({ li, onItemClick }) => {
  const [window, setWindow] = useState(false);

  const openClose = () => {
    setWindow(!window);
  };

  return (
    <nav className="navbar-menu" style={{ width: window ? 250 : 60 }}>
      <div className="burger" onClick={openClose}>
        <img src="img/menu.svg" alt="burger" />
      </div>
      <ul className="navbar__list">
        {li.map((item, i) => (
          <div className="navbar__li-box" key={i}>
            <img
              src={item[1]}
              alt={item[1]}
              style={{ paddingLeft: window ? 17 : 27 }}
            />
            <li
              className="navbar__li"
              style={{
                display: window ? "inline-block" : "none", // Only display when window is open
                verticalAlign: "middle"
              }}
              onClick={() => onItemClick(item[0])} // Passes the page name to the parent component
            >
              {item[0]}
            </li>
          </div>
        ))}
      </ul>
    </nav>
  );
};

export default NavBar;
