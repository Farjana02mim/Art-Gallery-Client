import React from 'react'
import { Autoplay, EffectCoverflow, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/pagination'
import ReviewCard from './ReviewCard'

const Reviews = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="my-7 text-center">
        <h3 className="text-3xl font-bold">Reviews</h3>
        <p className="text-gray-500 mt-4">No reviews yet. Be the first to leave one!</p>
      </div>
    )
  }

  return (
    <div className="my-7">
      <div className="text-center mb-12">
        <h3 className="text-3xl font-bold">Reviews</h3>
        <p className="p-6 md:p-12 text-gray-600">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ex eveniet natus aut omnis distinctio
          quisquam deleniti commodi, sunt aperiam reprehenderit. Saepe assumenda harum ipsum obcaecati
          eveniet eaque illo veritatis voluptate?
        </p>
      </div>

      <Swiper
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={window.innerWidth < 768 ? 1 : 3} // responsive
        coverflowEffect={{
          rotate: 30,
          stretch: 50,
          depth: 200,
          modifier: 1,
          scale: 0.75,
          slideShadows: true,
        }}
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        modules={[EffectCoverflow, Pagination, Autoplay]}
        className="mySwiper"
      >
        {reviews.map((review) => (
          <SwiperSlide key={review._id}>
            <ReviewCard review={review} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default Reviews