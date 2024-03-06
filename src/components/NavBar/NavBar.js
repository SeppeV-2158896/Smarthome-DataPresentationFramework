//source: https://codesandbox.io/p/sandbox/react-vertical-menu-9sqfk?file=%2Fpublic%2Fimg%2Fmanage%20user.svg%3A2%2C2-5%2C10
import React, { useState } from "react";

const NavBar = ({ li }) => {
  const [window, setWindow] = useState(false);

  let openClose = () => {
    if (window === false) {
      setWindow(true);
    } else {
      setWindow(false);
    }
  };
  return (
    <nav className="navbar-menu" style={{ width: window === false ? 250 : 60 }}>
      <div className="burger" onClick={() => openClose()}>
        <img src="img/menu.svg" alt="burger" />
      </div>
      <ul className="navbar__list">
        {li.map((item, i) => (
          <div className="navbar__li-box" key={i}>
            <img
              src={item[1]}
              alt={item[1]}
              style={{ paddingLeft: window === false ? 27 : 17}}
            />
            <li
              className="navbar__li"
              style={{ display: window === false ? "inline-block" : "none",
              verticalAlign: "middle"
            }}
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
