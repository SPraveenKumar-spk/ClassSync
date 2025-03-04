import Footer from "./Components/Footer";
import Header from "./Components/Header";
import Image from "./assets/HomeImage.jpg";
import { NavLink } from "react-router-dom";
import {
  FaChevronDown,
  FaChevronUp,
  FaTasks,
  FaUsers,
  FaFileAlt,
  FaChartBar,
  FaChalkboardTeacher,
  FaCheckCircle,
} from "react-icons/fa";
import { HiArrowNarrowRight } from "react-icons/hi";
import { useState } from "react";

function Home() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const features = [
    {
      icon: <FaTasks className="text-blue-500 text-5xl" />,
      title: "Task Management",
      description:
        "Assign, organize, and track classroom projects effortlessly.",
    },
    {
      icon: <FaUsers className="text-green-500 text-5xl" />,
      title: "Seamless Collaboration",
      description: "Students and teachers can work together in real time.",
    },
    {
      icon: <FaFileAlt className="text-purple-500 text-5xl" />,
      title: "Document Sharing",
      description: "Easily upload, share, and collaborate on files.",
    },
    {
      icon: <FaChartBar className="text-red-500 text-5xl" />,
      title: "Progress Tracking",
      description: "Monitor student progress and provide feedback effectively.",
    },
  ];

  const steps = [
    {
      icon: <FaChalkboardTeacher className="text-blue-500 text-5xl" />,
      title: "Teachers Create Projects",
      description:
        "Teachers set up projects, assign tasks, and provide resources.",
    },
    {
      icon: <FaUsers className="text-green-500 text-5xl" />,
      title: "Students Join & Collaborate",
      description:
        "Students join projects, communicate, and work together in real-time.",
    },
    {
      icon: <FaTasks className="text-purple-500 text-5xl" />,
      title: "Manage Tasks & Share Files",
      description:
        "Students can submit work, share files, and organize tasks efficiently.",
    },
    {
      icon: <FaCheckCircle className="text-red-500 text-5xl" />,
      title: "Track Progress & Submit Work",
      description:
        "Teachers monitor progress, provide feedback, and finalize submissions.",
    },
  ];

  const faqs = [
    {
      question: "Is ClassSync free for teachers?",
      answer:
        "Yes! ClassSync offers a free plan with essential features for teachers to manage classroom projects effectively.",
    },
    {
      question: "Can students collaborate on multiple projects?",
      answer:
        "Absolutely! Students can be part of multiple projects, collaborate with peers, and track progress in real time.",
    },
    {
      question: "Does ClassSync support file sharing?",
      answer:
        "Yes, students and teachers can upload and share documents within their projects for seamless collaboration.",
    },
    {
      question: "Is there a premium version with more features?",
      answer:
        "Yes, ClassSync offers a premium plan with advanced features like analytics, unlimited storage, and priority support.",
    },
  ];
  return (
    <>
      <section>
        <div>
          <Header />
        </div>
      </section>
      <section>
        <div className="absolute top-[13%] md:top-[30%] left-5 md:left-10 md:w-[40%] w-[45%] ">
          <h2 className="text-base md:text-3xl text-slate-700 text-center leading-relaxed font-semibold">
            <span className="block md:hidden">
              Empower & Collaborate with ClassSync!
            </span>
            <span className="hidden md:block">
              ~ Empowering Classrooms, Enhancing Collaboration — Streamline
              Projects with ClassSync! ~
            </span>
          </h2>
          <div className="text-center pt-5 md:pt-10">
            <NavLink to="/login">
              <button className="text-xl md:text-2xl py-1 px-2 md:py-3 md:px-4 bg-blue-500 hover:bg-blue-700 text-white rounded-lg cursor-pointer">
                Explore Now
              </button>
            </NavLink>
          </div>
        </div>
        <div className="pt-20">
          <img
            src={Image}
            className="object-contain md:object-cover w-full h-full  md:w-screen md:h-[625px]"
          />
        </div>
      </section>
      <section className="max-w-6xl mx-auto pt-5 md:py-12 px-6">
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-6">
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center p-6 border rounded-lg shadow-md"
            >
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-700">
                {feature.title}
              </h3>
              <p className="text-gray-600 mt-2">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="max-w-5xl mx-auto py-12 px-6">
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-10">
          How It Works
        </h2>
        <div className="hidden md:flex items-center justify-between space-x-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative flex flex-col items-center text-center"
            >
              <div className="p-6 bg-white border rounded-full shadow-lg">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mt-4">
                {step.title}
              </h3>
              <p className="text-gray-600 mt-2 w-64">{step.description}</p>

              {index !== steps.length - 1 && (
                <div className="absolute top-1/4 right-[-40px] transform -translate-y-1/2 text-gray-400 text-3xl">
                  <HiArrowNarrowRight />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="md:hidden flex flex-col items-center space-y-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="p-6 bg-white border rounded-full shadow-lg">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mt-4">
                {step.title}
              </h3>
              <p className="text-gray-600 mt-2 w-64">{step.description}</p>

              {index !== steps.length - 1 && (
                <div className="text-gray-400 text-3xl mt-4">
                  <HiArrowNarrowRight className="rotate-90" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
      <section className="max-w-4xl mx-auto my-10 px-6">
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-300 rounded-lg p-4 cursor-pointer transition-all"
              onClick={() => toggleFAQ(index)}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-700">
                  {faq.question}
                </h3>
                {openIndex === index ? (
                  <FaChevronUp className="text-blue-500" />
                ) : (
                  <FaChevronDown className="text-blue-500" />
                )}
              </div>
              {openIndex === index && (
                <p className="mt-3 text-gray-600">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </section>
      <section>
        <Footer />
      </section>
    </>
  );
}

export default Home;
