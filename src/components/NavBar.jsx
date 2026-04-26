import Collapse from "bootstrap/js/dist/collapse";
import { useEffect, useRef } from "react";
import ReactCountryFlag from "react-country-flag";

import "../styles/NavBar.css";

export default function NavBar({
    books,
    selectedBook,
    setSelectedBook,
    bookData,
    selectedChapter,
    setSelectedChapter,
    direction,
    setDirection,
    page,
    setPage,
}) {
    const navRef = useRef(null);
    const collapseInstance = useRef(null);

    useEffect(() => {
        const el = document.getElementById("navbarContent");

        if (el) {
            collapseInstance.current = new Collapse(el, {
                toggle: false,
            });
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            const nav = navRef.current;

            if (!nav) return;

            const isOpen = document
                .getElementById("navbarContent")
                ?.classList.contains("show");

            if (isOpen && !nav.contains(e.target)) {
                collapseInstance.current?.hide();
            }
        };

        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    return (
        <nav
            ref={navRef}
            className="navbar navbar-expand-lg navbar-light bg-light vocabulary-navbar"
        >
            <div className="container-fluid px-2 vocabulary-navbar__inner">
                <button
                    className="navbar-toggler ms-auto"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarContent"
                    aria-controls="navbarContent"
                    aria-expanded="false"
                    aria-label="Toggle vocabulary navigation"
                >
                    <span className="navbar-toggler-icon" />
                </button>

                <div
                    className="collapse navbar-collapse justify-content-center vocabulary-navbar__content"
                    id="navbarContent"
                >
                    <ul className="navbar-nav vocabulary-navbar__controls">
                        <li className="nav-item dropdown">
                            <button
                                type="button"
                                className="btn btn-outline-primary dropdown-toggle"
                                data-bs-toggle="dropdown"
                            >
                                {selectedBook}
                            </button>

                            <ul className="dropdown-menu vocabulary-navbar__dropdown-menu">
                                {Object.keys(books).map((book) => (
                                    <li key={book}>
                                        <button
                                            type="button"
                                            className="dropdown-item"
                                            onClick={() => setSelectedBook(book)}
                                        >
                                            {book}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </li>

                        <li className="nav-item dropdown">
                            <button
                                type="button"
                                className="btn btn-outline-secondary dropdown-toggle"
                                data-bs-toggle="dropdown"
                            >
                                {selectedChapter || "Chapter"}
                            </button>

                            <ul className="dropdown-menu vocabulary-navbar__dropdown-menu">
                                {Object.keys(bookData).map((chapter) => (
                                    <li key={chapter}>
                                        <button
                                            type="button"
                                            className="dropdown-item"
                                            onClick={() => setSelectedChapter(chapter)}
                                        >
                                            {chapter}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </li>

                        <li className="nav-item">
                            <button
                                type="button"
                                className="btn btn-outline-dark vocabulary-navbar__direction-button"
                                onClick={() =>
                                    setDirection((prev) => (prev === "fr-en" ? "en-fr" : "fr-en"))
                                }
                            >
                                {direction === "fr-en" ? (
                                    <>
                                        <ReactCountryFlag countryCode="FR" svg /> →{" "}
                                        <ReactCountryFlag countryCode="GB" svg />
                                    </>
                                ) : (
                                    <>
                                        <ReactCountryFlag countryCode="GB" svg /> →{" "}
                                        <ReactCountryFlag countryCode="FR" svg />
                                    </>
                                )}
                            </button>
                        </li>
                    </ul>

                    <div className="vocabulary-navbar__actions">
                        <button
                            type="button"
                            className={`btn btn-sm ${page === "game" ? "btn-primary" : "btn-outline-primary"
                                }`}
                            onClick={() => setPage("game")}
                        >
                            Game
                        </button>

                        <button
                            type="button"
                            className={`btn btn-sm ${page === "score" ? "btn-secondary" : "btn-outline-secondary"
                                }`}
                            onClick={() => setPage("score")}
                        >
                            Score
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
} 