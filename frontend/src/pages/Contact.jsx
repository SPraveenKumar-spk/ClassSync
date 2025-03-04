import Header from "../Components/Header";
import Breadcrumbs from "../Components/Breadcrumbs";

const Contact = () => {
  return (
    <>
      <Header />
      <section className="bg-gray-50 pt-15">
        <div className=" mx-auto px-6 pt-4">
          <Breadcrumbs />
        </div>
        <div className="container mx-auto px-6 ">
          <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">
            Contact Us
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Get in Touch
              </h2>
              <form>
                <div className="mb-4">
                  <label className="block text-gray-700">Full Name</label>
                  <input
                    type="text"
                    className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700">Email Address</label>
                  <input
                    type="email"
                    className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700">Subject</label>
                  <input
                    type="text"
                    className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                    placeholder="Enter subject"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700">Message</label>
                  <textarea
                    className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                    rows="4"
                    placeholder="Type your message..."
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-300"
                >
                  Send Message
                </button>
              </form>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Contact Information
              </h2>
              <p className="text-gray-600 mb-4">
                Have questions? Reach out to us through any of the methods
                below.
              </p>

              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Email</h3>
                <p className="text-gray-600">
                  <a
                    href="mailto:support@classsync.com"
                    className="text-blue-500"
                  >
                    support@classsync.com
                  </a>
                </p>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Phone</h3>
                <p className="text-gray-600">+1 (234) 567-8901</p>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Address</h3>
                <p className="text-gray-600">
                  123 Education St, Learning City, LC 45678
                </p>
              </div>

              <div className="w-full h-[280px] rounded-lg overflow-hidden shadow-lg">
                <iframe
                  className="w-full h-full "
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d448181.1806404836!2d77.35073696518088!3d12.95384772031785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9f1b1f3%3A0x4fef6c1c04520e!2sBangalore%2C+Karnataka!5e0!3m2!1sen!2sin!4v1708347492830"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
