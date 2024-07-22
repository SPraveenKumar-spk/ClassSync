import React from 'react';

const AboutPage = () => {
    return (
        <>
        <div className=" w-100 navbar navbar-expand-lg navbar-dark bg-info" style={{ height: "4rem", zIndex: 1030 }}>
        <div className="container d-flex justify-content-start">
          <a className="navbar-brand ms-5 " href='/'>
            <h1 className="fs-1 ms-3 p-2">ClassSync</h1>
          </a>
        </div>
      </div>
        <div className="pt-2 ms-5 about-page">
            <div className="container">
                <h1 className="mt-5 mb-4">About ClassSync</h1>
                <div className="row">
                    <div className="col-md-6">
                        <p>
                            ClassSync is dedicated to revolutionizing classroom management and enhancing educational collaboration. Our platform offers a suite of tools designed to streamline tasks such as project management, assignment distribution, and progress tracking.
                        </p>
                        <p>
                            We believe in bridging the gap between teachers and students through effective communication and teamwork facilitation. With ClassSync, educators can focus more on teaching and less on administrative tasks.
                        </p>
                        <p>
                            Explore our platform and discover how ClassSync can transform your classroom experience. Join us in reshaping the future of education.
                        </p>
                    </div>
                    <div className=" ps-5 col-md-5">
                        <img src="https://envato-shoebox-0.imgix.net/0d2b/04f1-9e00-44f6-be75-0e62764c7bab/WM2A7501.jpg?auto=compress%2Cformat&mark=https%3A%2F%2Felements-assets.envato.com%2Fstatic%2Fwatermark2.png&w=1000&fit=max&markalign=center%2Cmiddle&markalpha=18&s=bb84690b41f639709fd1577e2394983c" alt="ClassSync Image" className="img-fluid rounded shadow-lg" />
                    </div>
                </div>

                <h2 className="mt-5 mb-4">Our Mission and Features</h2>

                <div id="featureCarousel" className="carousel slide" data-bs-ride="carousel">
                    <div className="carousel-inner">
                        <div className="carousel-item active">
                            <div className="row row-cols-1 row-cols-md-4 g-4">
                                <div className="col">
                                    <div className="card h-100">
                                        <div className="card-body">
                                            <h5 className="card-title">Classroom Project Management</h5>
                                            <p className="card-text">Efficiently organize and oversee classroom projects.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="card h-100">
                                        <div className="card-body">
                                            <h5 className="card-title">Collaboration Platform</h5>
                                            <p className="card-text">Foster seamless collaboration among students and teachers.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="card h-100">
                                        <div className="card-body">
                                            <h5 className="card-title">Coordination Between Teachers and Students</h5>
                                            <p className="card-text">Facilitate effective communication and interaction.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="card h-100">
                                        <div className="card-body">
                                            <h5 className="card-title">Assignment Distribution</h5>
                                            <p className="card-text">Easily distribute assignments and tasks to students.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="carousel-item">
                            <div className="row row-cols-1 row-cols-md-4 g-4">
                                <div className="col">
                                    <div className="card h-100">
                                        <div className="card-body">
                                            <h5 className="card-title">Feedback Provision</h5>
                                            <p className="card-text">Provide timely feedback to students on their work.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="card h-100">
                                        <div className="card-body">
                                            <h5 className="card-title">Progress Tracking</h5>
                                            <p className="card-text">Monitor and track student progress over time.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="card h-100">
                                        <div className="card-body">
                                            <h5 className="card-title">Task Management</h5>
                                            <p className="card-text">Manage tasks and assignments effortlessly.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="card h-100">
                                        <div className="card-body">
                                            <h5 className="card-title">Student Teamwork Facilitation</h5>
                                            <p className="card-text">Promote teamwork and collaboration among students.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target="#featureCarousel" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#featureCarousel" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>

                <h2 className="mt-5 mb-4">Contact Us</h2>
                <p>
                    Have questions or feedback? Feel free to reach out to our support team at <a href="mailto:support@classsync.com">support@classsync.com</a>.
                </p>
            </div>
        </div>
        </>
    );
};

export default AboutPage;
