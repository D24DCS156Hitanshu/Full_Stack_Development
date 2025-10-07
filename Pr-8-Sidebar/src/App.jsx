import React, { useState } from 'react';
import './App.css';

const sections = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'contact', label: 'Contact Us' },
];

const sectionContent = {
  home: (
    <>
      <h1>Home</h1>
      <p>Welcome to our one-page website with a sidebar navigation. Use the links to jump to different sections.</p>
    </>
  ),
  about: (
    <>
      <h1>About</h1>
      <p>We are a team of passionate developers creating simple and effective web solutions. Our goal is to deliver high-quality products that meet your needs.</p>
    </>
  ),
  services: (
    <>
      <h1>Services</h1>
      <ul>
        <li>Web Design & Development</li>
        <li>UI/UX Consulting</li>
        <li>SEO Optimization</li>
        <li>Technical Support</li>
      </ul>
    </>
  ),
  contact: (
    <>
      <h1>Contact Us</h1>
      <p>Have questions or want to work with us? Reach out via email at <a href="mailto:info@example.com">info@example.com</a> or fill out our contact form.</p>
    </>
  ),
};

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNavClick = (id) => {
    setSidebarOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="app-root">


      <button
        onClick={() => setSidebarOpen(true)}
        className={`sidebar-toggle-btn${sidebarOpen ? ' hide' : ''}`}
        aria-label="Open sidebar"
      >
        ☰
      </button>


      <div className={`sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">Sidebar</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="sidebar-close-btn"
            aria-label="Close sidebar"
          >
            ×
          </button>
        </div>
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick(section.id);
            }}
            className="sidebar-link"
          >
            {section.label}
          </a>
        ))}
      </div>


      <div className="main-content">
        {sections.map((section) => (
          <section
            id={section.id}
            key={section.id}
            className="section"
          >
            {sectionContent[section.id]}
          </section>
        ))}
      </div>
    </div>
  );
}

export default App;
