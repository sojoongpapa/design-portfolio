import React, { useState } from 'react';
import { AboutInfo } from '../types/portfolio';
import { Briefcase, Wrench, Code2, Building2 } from 'lucide-react';

interface AboutSectionProps {
  about: AboutInfo;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ about }) => {
  const [imageError, setImageError] = useState(false);

  const startYear = about.experience[about.experience.length - 1]?.year || '2002';
  const endYear = about.experience[0]?.year || '2018';
  const totalProjects = about.experience.reduce((acc, curr) => acc + curr.items.length, 0);

  // Image source is already normalized in usePortfolio
  const imageSrc = about.image?.trim() || '';


  return (
    <section className="about-container animate-fadeIn">
      {/* Profile & Biography Hero Block */}
      <div className="about-hero-block">
        {imageSrc && !imageError && (
          <div className="about-profile-media">
            <img
              src={imageSrc}
              alt="Designer Profile"
              className="about-profile-img"
              onError={() => setImageError(true)}
            />
          </div>
        )}

        <div className="about-hero-text">
          <span className="section-label">Biography</span>
          <h2 className="about-heading">
            디자인과 기술의 경계를 넘어<br className="hide-mobile" />
            새로운 디지털 경험을 만드는 디자이너
            {/* 디지털 환경의 본질을 짚고<br className="hide-mobile" />
            지속 가능한 가치를 만드는 디자이너 */}
          </h2>
          <p className="about-text">{about.intro}</p>
        </div>
      </div>

      {/* Tools & Skills Grid */}
      <div className="about-skills-section">
        {/* Tools */}
        <div className="skills-block">
          <div className="section-subheading">
            <Wrench size={16} className="subheading-icon" />
            <span>Tools & Software</span>
          </div>
          <div className="badges-grid">
            {about.tools.map((tool) => (
              <span key={tool} className="badge-item">
                {tool}
              </span>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="skills-block">
          <div className="section-subheading">
            <Code2 size={16} className="subheading-icon" />
            <span>Design & Dev Skills</span>
          </div>
          <div className="badges-grid">
            {about.skills.map((skill) => (
              <span key={skill} className="badge-item highlight">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Clients */}
      <div className="about-clients-section">
        <div className="section-subheading" style={{ marginBottom: 16 }}>
          <Building2 size={16} className="subheading-icon" />
          <span>Clients & Partnerships ({about.clients.length})</span>
        </div>
        <div className="clients-grid">
          {about.clients.map((client) => (
            <div key={client} className="client-card">
              {client}
            </div>
          ))}
        </div>
      </div>

      {/* Career History & Projects (Center-Spine History Timeline) */}
      <div className="about-timeline-section">
        <div className="timeline-top-header">
          <div className="section-subheading">
            <Briefcase size={16} className="subheading-icon" />
            <span>Career History & Projects</span>
          </div>
          <div className="timeline-header-badges">
            <span className="timeline-range-badge">{startYear} — {endYear}</span>
            <span className="timeline-total-badge">{totalProjects} Projects</span>
          </div>
        </div>

        <div className="history-timeline">
          <div className="timeline-spine-line" />

          {about.experience.map((group, index) => {
            const isLeft = index % 2 === 0;
            return (
              <div
                key={group.year}
                className={`timeline-milestone ${isLeft ? 'milestone-left' : 'milestone-right'}`}
              >
                {/* Center node dot */}
                <div className="timeline-center-node" title={group.year}>
                  <div className="timeline-node-dot" />
                </div>

                {/* Timeline Card */}
                <div className="timeline-card">
                  <div className="timeline-card-header">
                    <div className="timeline-card-year">{group.year}</div>
                    <span className="timeline-card-badge">{group.items.length} works</span>
                  </div>

                  <div className="timeline-card-body">
                    {group.items.map((item, idx) => (
                      <div key={idx} className="timeline-entry">
                        <div className="timeline-entry-header">
                          <span className="timeline-month">{item.month}월</span>
                          <span className="timeline-client">{item.client}</span>
                        </div>
                        <span className="timeline-desc">{item.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
