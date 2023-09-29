import "../components/Header.css";
import Proptypes from "prop-types";
import { Link } from "react-router-dom";

export const Header = ({ title }) => {
  return (
    <Link to="/">
      <h1 className="title">{title}</h1>
    </Link>
  );
};

Header.propTypes = {
  title: Proptypes.string.isRequired,
};
