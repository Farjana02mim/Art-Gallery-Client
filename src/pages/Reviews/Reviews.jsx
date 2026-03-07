import React, { use } from 'react'
import { Autoplay, EffectCoverflow, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import ReviewCard from './ReviewCard';

const Reviews = ({reviewsPromise}) => {

    const reviews = use(reviewsPromise);
    console.log(reviews);

  return (
     <div className='my-7'>
      <div>
        <h3 className="text-3xl text-center text-bold">Reviews</h3>
        <p className='p-12 text-center'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ex eveniet natus aut omnis distinctio quisquam deleniti commodi, sunt aperiam reprehenderit. Saepe assumenda harum ipsum obcaecati eveniet eaque illo veritatis voluptate?</p>
      </div>
       <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={3}
        coverflowEffect={{
          rotate: 30,
          stretch: '50%',
          depth: 200,
          modifier: 1,
          scale: 0.75,
          slideShadows: true,
        }}
        loop={true} 
         autoplay={{
          delay: 2000,
          disableOnInteraction: false,
        }}
        pagination={true}
        modules={[EffectCoverflow, Pagination, Autoplay]}
        className="mySwiper"
      >
        {
          reviews.map(review => <SwiperSlide key={review.id}>
          <ReviewCard review={review}></ReviewCard>
        </SwiperSlide>)
        }
      </Swiper>
     </div>
  )
}

export default Reviews
