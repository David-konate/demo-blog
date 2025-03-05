import React from "react";
import { Link, navigate } from "gatsby";
import "../../styles/layout-admin.css";
import useAuth from "../../services/authService";

const SideBar = () => {
  const { logout } = useAuth();
  return (
    <aside className="sidebar">
      <nav className="menu">
        <p className="menu-label">Général</p>
        <ul className="menu-list">
          <li>
            <Link to="/">Site</Link>
          </li>
          <li>
            <Link to="/app/admin">Dashboard</Link>
          </li>
          <li>
            <Link to="/app/profile">Profil</Link>
          </li>
        </ul>

        <p className="menu-label">Administration</p>
        <ul className="menu-list">
          <li>
            <Link to="/app/allArticles">Articles</Link>
          </li>
          <li>
            <Link to="/app/categories">Categories</Link>
          </li>
          <li>
            <Link to="/app/allEvents">Utilsateurs</Link>
          </li>
          <li>
            <Link to="/app/messages">Messages</Link>
          </li>
        </ul>

        <p className="menu-label">Création</p>
        <ul className="menu-list">
          <li>
            <Link to="/app/blog-post-create">Créer un Article</Link>
          </li>
          <li>
            <Link to="/app/categories">Créer un Catégorie</Link>
          </li>
          <li>
            <Link to="/app/categories">Ecrire un Message</Link>
          </li>
          <li>
            <Link to="/app/blog-post-create">Créer un Article</Link>
          </li>
          <li>
            <Link to="/app/categories">Créer un Catégorie</Link>
          </li>
        </ul>

        <p className="menu-label">Action</p>
        <ul className="menu-list">
          <li>
            <Link to="/app/admin/params">Paramètres</Link>
          </li>
          <li>
            <Link
              to="/"
              onClick={(event) => {
                event.preventDefault();
                logout(() => logout());
              }}
            >
              Déconnexion
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default SideBar;
