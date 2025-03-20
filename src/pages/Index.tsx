
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AnimatedButton from '@/components/ui/AnimatedButton';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Dumbbell, Calendar, Award, Users, Coffee, MapPin } from 'lucide-react';

const Index = () => {
  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      elements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight - 100;
        
        if (isVisible) {
          element.classList.add('animate-slide-up', 'opacity-100');
          element.classList.remove('opacity-0', 'translate-y-12');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    setTimeout(handleScroll, 100); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const services = [
    {
      icon: <Dumbbell size={28} />,
      title: "Premium Fitness Center",
      description: "State-of-the-art equipment and personalized training programs designed for every fitness level."
    },
    {
      icon: <Calendar size={28} />,
      title: "Exclusive Events",
      description: "Access to members-only events, networking opportunities, and special occasions."
    },
    {
      icon: <Coffee size={28} />,
      title: "Gourmet Lounge",
      description: "Relax in our luxury lounge with premium beverages and healthy, chef-prepared meals."
    },
    {
      icon: <Award size={28} />,
      title: "Wellness Programs",
      description: "Comprehensive wellness services including spa treatments, yoga classes, and meditation."
    },
    {
      icon: <Users size={28} />,
      title: "Social Clubs",
      description: "Join like-minded individuals in specialty interest groups and community activities."
    },
    {
      icon: <MapPin size={28} />,
      title: "Global Access",
      description: "Membership benefits at partner clubs around the world when you travel."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Executive Director",
      content: "Joining RAS Club has been transformative for both my professional network and personal wellbeing. The facilities are impeccable and the staff's attention to detail makes every visit special.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80"
    },
    {
      name: "Michael Chen",
      role: "Tech Entrepreneur",
      content: "As someone with a demanding schedule, RAS Club provides the perfect balance of luxury and functionality. The digital integration makes booking services seamless, and the community is exceptional.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80"
    },
    {
      name: "Emily Rodriguez",
      role: "Wellness Coach",
      content: "The attention to holistic wellness at RAS Club sets it apart from any other facility I've experienced. From nutrition to fitness to mental wellbeing, every aspect is thoughtfully integrated.",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="blur-circle w-[500px] h-[500px] -top-64 -left-64 bg-primary/10 animate-spin-slow"></div>
      <div className="blur-circle w-[600px] h-[600px] top-[30%] -right-96 bg-accent/10 animate-spin-slow"></div>
      
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="w-full lg:w-1/2 space-y-8 animate-slide-up">
              <Badge className="px-4 py-1.5 rounded-full bg-primary/10 text-primary border-none mb-6">Premium Leisure Experience</Badge>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Elevate Your <span className="text-primary">Leisure</span> Experience
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl">
                Join RAS Club for an exclusive membership experience with premium amenities, personalized services, and a community of like-minded individuals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/signup">
                  <AnimatedButton variant="primary" size="lg" showArrow>
                    Become a Member
                  </AnimatedButton>
                </Link>
                <Link to="/login">
                  <AnimatedButton variant="outline" size="lg">
                    Member Login
                  </AnimatedButton>
                </Link>
              </div>
              <div className="flex items-center gap-4 pt-6">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                      <img 
                        src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? 'women' : 'men'}/${i + 20}.jpg`} 
                        alt="Member" 
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <span className="font-medium">500+</span> members already joined
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/2 animate-slide-up animation-delay-200">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-2xl transform rotate-3 scale-[0.98] blur-xl animate-pulse"></div>
                <div className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.01] transition-transform duration-500">
                  <img 
                    src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" 
                    alt="RAS Club" 
                    className="w-full h-[500px] object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Services Section */}
      <section id="services" className="py-24 bg-secondary relative">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16 opacity-0 translate-y-12 animate-on-scroll">
            <Badge className="px-4 py-1.5 rounded-full bg-primary/10 text-primary border-none mb-6">Our Services</Badge>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">Exceptional Amenities & Services</h2>
            <p className="text-muted-foreground">
              Experience the finest leisure facilities and personalized services designed to exceed your expectations and enhance your lifestyle.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="bg-white border-none shadow-lg overflow-hidden opacity-0 translate-y-12 animate-on-scroll card-hover">
                <CardContent className="p-8">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                    {service.icon}
                  </div>
                  <h3 className="font-serif text-xl font-semibold mb-3">{service.title}</h3>
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* About Section */}
      <section id="about" className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2 opacity-0 translate-y-12 animate-on-scroll">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-primary/20 rounded-2xl transform -rotate-3 scale-[0.98] blur-xl"></div>
                <div className="grid grid-cols-12 grid-rows-6 gap-4 relative">
                  <div className="col-span-8 row-span-4 rounded-2xl overflow-hidden shadow-xl">
                    <img 
                      src="https://images.unsplash.com/photo-1577720643148-8c49400ee114?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                      alt="RAS Club Lounge" 
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="col-span-4 row-span-3 rounded-2xl overflow-hidden shadow-xl">
                    <img 
                      src="https://images.unsplash.com/photo-1623718649591-311775a30c43?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
                      alt="RAS Club Facility" 
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="col-span-5 row-span-2 rounded-2xl overflow-hidden shadow-xl">
                    <img 
                      src="https://images.unsplash.com/photo-1614267157481-ca2b81ac6fcc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
                      alt="RAS Club Event" 
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="col-span-7 row-span-2 col-start-6 row-start-5 rounded-2xl overflow-hidden shadow-xl">
                    <img 
                      src="https://images.unsplash.com/photo-1574086374535-74c7242c57a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
                      alt="RAS Club Dining" 
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/2 space-y-6 opacity-0 translate-y-12 animate-on-scroll">
              <Badge className="px-4 py-1.5 rounded-full bg-primary/10 text-primary border-none mb-6">About Us</Badge>
              <h2 className="font-serif text-3xl md:text-4xl font-bold">A Legacy of Excellence Since 1995</h2>
              <p className="text-muted-foreground">
                RAS Club was founded with a vision to create an exceptional leisure destination that combines luxury, comfort, and community. For over 25 years, we've been dedicated to providing our members with unparalleled experiences.
              </p>
              <p className="text-muted-foreground">
                Our philosophy is built on three core principles: exceptional service, premium facilities, and fostering meaningful connections among our members. We continuously evolve to meet the changing needs of our community while maintaining our commitment to excellence.
              </p>
              <div className="grid grid-cols-2 gap-6 py-6">
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-primary">25+</div>
                  <div className="text-sm text-muted-foreground">Years of Excellence</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-primary">5000+</div>
                  <div className="text-sm text-muted-foreground">Happy Members</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-primary">200+</div>
                  <div className="text-sm text-muted-foreground">Weekly Events</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-primary">15+</div>
                  <div className="text-sm text-muted-foreground">Global Locations</div>
                </div>
              </div>
              <div className="pt-4">
                <AnimatedButton size="lg" showArrow>
                  Our Story
                </AnimatedButton>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-secondary relative">
        <div className="blur-circle w-[500px] h-[500px] bottom-0 right-0 bg-primary/5 animate-spin-slow"></div>
        
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16 opacity-0 translate-y-12 animate-on-scroll">
            <Badge className="px-4 py-1.5 rounded-full bg-primary/10 text-primary border-none mb-6">Testimonials</Badge>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">What Our Members Say</h2>
            <p className="text-muted-foreground">
              Discover why our members love RAS Club and how our premium facilities and services have enhanced their lifestyle.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white border-none shadow-lg overflow-hidden opacity-0 translate-y-12 animate-on-scroll card-hover">
                <CardContent className="p-8">
                  <div className="mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className="text-yellow-400 inline-block">★</span>
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 italic">"{testimonial.content}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name} 
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div>
                      <div className="font-medium">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section id="cta" className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto relative glass-panel p-10 md:p-16 opacity-0 translate-y-12 animate-on-scroll">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl -z-10"></div>
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
              <div className="md:w-2/3 space-y-6">
                <h2 className="font-serif text-3xl md:text-4xl font-bold">Ready to Experience the RAS Difference?</h2>
                <p className="text-muted-foreground">
                  Join our exclusive community today and discover a new standard of leisure and lifestyle. Limited memberships available.
                </p>
              </div>
              <div className="md:w-1/3 flex flex-col gap-4">
                <Link to="/signup" className="w-full">
                  <AnimatedButton variant="primary" className="w-full" size="lg" showArrow>
                    Join Now
                  </AnimatedButton>
                </Link>
                <Link to="/login" className="w-full">
                  <AnimatedButton variant="outline" className="w-full" size="lg">
                    Member Login
                  </AnimatedButton>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section id="contact" className="py-24 bg-secondary relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-16">
            <div className="w-full lg:w-1/2 space-y-6 opacity-0 translate-y-12 animate-on-scroll">
              <Badge className="px-4 py-1.5 rounded-full bg-primary/10 text-primary border-none mb-6">Contact Us</Badge>
              <h2 className="font-serif text-3xl md:text-4xl font-bold">Get in Touch</h2>
              <p className="text-muted-foreground">
                Have questions about membership or our facilities? Our team is here to help. Reach out to us using the contact information below or visit us at any of our locations.
              </p>
              
              <div className="space-y-6 pt-4">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Main Location</h4>
                    <p className="text-muted-foreground">
                      123 Leisure Avenue, Central District, City, Country 12345
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Phone</h4>
                    <p className="text-muted-foreground">
                      +1 (555) 123-4567
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Email</h4>
                    <p className="text-muted-foreground">
                      info@rasclub.com
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="pt-8">
                <h4 className="font-medium mb-4">Business Hours</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monday - Friday</span>
                    <span>6:00 AM - 11:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Saturday</span>
                    <span>7:00 AM - 10:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sunday</span>
                    <span>8:00 AM - 9:00 PM</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="w-full lg:w-1/2 opacity-0 translate-y-12 animate-on-scroll">
              <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-10">
                <h3 className="font-serif text-2xl font-semibold mb-6">Send us a Message</h3>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-control">
                      <label htmlFor="name" className="form-label">Full Name</label>
                      <input id="name" type="text" className="form-input" placeholder="John Doe" />
                    </div>
                    <div className="form-control">
                      <label htmlFor="email" className="form-label">Email Address</label>
                      <input id="email" type="email" className="form-input" placeholder="john@example.com" />
                    </div>
                  </div>
                  
                  <div className="form-control">
                    <label htmlFor="subject" className="form-label">Subject</label>
                    <input id="subject" type="text" className="form-input" placeholder="Membership Inquiry" />
                  </div>
                  
                  <div className="form-control">
                    <label htmlFor="message" className="form-label">Message</label>
                    <textarea 
                      id="message" 
                      className="min-h-32 px-4 py-3 rounded-xl bg-white border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 w-full" 
                      placeholder="Your message here..."
                    ></textarea>
                  </div>
                  
                  <AnimatedButton variant="primary" size="lg" className="w-full" showArrow type="submit">
                    Send Message
                  </AnimatedButton>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
