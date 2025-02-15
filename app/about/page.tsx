import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "centimentalcomics: about",
  description: "learn about centimentalcomics and the artist behind the comics",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "centimentalcomics: about",
    description: "learn about centimentalcomics and the artist behind the comics",
    url: "/about",
  },
}

export default function About() {
	return (
		<div className="container">
			<header className="header">
				<h1 className="title"><Link href="/">centimentalcomics</Link></h1>
				<h2>some comics about art and internet</h2>
				<div className="value-props row">
				</div>
			</header>
			<div className="navbar-spacer"></div>
			<nav className="navbar">
				<div className="container">
					<ul className="navbar-list">
						<li className="navbar-item">
							<a className="navbar-link" href="/">home</a>
						</li>
						<li className="navbar-item">
							<a className="navbar-link" href="about">about</a>
						</li>
						{/*<li className="navbar-item">
              <a className="navbar-link" href="#" data-popover="#codeNavPopover">stories</a>
              <div id="codeNavPopover" className="popover">
                <ul className="popover-list">
                  <li className="popover-item">
                    <a className="popover-link">you asked for space</a>
                  </li>
                  <li className="popover-item">
                    <a className="popover-link">love letter to ruby</a>
                  </li>
                </ul>
              </div>
            </li>
            <li className="navbar-item">
              <a className="navbar-link" href="subscribe">more</a>
            </li>*/}
					</ul>
				</div>
			</nav>
			<div className="docs-section">
        <h2><u>about centimentalcomics</u></h2>
        <p>some sentimental some just mental comics about art and internet.</p>
        <p>doing a spring cleaning of the website.</p>
        {/* <p>doing a spring cleaning of the website. i used to organize by these tags but might do away with them. here for now.</p> */}
        {/* <ul className="bullets"> */}
        {/* <li><a href="tags-you-asked-for-space">#youaskedforspace</a></li> */}
        {/* <li><a href="tags-love-letters-to-ruby">#loveletterstoruby</a></li> */}
        {/* <li><a href="tags-lit-dev">#litdev</a></li> */}
        {/* <li><a href="tags-ecq-omics">#ecqomics</a></li> */}
        {/* <li><a href="tags-stories-from-nyc">#storiesfromnyc</a></li> */}
        {/* <li><a href="tags-mixtapes-lovers-or-nothing">#mixtapesloversornothing</a></li> */}
        {/* </ul> */}
        <h2><u>about the artist</u></h2>
        <p>
          i'm ce manalang. i love human and computer language. reading, sometimes writing.
        </p>
        <p>
          if you wish to have a chat with me about these comics and or about not these comics please send me a message at <a href="mailto:cm@centimentalcomics.com">cm@centimentalcomics.com</a>.
        </p>
        <p>
          everything else are here <a href="https://cv.centimentalcomics.com">cv.centimentalcomics.com</a>.
        </p>
        <p>
          thank you 🙂
        </p>
        <Image
				  width={706}
					height={738}
					alt="about"
					src={"/assets/images/about.jpg"}
					style={{ width: '100%', height: 'auto' }}
				/>
      </div>
		</div>
	)
}

