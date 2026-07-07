import React from "react";

export default function Articles() {
  const sideArticles = [
    {
      title: "Exploring the City: Best Urban Destinations for a Weekend Getaway",
      image: "/images/post-2.jpg",
      date: "sep 20, 2024",
      delay: "0s",
    },
    {
      title: "Exploring the City: Best Urban Destinations for a Weekend Getaway",
      image: "/images/post-3.jpg",
      date: "sep 21, 2024",
      delay: "0.25s",
    },
    {
      title: "Exploring the City: Best Urban Destinations for a Weekend Getaway",
      image: "/images/post-4.jpg",
      date: "sep 22, 2024",
      delay: "0.5s",
    },
  ];

  return (
    <div className="latest-article">
      <div className="container">
        <div className="row section-row">
          <div className="col-lg-12">
            {/* Section Title Start */}
            <div className="section-title">
              <h3 className="wow fadeInUp">latest articles</h3>
              <h2 className="text-anime-style-3" data-cursor="-opaque">
                Stay informed and inspired for your next journey
              </h2>
            </div>
            {/* Section Title End */}
          </div>
        </div>

        <div className="row">
          {/* Highlighted Article */}
          <div className="col-lg-6">
            {/* Highlighted Article Post Start */}
            <div className="highlighted-article-post wow fadeInUp">
              {/* Highlighted Article Featured Image Start */}
              <div className="highlighted-article-featured-img">
                <figure>
                  <a href="#" className="image-anime" data-cursor-text="View">
                    <img src="/images/post-1.jpg" alt="Featured Article" />
                  </a>
                </figure>
              </div>
              {/* Highlighted Article Featured Image End */}

              {/* Highlighted Article Body Start */}
              <div className="highlighted-article-body">
                {/* Article Meta Start */}
                <div className="article-meta">
                  <ul>
                    <li>
                      <a href="#">
                        <i className="fa-solid fa-calendar-days"></i> sep 19, 2024
                      </a>
                    </li>
                  </ul>
                </div>
                {/* Article Meta End */}

                {/* Highlighted Article Content Start */}
                <div className="highlighted-article-content">
                  <h3>
                    <a href="#">Road Trip Essentials: What to Pack for a Smooth Journey</a>
                  </h3>
                  <a href="#" className="section-icon-btn">
                    <img src="/images/arrow-white.svg" alt="Arrow" />
                  </a>
                </div>
                {/* Highlighted Article Content End */}
              </div>
              {/* Highlighted Article Body End */}
            </div>
            {/* Highlighted Article Post End */}
          </div>

          {/* Side Articles */}
          <div className="col-lg-6">
            {sideArticles.map((art, idx) => (
              /* Article Post Start */
              <div key={idx} className="article-post wow fadeInUp" data-wow-delay={art.delay}>
                <div className="article-featured-img">
                  <figure>
                    <a href="#" className="image-anime" data-cursor-text="View">
                      <img src={art.image} alt={art.title} />
                    </a>
                  </figure>
                </div>

                <div className="article-post-body">
                  {/* Article Meta Start */}
                  <div className="article-meta">
                    <ul>
                      <li>
                        <a href="#">
                          <i className="fa-solid fa-calendar-days"></i> {art.date}
                        </a>
                      </li>
                    </ul>
                  </div>
                  {/* Article Meta End */}

                  <div className="article-post-content">
                    <h3>
                      <a href="#">{art.title}</a>
                    </h3>
                    <a href="#" className="read-story-btn">
                      read story
                    </a>
                  </div>
                </div>
              </div>
              /* Article Post End */
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
