import Link from "next/link";

export default function LuxuryCollection() {
  const collections = [
    {
      title: "sport car",
      image: "/images/luxury-collection-img-1.jpg",
      delay: "0s",
    },
    {
      title: "convertible car",
      image: "/images/luxury-collection-img-2.jpg",
      delay: "0.25s",
    },
    {
      title: "sedan car",
      image: "/images/luxury-collection-img-3.jpg",
      delay: "0.5s",
    },
    {
      title: "luxury car",
      image: "/images/luxury-collection-img-4.jpg",
      delay: "0.75s",
    },
  ];

  return (
    <div className="luxury-collection">
      <div className="container-fluid">
        <div className="row no-gutters">
          <div className="col-lg-12">
            <div className="luxury-collection-box">
              {collections.map((item, idx) => {
                const categoryType = item.title.split(" ")[0];
                return (
                  /* Luxury Collection Item Start */
                  <div
                    key={idx}
                    className="luxury-collection-item wow fadeInUp"
                    data-wow-delay={item.delay}
                  >
                    {/* Luxury Collection Image Start */}
                    <div className="luxury-collection-image" data-cursor-text="View">
                      <Link href={`/cars?type=${categoryType}`}>
                        <figure className="image-anime">
                          <img src={item.image} alt={item.title} />
                        </figure>
                      </Link>
                    </div>
                    {/* Luxury Collection Image End */}

                    {/* Luxury Collection Title Start */}
                    <div className="luxury-collection-title">
                      <h2>{item.title}</h2>
                    </div>
                    {/* Luxury Collection Title End */}

                    {/* Luxury Collection Btn Start */}
                    <div className="luxury-collection-btn">
                      <Link href={`/cars?type=${categoryType}`} className="section-icon-btn">
                        <img src="/images/arrow-white.svg" alt="Arrow" />
                      </Link>
                    </div>
                    {/* Luxury Collection Btn End */}
                  </div>
                  /* Luxury Collection Item End */
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
