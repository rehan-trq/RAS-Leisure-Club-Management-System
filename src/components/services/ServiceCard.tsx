
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AnimatedButton from '@/components/ui/AnimatedButton';
import { Clock, Users, Calendar, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ServiceCardProps {
  service: {
    id: string;
    title: string;
    description: string;
    image: string;
    category: string;
    price: string;
    duration?: string;
    capacity?: string;
    schedule?: string;
    popular?: boolean;
  };
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg card-hover group">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={service.image} 
          alt={service.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {service.popular && (
          <Badge className="absolute top-2 right-2 bg-accent text-white font-medium">
            Popular
          </Badge>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-serif text-xl font-bold">{service.title}</h3>
          <Badge variant="outline" className={cn(
            "capitalize",
            service.category === "fitness" && "border-blue-500 text-blue-600",
            service.category === "wellness" && "border-purple-500 text-purple-600",
            service.category === "sports" && "border-green-500 text-green-600",
            service.category === "social" && "border-orange-500 text-orange-600"
          )}>
            {service.category}
          </Badge>
        </div>
        
        <p className="text-muted-foreground mb-4">{service.description}</p>
        
        {/* Service details */}
        <div className="space-y-2 mb-4">
          {service.duration && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock size={16} />
              <span>{service.duration}</span>
            </div>
          )}
          
          {service.capacity && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users size={16} />
              <span>{service.capacity}</span>
            </div>
          )}
          
          {service.schedule && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar size={16} />
              <span>{service.schedule}</span>
            </div>
          )}
        </div>
        
        <div className="text-lg font-bold">{service.price}</div>
      </CardContent>
      
      <CardFooter className="pt-0 pb-6">
        <AnimatedButton 
          variant="outline" 
          className="w-full mt-2" 
          showArrow
        >
          Learn More
        </AnimatedButton>
      </CardFooter>
    </Card>
  );
};

export default ServiceCard;
