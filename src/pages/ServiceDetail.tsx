
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Clock, 
  Users, 
  Calendar, 
  CheckCircle, 
  Star, 
  MessageCircle, 
  Share2 
} from 'lucide-react';
import { servicesData } from '@/data/servicesData';
import { cn } from '@/lib/utils';
import AnimatedButton from '@/components/ui/AnimatedButton';
import { useBooking } from '@/contexts/BookingContext';
import { toast } from 'sonner';

const ServiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { setSelectedService } = useBooking();

  useEffect(() => {
    // Simulating data fetching
    const fetchService = () => {
      setIsLoading(true);
      const foundService = servicesData.find(s => s.id === id);
      
      if (foundService) {
        setService(foundService);
      }
      
      setIsLoading(false);
    };
    
    fetchService();
  }, [id]);

  const handleBookNow = () => {
    if (service) {
      setSelectedService(service);
      navigate('/book-activity');
      toast.success(`You're booking ${service.title}`, {
        description: 'Choose your preferred date and time slot.',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center pt-24">
          <div className="animate-pulse">
            <div className="h-8 w-64 bg-muted rounded mb-4"></div>
            <div className="h-4 w-48 bg-muted rounded"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex flex-col items-center justify-center pt-24 pb-16">
          <h1 className="text-3xl font-bold mb-4">Service Not Found</h1>
          <p className="text-muted-foreground mb-8">The service you're looking for doesn't exist or has been removed.</p>
          <Link to="/services">
            <Button>Back to Services</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Dummy data for the service detail page
  const features = [
    "Professional instructors & trainers",
    "State-of-the-art equipment",
    "Towel service included",
    "Complimentary refreshments",
    "Locker facilities available",
    "Advance booking priority for members"
  ];

  const reviews = [
    {
      name: "Emily Johnson",
      rating: 5,
      date: "2 weeks ago",
      comment: "Absolutely love this service! The instructors are amazing and the facilities are top-notch."
    },
    {
      name: "Michael Chen",
      rating: 4,
      date: "1 month ago",
      comment: "Great experience overall. Would recommend to anyone looking for a premium fitness experience."
    },
    {
      name: "Sarah Williams",
      rating: 5,
      date: "2 months ago",
      comment: "I've tried many similar services elsewhere but this one stands out for quality and attention to detail."
    }
  ];

  const relatedServices = servicesData
    .filter(s => s.category === service.category && s.id !== service.id)
    .slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        {/* Hero Section */}
        <div className="relative h-[60vh] overflow-hidden">
          <img 
            src={service.image} 
            alt={service.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="container mx-auto">
              <Link to="/services" className="inline-flex items-center text-white mb-4 hover:underline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Services
              </Link>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <Badge className={cn(
                    "capitalize mb-3",
                    service.category === "fitness" && "bg-blue-500 hover:bg-blue-600",
                    service.category === "wellness" && "bg-purple-500 hover:bg-purple-600",
                    service.category === "sports" && "bg-green-500 hover:bg-green-600",
                    service.category === "social" && "bg-orange-500 hover:bg-orange-600"
                  )}>
                    {service.category}
                  </Badge>
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{service.title}</h1>
                  <p className="text-white/80 text-lg max-w-3xl">{service.description}</p>
                </div>
                <div className="mt-6 md:mt-0">
                  <Button 
                    size="lg" 
                    className="rounded-xl px-8 shadow-lg hover:-translate-y-1 transition-transform"
                    onClick={handleBookNow}
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Service Details Section */}
        <section className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold mb-6 font-serif">About This Service</h2>
              <p className="text-muted-foreground mb-6">
                Our {service.title} offers a premium experience designed for maximum enjoyment and benefit. Featuring the latest equipment and amenities, you'll find everything you need for a satisfying session. Our professional staff is always available to assist and ensure you get the most out of your time with us.
              </p>
              <p className="text-muted-foreground mb-8">
                Whether you're a beginner or advanced practitioner, we cater to all skill levels with personalized attention and a supportive environment. The {service.title} is one of our most popular offerings, providing an exceptional experience that keeps our members coming back.
              </p>
              
              <h3 className="text-xl font-bold mb-4">Features & Amenities</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Separator className="my-8" />
              
              {/* Reviews Section */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold font-serif">Member Reviews</h3>
                  <span className="text-sm text-muted-foreground">4.7 out of 5 stars</span>
                </div>
                
                <div className="space-y-6 mb-8">
                  {reviews.map((review, index) => (
                    <div key={index} className="bg-card rounded-xl p-6 border border-border">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{review.name}</h4>
                          <div className="flex items-center mt-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star 
                                key={i} 
                                className={cn(
                                  "h-4 w-4 mr-1", 
                                  i < review.rating ? "text-amber-500 fill-amber-500" : "text-muted"
                                )} 
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">{review.date}</span>
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                    </div>
                  ))}
                </div>
                
                <Button variant="outline" className="rounded-xl">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Write a Review
                </Button>
              </div>
            </div>
            
            <div>
              {/* Service Info Card */}
              <div className="bg-card rounded-xl border border-border p-6 shadow-sm sticky top-24">
                <h3 className="text-xl font-bold mb-4 font-serif">Service Information</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-muted-foreground mr-3" />
                    <div>
                      <span className="text-sm text-muted-foreground">Duration</span>
                      <p className="font-medium">{service.duration || "Flexible sessions"}</p>
                    </div>
                  </div>
                  
                  {service.capacity && (
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-muted-foreground mr-3" />
                      <div>
                        <span className="text-sm text-muted-foreground">Capacity</span>
                        <p className="font-medium">{service.capacity}</p>
                      </div>
                    </div>
                  )}
                  
                  {service.schedule && (
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-muted-foreground mr-3" />
                      <div>
                        <span className="text-sm text-muted-foreground">Schedule</span>
                        <p className="font-medium">{service.schedule}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="bg-muted/50 p-4 rounded-lg mb-6">
                  <span className="block text-sm text-muted-foreground mb-1">Price</span>
                  <p className="text-xl font-bold">{service.price}</p>
                </div>
                
                <div className="space-y-3">
                  <Button className="w-full rounded-xl" onClick={handleBookNow}>
                    Book Now
                  </Button>
                  <Button variant="outline" className="w-full rounded-xl">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Related Services */}
        {relatedServices.length > 0 && (
          <section className="bg-muted/20 py-12">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold mb-8 font-serif">Related Services</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedServices.map((relatedService) => (
                  <div key={relatedService.id} className="bg-card rounded-xl overflow-hidden shadow-sm border border-border">
                    <div className="h-48 overflow-hidden relative">
                      <img 
                        src={relatedService.image} 
                        alt={relatedService.title} 
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                      <Badge className={cn(
                        "absolute top-2 right-2 capitalize",
                        relatedService.category === "fitness" && "bg-blue-500 hover:bg-blue-600",
                        relatedService.category === "wellness" && "bg-purple-500 hover:bg-purple-600",
                        relatedService.category === "sports" && "bg-green-500 hover:bg-green-600",
                        relatedService.category === "social" && "bg-orange-500 hover:bg-orange-600"
                      )}>
                        {relatedService.category}
                      </Badge>
                    </div>
                    <div className="p-5">
                      <h3 className="text-xl font-bold mb-2">{relatedService.title}</h3>
                      <p className="text-muted-foreground mb-4 line-clamp-2">{relatedService.description}</p>
                      <Link to={`/services/${relatedService.id}`}>
                        <AnimatedButton variant="outline" className="w-full" showArrow>
                          View Details
                        </AnimatedButton>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
        
        {/* CTA Section */}
        <section className="bg-accent/5 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Experience Our {service.title}?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Book your session today and discover the premium experience that our members love.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="rounded-xl px-8 py-6" 
                size="lg"
                onClick={handleBookNow}
              >
                Book Now
              </Button>
              <Link to="/contact">
                <Button variant="outline" className="rounded-xl px-8 py-6" size="lg">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ServiceDetail;
