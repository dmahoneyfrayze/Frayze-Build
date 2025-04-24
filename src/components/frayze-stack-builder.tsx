import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, ArrowLeft, Calendar, FileText, Sparkles, X } from "lucide-react";
import { AddonGrid } from "@/components/addon-grid";
import { AddonSummary } from "@/components/addon-summary";
import { AddonSearch } from "@/components/addon-search";
import { CategoryTabs } from "@/components/category-tabs";
import { Hero } from "@/components/hero";
import { BusinessProfiler } from "@/components/business-profiler";
import { ContactForm } from "@/components/contact-form";
import { ChatBot } from "@/components/chat-bot";
import { Footer } from "@/components/footer";
import { addonCategories, addons, getRecommendedAddons, coreSystems } from "@/data/addons";
import { type Addon } from "@/types";
import { sendSelections } from '../api/webhook';

export default function FrayzeStackBuilder() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selected, setSelected] = useState<Addon[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("ai-recommended");
  const [activeSubcategory, setActiveSubcategory] = useState("");
  const [selectedCore, setSelectedCore] = useState<Addon | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showProfiler, setShowProfiler] = useState(false);
  const [businessProfile, setBusinessProfile] = useState<{
    businessType: string;
    teamSize: string;
    mainGoal: string;
  } | null>(null);
  
  const totalPrice = useMemo(() => selected.reduce((sum, addon) => {
    if (addon?.pricing?.type === 'monthly' && addon.pricing.amount) {
      return sum + addon.pricing.amount;
    }
    return sum;
  }, 0), [selected]);
  
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      if (currentStep === 2) {
        setSelected([]);
        setBusinessProfile(null);
        setActiveCategory("ai-recommended");
        setActiveSubcategory("");
      }
    }
  };
  
  const handleContactSubmit = useCallback(async (formData: any) => {
    try {
      await sendSelections({
        selections: selected.map(addon => ({
          id: addon.id,
          name: addon.name,
          description: addon.description,
          category: addon.category,
          subcategory: addon.subcategory,
          pricing: addon.pricing,
          includes: addon.includes
        })),
        metadata: {
          totalPrice,
          businessProfile,
          contact: {
            businessName: formData.businessName,
            contactName: formData.contactName,
            email: formData.email,
            phone: formData.phone,
            website: formData.website,
            bestTimeToContact: formData.bestTimeToContact
          },
          preferences: {
            budget: formData.budget,
            timeline: formData.timeline,
            additionalInfo: formData.additionalInfo
          }
        }
      });
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.error('Failed to submit selections:', error);
    }
  }, [selected, businessProfile, currentStep, totalPrice]);
  
  const handleProfileSubmit = (profile: typeof businessProfile) => {
    setBusinessProfile(profile);
    setCurrentStep(2); // Move to add-ons step
    if (profile) {
      setActiveCategory(profile.teamSize === "core" ? "all" : "ai-recommended");
      let recommendations: Addon[] = [];
      
      if (profile.teamSize === "core") {
        // Direct core system selection
        const selectedSystem = coreSystems.find(system => system.id === profile.businessType);
        if (selectedSystem) {
          setSelectedCore(selectedSystem);
          setSelected([selectedSystem]);
        }
      } else {
        // AI recommendations
        setSelectedCore(null);
        recommendations = getRecommendedAddons(profile);
        setSelected(recommendations);
      }
      
      document.getElementById('addons')?.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const toggleAddon = (addon: Addon) => {
    // If this is a core system, replace everything
    if (addon.category === "core") {
      setSelectedCore(addon);
      setSelected([addon]);
      return;
    }

    if (addon.includes) {
      // For bundles, toggle all included add-ons
      const includedAddons = addons.filter(a => addon.includes?.includes(a.id));
      setSelected(prev => {
        const hasAll = includedAddons.every(a => prev.some(p => p.id === a.id));
        if (hasAll) {
          return prev.filter(p => !addon.includes?.includes(p.id));
        } else {
          const newSelection = [...prev];
          includedAddons.forEach(a => {
            if (!newSelection.some(p => p.id === a.id)) {
              newSelection.push(a);
            }
          });
          return newSelection;
        }
      });
      return;
    }

    setSelected(prev =>
      prev.some(a => a.id === addon.id) 
        ? prev.filter(a => a.id !== addon.id) 
        : [...prev, addon]
    );
  };
  
  const filteredAddons = addons.filter(addon => {
    const matchesSearch = addon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         addon.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Basic search filter
    if (!matchesSearch) return false;
    
    // Don't show core systems in the add-ons grid
    if (addon.category === "core") return false;
    
    if (activeCategory === "all") {
      return true;
    }

    // For specific categories, check both category and subcategory
    if (activeCategory === addon.category) {
      return !activeSubcategory || addon.subcategory === activeSubcategory;
    }

    // For AI recommendations
    if (activeCategory === "ai-recommended" && businessProfile) {
      const recommendations = getRecommendedAddons(businessProfile);
      return recommendations.some(rec => rec.id === addon.id);
    }

    return false;
  });
  
  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-background to-background/90">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,102,255,0.1),rgba(255,255,255,0)_50%)]" />
      </div>
      
      {currentStep > 1 && (
        <Button
          variant="ghost"
          size="default"
          className="fixed top-4 left-4 z-20 bg-white/80 backdrop-blur-sm border shadow-sm hover:bg-white/90 hover:shadow-md transition-all duration-300"
          onClick={handleBack}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      )}

      <Hero />

      <AnimatePresence mode="wait">
        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="container px-4 py-12 mx-auto max-w-[1400px]"
          >
            <BusinessProfiler 
              onSubmit={handleProfileSubmit}
            />
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="container px-4 py-8 mx-auto max-w-[1400px]"
            id="addons"
          >
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b">
              <div>
                <h2 className="text-2xl font-bold mb-1">
                  {businessProfile ? 'Your Recommended Stack' : 'Available Add-ons'}
                </h2>
                {businessProfile?.teamSize !== "core" && (
                  <p className="text-sm text-muted-foreground">
                    AI-recommended services based on your business profile
                  </p>
                )}
              </div>
              <AddonSearch 
                searchQuery={searchQuery} 
                setSearchQuery={setSearchQuery} 
              />
            </div>
            
            <CategoryTabs 
              categories={addonCategories} 
              activeCategory={activeCategory}
              showRecommended={businessProfile?.teamSize !== "core"}
              activeSubcategory={activeSubcategory}
              setActiveCategory={setActiveCategory}
              setActiveSubcategory={setActiveSubcategory}
            />
            
            <AddonGrid 
              addons={filteredAddons}
              selected={selected}
              toggleAddon={toggleAddon}
            />
            
            {filteredAddons.length === 0 && (
              <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-lg border-border bg-muted/30">
                <p className="text-lg text-muted-foreground text-center">
                  No add-ons found matching your criteria. Try adjusting your search or category.
                </p>
              </div>
            )}
          </div>
          
          <div className="lg:sticky lg:top-6 h-fit">
            <AddonSummary 
              selected={selected} 
              totalPrice={totalPrice} 
              toggleAddon={toggleAddon}
              onNext={() => setShowContactForm(true)}
            />
          </div>
        </div>
          </motion.div>
        )}

        {currentStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="container px-4 py-12 mx-auto max-w-7xl"
          >
            <div className="max-w-2xl mx-auto relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 hover:bg-primary/10"
                onClick={() => {
                  setCurrentStep(1);
                  setSelected([]);
                  setBusinessProfile(null);
                  setActiveCategory("ai-recommended");
                  setActiveSubcategory("");
                }}
                aria-label="Close acknowledgement"
              >
                <X className="h-4 w-4" />
              </Button>

              <div className="inline-flex items-center justify-center p-3 rounded-full bg-gradient-to-br from-[#0066FF] to-[#00F6A3] text-white mb-4 mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Thanks! Your Quote Request is Confirmed</h2>
                <p className="text-muted-foreground">
                  A Frayze strategist will review your stack and follow up within 24 hours.
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-[#0066FF] to-[#00F6A3] hover:from-[#0052CC] hover:to-[#00E69D] text-white"
                  onClick={() => window.open('https://calendly.com/frayze/demo', '_blank')}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Book a Call Now
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    // Generate and download PDF logic would go here
                    console.log('Downloading estimate...');
                  }}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Download Estimate PDF
                </Button>
              </div>
              
              <Card className="bg-muted/30 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">What happens next?</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-primary" />
                        A Frayze strategist will review your requirements
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-primary" />
                        We'll prepare a detailed proposal with exact pricing
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-primary" />
                        Schedule a call to discuss implementation details
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>
              
              <div className="mt-6 text-center">
                <Button 
                  variant="ghost"
                  onClick={() => setCurrentStep(1)}
                >
                  Start Another Quote
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {showContactForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto py-8">
          <div className="container mx-auto px-4">
            <ContactForm 
              selected={selected} 
              totalPrice={totalPrice} 
              onSubmit={handleContactSubmit}
              onBack={handleBack}
              onClose={() => setShowContactForm(false)}
            />
          </div>
        </div>
      )}
      
      <Footer />
      
      <ChatBot 
        onHelpMeChoose={() => {
          const element = document.querySelector('.business-profiler');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setShowProfiler(true);
          }
        }}
      />
    </div>
  );
}