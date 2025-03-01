import React from "react";
import { Link } from "gatsby";
import "../../styles/sidebar.css";
import useAuth from "../../services/authService";

const SideBar = () => {
  const { isLoggedIn, logout } = useAuth();
  return (
    <div className="sidebar-container">
      {isLoggedIn() ? (
        <aside className="sidebar-menu">
          <p className="menu-label">General</p>
          <ul className="menu-list">
            <li>
              <Link to="/" className="menu-link">
                Site
              </Link>
            </li>
            <li>
              <Link to="/app/admin" className="menu-link">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/app/profile" className="menu-link">
                Profile
              </Link>
            </li>
          </ul>
          <p className="menu-label">Administration</p>
          <ul className="menu-list">
            <li>
              <Link to="/app/all-users" className="menu-link">
                Utilisateurs
              </Link>
            </li>
            <li>
              <Link to="/app/blog-list" className="menu-link">
                Articles
              </Link>
            </li>
            <li>
              <Link to="/app/all-messages" className="menu-link">
                Messages Utilisateurs
              </Link>
            </li>
          </ul>
          <p className="menu-label">Création</p>
          <ul className="menu-list">
            <li>
              <Link to="/app/blog-post-create" className="menu-link">
                Formulaire Articles
              </Link>
            </li>
            <li>
              <Link to="/app/categories" className="menu-link">
                Formulaire Categories
              </Link>
            </li>
            <li>
              <Link to="/app/user-create" className="menu-link">
                Formulaire Utilisateurs
              </Link>
            </li>
          </ul>
          <p className="menu-label">Action</p>
          <ul className="menu-list">
            <li>
              <Link
                to="/"
                className="menu-link logout"
                onClick={() => {
                  logout();
                }}
              >
                Déconnexion
              </Link>
            </li>
          </ul>
        </aside>
      ) : null}
    </div>
  );
};

export default SideBar;
