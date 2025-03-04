import Header from "../Components/Header";
import Breadcrumbs from "../Components/Breadcrumbs";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Footer from "../Components/Footer";

const testimonials = [
  {
    name: "Sarah Johnson",
    feedback:
      "ClassSync has made classroom management so seamless! I can easily distribute assignments and track student progress.",
    image: "https://randomuser.me/api/portraits/women/50.jpg",
  },
  {
    name: "James Anderson",
    feedback:
      "The collaboration tools are fantastic! My students engage more and work better as a team.",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
  },
  {
    name: "Emily Davis",
    feedback:
      "This platform has saved me hours of administrative work. I can focus more on teaching now!",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Michael Brown",
    feedback:
      "ClassSync’s project management features are top-notch. Organizing and tracking projects has never been easier!",
    image: "https://randomuser.me/api/portraits/men/46.jpg",
  },
  {
    name: "Jessica Lee",
    feedback:
      "The user-friendly interface makes it simple for both students and teachers to use.",
    image: "https://randomuser.me/api/portraits/women/52.jpg",
  },
  {
    name: "David Wilson",
    feedback:
      "The best educational tool I’ve used. Communication and teamwork have improved tremendously!",
    image: "https://randomuser.me/api/portraits/men/47.jpg",
  },
];

const AboutPage = () => {
  return (
    <>
      <Header />
      <section className="bg-gray-50 py-10 ">
        <div className="md:ms-10 mx-auto px-6 pt-12">
          <Breadcrumbs />
        </div>
        <div className="container mx-auto px-6 ">
          <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">
            About Us
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-center">
            <div>
              <p className="text-gray-700 mb-4">
                ClassSync revolutionizes classroom management and enhances
                educational collaboration. Our platform streamlines project
                management, assignment distribution, and progress tracking.
              </p>
              <p className="text-gray-700 mb-4">
                We bridge the gap between teachers and students through
                effective communication and teamwork facilitation, allowing
                educators to focus more on teaching and less on administrative
                tasks.
              </p>
              <p className="text-gray-700">
                Discover how ClassSync can transform your classroom experience
                and join us in reshaping the future of education.
              </p>
            </div>
            <div className="flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=800&q=60"
                alt="Classroom Collaboration"
                className="w-full max-w-md rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
        <div className="container mx-auto px-6 pt-10">
          <h2 className="text-3xl font-bold text-gray-800 text-center">
            What Our Users Say
          </h2>

          <div className="mt-8">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 3000 }}
              spaceBetween={20}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="px-4"
            >
              {testimonials.map((testimonial, index) => (
                <SwiperSlide key={index} className="p-4">
                  <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-20 h-20 mx-auto rounded-full mb-4"
                    />
                    <h3 className="text-lg font-semibold text-gray-800">
                      {testimonial.name}
                    </h3>
                    <p className="text-gray-600 mt-2">{testimonial.feedback}</p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>
      <section>
        <Footer />
      </section>
    </>
  );
};

export default AboutPage;
