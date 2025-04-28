
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const Legal: React.FC = () => {
  const { section } = useParams<{ section?: string }>();
  
  return (
    <div className="py-8 px-4 max-w-3xl mx-auto">
      <Button 
        variant="ghost" 
        asChild 
        className="mb-6"
      >
        <Link to="/" className="flex items-center">
          <ArrowLeft size={16} className="mr-2" />
          Back to Home
        </Link>
      </Button>
      
      {section === 'privacy' ? (
        <PrivacyPolicy />
      ) : (
        <TermsOfService />
      )}
      
      <div className="mt-8 pt-4 border-t text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Reelz. All rights reserved.</p>
        <div className="flex space-x-4 mt-2">
          <Link to="/legal" className="hover:underline">Terms of Service</Link>
          <Link to="/legal/privacy" className="hover:underline">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
};

const TermsOfService: React.FC = () => (
  <>
    <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
    
    <div className="space-y-6">
      <section>
        <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
        <p>Welcome to Reelz. By accessing or using our service, you agree to be bound by these Terms of Service.</p>
      </section>
      
      <section>
        <h2 className="text-xl font-semibold mb-2">2. Content Guidelines</h2>
        <p>Users are responsible for the content they upload and share. Content must not violate any laws, infringe on intellectual property rights, or contain harmful material.</p>
      </section>
      
      <section>
        <h2 className="text-xl font-semibold mb-2">3. User Accounts</h2>
        <p>You are responsible for maintaining the confidentiality of your account information and for all activities under your account.</p>
      </section>
      
      <section>
        <h2 className="text-xl font-semibold mb-2">4. Service Changes</h2>
        <p>We reserve the right to modify or discontinue the service at any time, with or without notice.</p>
      </section>
      
      <section>
        <h2 className="text-xl font-semibold mb-2">5. Limitation of Liability</h2>
        <p>Reelz shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the service.</p>
      </section>
    </div>
  </>
);

const PrivacyPolicy: React.FC = () => (
  <>
    <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
    
    <div className="space-y-6">
      <section>
        <h2 className="text-xl font-semibold mb-2">1. Information We Collect</h2>
        <p>We collect information you provide directly, such as account information, content you upload, and interactions with the platform.</p>
      </section>
      
      <section>
        <h2 className="text-xl font-semibold mb-2">2. How We Use Information</h2>
        <p>We use the information to provide, maintain, and improve our services, communicate with you, and personalize your experience.</p>
      </section>
      
      <section>
        <h2 className="text-xl font-semibold mb-2">3. Information Sharing</h2>
        <p>We do not sell your personal information. We may share information with third-party service providers who help us operate our services.</p>
      </section>
      
      <section>
        <h2 className="text-xl font-semibold mb-2">4. Data Security</h2>
        <p>We implement reasonable measures to help protect your personal information from loss, theft, misuse, and unauthorized access.</p>
      </section>
      
      <section>
        <h2 className="text-xl font-semibold mb-2">5. Your Rights</h2>
        <p>You have rights regarding your personal information, including the right to access, correct, or delete your data.</p>
      </section>
    </div>
  </>
);

export default Legal;
