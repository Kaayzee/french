import Collapse from "bootstrap/js/dist/collapse";
import { useEffect, useRef } from "react";
import ReactCountryFlag from "react-country-flag";

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
  setPage
}) {

    const navRef = useRef(null);
    const collapseInstance = useRef(null);

    useEffect(() => {
    const el = document.getElementById("navbarContent");

    if (el) {
        collapseInstance.current = new Collapse(el, {
        toggle: false
        });
    }
    }, []);

    useEffect(() => {
    const handleClickOutside = (e) => {
        const nav = navRef.current;

        if (!nav) return;

        const isOpen =
        document
            .getElementById("navbarContent")
            ?.classList.contains("show");

        if (isOpen && !nav.contains(e.target)) {
        collapseInstance.current?.hide(); // 🔥 proper Bootstrap API
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
            className="navbar navbar-expand-lg navbar-light bg-light"
        >

        <div className="container-fluid px-2">

        {/* TOGGLER */}
        <button
        className="navbar-toggler ms-auto"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarContent"
        >
        <span className="navbar-toggler-icon"></span>
        </button>

        {/* COLLAPSIBLE */}
        <div   
            ref={navRef}
            className="collapse navbar-collapse justify-content-center" 
            id="navbarContent">

            {/* LEFT SIDE */}
            <ul className="navbar-nav d-flex flex-row align-items-center gap-2">

            {/* BOOK */}
            <li className="nav-item dropdown me-2">
                <button
                className="btn btn-outline-primary dropdown-toggle"
                data-bs-toggle="dropdown"
                >
                {selectedBook}
                </button>

                <ul className="dropdown-menu position-absolute">
                {Object.keys(books).map(book => (
                    <li key={book}>
                    <button
                        className="dropdown-item"
                        onClick={() => setSelectedBook(book)}
                    >
                        {book}
                    </button>
                    </li>
                ))}
                </ul>
            </li>

            {/* CHAPTER */}
            <li className="nav-item dropdown position-relative">
                <button
                className="btn btn-outline-secondary dropdown-toggle"
                data-bs-toggle="dropdown"
                >
                {selectedChapter || "Chapter"}
                </button>

                <ul className="dropdown-menu position-absolute">
                {Object.keys(bookData).map(ch => (
                    <li key={ch}>
                    <button
                        className="dropdown-item"
                        onClick={() => setSelectedChapter(ch)}
                    >
                        {ch}
                    </button>
                    </li>
                ))}
                </ul>
            </li>
            {/* LANGUAGE */}
            <li className="nav-item dropdown position-relative ">
                <button
                className="btn btn-outline-dark "
                onClick={() =>
                    setDirection(prev => (prev === "fr-en" ? "en-fr" : "fr-en"))
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

            {/* RIGHT SIDE */}
            <div className="d-flex gap-2 me-2">
            <button
                className={`btn btn-sm ${
                page === "game" ? "btn-primary" : "btn-outline-primary"
                }`}
                onClick={() => setPage("game")}
            >
                Game
            </button>

            <button
                className={`btn btn-sm ${
                page === "score" ? "btn-secondary" : "btn-outline-secondary"
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