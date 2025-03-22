import React, { useContext, useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation, Autoplay } from 'swiper/modules';
import { useSpring, animated } from 'react-spring';
import { StoreContext } from '../../Context/StoreContext';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './ExploreMenu.css';

const ExploreMenu = ({ category, setCategory }) => {
  const { menu_list } = useContext(StoreContext);
  const [isInView, setIsInView] = useState(false);
  const swiperRef = useRef(null);
  
  // Handle intersection observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );
    
    const element = document.getElementById('explore-menu');
    if (element) {
      observer.observe(element);
    }
    
    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  // React Spring for animations
  const headerSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(30px)' },
    to: { opacity: isInView ? 1 : 0, transform: isInView ? 'translateY(0px)' : 'translateY(30px)' },
    config: { tension: 280, friction: 60 }
  });

  const textSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(30px)' },
    to: { opacity: isInView ? 1 : 0, transform: isInView ? 'translateY(0px)' : 'translateY(30px)' },
    delay: 200,
    config: { tension: 280, friction: 60 }
  });

  const carouselSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(30px)' },
    to: { opacity: isInView ? 1 : 0, transform: isInView ? 'translateY(0px)' : 'translateY(30px)' },
    delay: 400,
    config: { tension: 280, friction: 60 }
  });

  const dividerSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(30px)' },
    to: { opacity: isInView ? 1 : 0, transform: isInView ? 'translateY(0px)' : 'translateY(30px)' },
    delay: 600,
    config: { tension: 280, friction: 60 }
  });

  return (
    <section className="explore-menu" id="explore-menu">
      <div className="explore-menu-header">
        <animated.h1 style={headerSpring}>Explore our menu</animated.h1>
        <animated.p className="explore-menu-text" style={textSpring}>
          Choose from a diverse menu featuring a delectable array of dishes. Our mission is to satisfy your cravings and elevate your dining experience, one delicious meal at a time.
        </animated.p>
      </div>
      
      <animated.div className="swiper-container" style={carouselSpring}>
        <Swiper
          ref={swiperRef}
          effect={'coverflow'}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={'auto'}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2.5,
            slideShadows: false,
          }}
          pagination={{ clickable: true }}
          navigation={true}
          // autoplay={{
          //   delay: 3000,
          //   disableOnInteraction: false,
          //   pauseOnMouseEnter: true,
          // }}
          loop={true}
          modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
          className="food-categories-swiper"
          onSlideChange={(swiper) => {
            const activeIndex = swiper.realIndex;
            const activeCategory = menu_list[activeIndex]?.menu_name;
            if (activeCategory && category !== activeCategory) {
              setCategory(activeCategory);
            }
          }}
        >
          {menu_list.map((item, index) => {
            const isActive = category === item.menu_name;
            
            return (
              <SwiperSlide key={index} className="food-category-slide">
                <div 
                  onClick={() => {
                    setCategory(prev => prev === item.menu_name ? "All" : item.menu_name);
                    swiperRef.current.swiper.slideTo(index + 1);
                  }}
                  className={`food-category-item ${isActive ? 'active' : ''}`}
                >
                  <div className="menu-image-container">
                    <div className="menu-card-3d">
                      <img src={item.menu_image} alt={item.menu_name} />
                      {isActive && <div className="active-indicator" />}
                    </div>
                  </div>
                  <p>{item.menu_name}</p>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </animated.div>
      
      <animated.hr style={dividerSpring} />
    </section>
  );
};

export default ExploreMenu;