import React from 'react'

const Header = () => {
  return (
    <header>
        <div className="logo"><h3>Walkie-Typie</h3></div>
        <nav>
            <ul>
                <li className="Home">
                    <a href="/">
                        Home
                    </a>
                </li>
            </ul>
        </nav>
    </header>
  )
}

export default Header