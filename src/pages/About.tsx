
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Info, Award, Users, Clock, Calendar, Shield, Heart } from 'lucide-react';

const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-primary/10 to-accent/10 py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-fade-in">
                About RAS Club
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-in animation-delay-150">
                A premier leisure destination with a rich history of excellence
              </p>
            </div>
          </div>
          
          {/* Decorative circles */}
          <div className="hidden md:block absolute top-10 right-10 w-64 h-64 rounded-full bg-accent/10 blur-circle animate-spin-slow"></div>
          <div className="hidden md:block absolute bottom-10 left-10 w-48 h-48 rounded-full bg-primary/10 blur-circle animate-spin-slow"></div>
        </section>

        {/* Our Story Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 font-serif">Our Story</h2>
              <p className="text-muted-foreground mb-4">
                Founded in 1985, RAS Club began as a small community center with a vision to create a haven for health, wellness, and recreation in the heart of the city.
              </p>
              <p className="text-muted-foreground mb-4">
                Over the decades, we've grown into a premier leisure destination, continuously evolving to meet the changing needs of our members while maintaining our commitment to excellence and personal service.
              </p>
              <p className="text-muted-foreground mb-4">
                Today, RAS Club stands as a testament to our founding principles: providing exceptional facilities, fostering community connections, and promoting holistic well-being for all our members.
              </p>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2836&auto=format&fit=crop" 
                alt="RAS Club Historical Building" 
                className="rounded-lg shadow-lg w-full h-80 object-cover"
              />
              <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-lg shadow-lg">
                <p className="text-sm font-medium">Established 1985</p>
                <p className="text-xs text-muted-foreground">Serving the community for over 35 years</p>
              </div>
            </div>
          </div>
        </section>

        <Separator className="container mx-auto my-8" />

        {/* Values Section */}
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold text-center mb-12 font-serif">Our Core Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-card rounded-xl p-8 shadow-sm border border-border hover:shadow-md transition-shadow">
              <Award className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Excellence</h3>
              <p className="text-muted-foreground">We strive for excellence in all our services, facilities, and member experiences.</p>
            </div>
            <div className="bg-card rounded-xl p-8 shadow-sm border border-border hover:shadow-md transition-shadow">
              <Users className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Community</h3>
              <p className="text-muted-foreground">We foster meaningful connections among our members, creating a sense of belonging.</p>
            </div>
            <div className="bg-card rounded-xl p-8 shadow-sm border border-border hover:shadow-md transition-shadow">
              <Clock className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Innovation</h3>
              <p className="text-muted-foreground">We continuously evolve, embracing new technologies and approaches to enhance member experiences.</p>
            </div>
            <div className="bg-card rounded-xl p-8 shadow-sm border border-border hover:shadow-md transition-shadow">
              <Calendar className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Consistency</h3>
              <p className="text-muted-foreground">We deliver reliable, high-quality services that our members can count on day after day.</p>
            </div>
            <div className="bg-card rounded-xl p-8 shadow-sm border border-border hover:shadow-md transition-shadow">
              <Shield className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Integrity</h3>
              <p className="text-muted-foreground">We operate with honesty, transparency, and ethical standards in all our practices.</p>
            </div>
            <div className="bg-card rounded-xl p-8 shadow-sm border border-border hover:shadow-md transition-shadow">
              <Heart className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Wellness</h3>
              <p className="text-muted-foreground">We prioritize the holistic health and wellbeing of our members in everything we do.</p>
            </div>
          </div>
        </section>

        <Separator className="container mx-auto my-8" />

        {/* Team Section */}
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold text-center mb-12 font-serif">Meet Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Club Director",
                image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1776&auto=format&fit=crop"
              },
              {
                name: "Michael Chen",
                role: "Fitness Manager",
                image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=1770&auto=format&fit=crop"
              },
              {
                name: "Olivia Martinez",
                role: "Wellness Coordinator",
                image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop"
              },
              {
                name: "David Wilson",
                role: "Member Services",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop"
              }
            ].map((member, index) => (
              <div key={index} className="bg-card rounded-xl shadow-sm overflow-hidden border border-border hover:shadow-md transition-shadow">
                <div className="h-64 overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-muted-foreground">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-accent/5 py-16 mt-12">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Join Our Community?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Experience the RAS Club difference with our premium facilities, exceptional services, and welcoming community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="rounded-xl px-8 py-6" size="lg">
                Become a Member
              </Button>
              <Button variant="outline" className="rounded-xl px-8 py-6" size="lg">
                Book a Tour
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
