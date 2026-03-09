import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Briefcase, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Target, 
  GraduationCap, 
  Heart, 
  Brain,
  Search,
  ArrowRight,
  Loader2,
  CheckCircle2,
  XCircle,
  TrendingUp,
  DollarSign,
  MapPin
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { UserProfile, CareerRecommendation } from './types';
import { getCareerRecommendations } from './services/gemini';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost', size?: 'sm' | 'md' | 'lg' }>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm',
      secondary: 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm',
      outline: 'border border-slate-200 bg-transparent hover:bg-slate-50 text-slate-700',
      ghost: 'bg-transparent hover:bg-slate-100 text-slate-600',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn('bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden', className)}>
    {children}
  </div>
);

const Input = ({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }) => (
  <div className="space-y-1.5">
    {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
    <input
      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      {...props}
    />
  </div>
);

const Badge = ({ children, className, variant = 'default' }: { children: React.ReactNode; className?: string; variant?: 'default' | 'success' | 'indigo' }) => {
  const variants = {
    default: 'bg-slate-100 text-slate-700',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
    indigo: 'bg-indigo-50 text-indigo-700 border border-indigo-100',
  };
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', variants[variant], className)}>
      {children}
    </span>
  );
};

// --- Main App ---

export default function App() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<CareerRecommendation[]>([]);
  const [profile, setProfile] = useState<UserProfile>({
    skills: [],
    interests: [],
    education: '',
    experienceLevel: 'Entry Level',
    workPreference: 'Hybrid',
    values: [],
  });

  const [currentSkill, setCurrentSkill] = useState('');
  const [currentInterest, setCurrentInterest] = useState('');
  const [currentValue, setCurrentValue] = useState('');

  const addTag = (type: 'skills' | 'interests' | 'values', value: string) => {
    if (!value.trim()) return;
    setProfile(prev => ({
      ...prev,
      [type]: [...new Set([...prev[type], value.trim()])]
    }));
    if (type === 'skills') setCurrentSkill('');
    if (type === 'interests') setCurrentInterest('');
    if (type === 'values') setCurrentValue('');
  };

  const removeTag = (type: 'skills' | 'interests' | 'values', index: number) => {
    setProfile(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await getCareerRecommendations(profile);
      setRecommendations(results);
      setStep(4); // Results step
    } catch (err) {
      setError('Failed to generate recommendations. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: "Welcome to Pathfinder",
      description: "Let's find your ideal career path using AI.",
      icon: <Sparkles className="w-8 h-8 text-indigo-600" />,
    },
    {
      title: "Skills & Education",
      description: "What are you good at and what have you studied?",
      icon: <Brain className="w-8 h-8 text-indigo-600" />,
    },
    {
      title: "Interests & Values",
      description: "What drives you and what do you enjoy doing?",
      icon: <Heart className="w-8 h-8 text-indigo-600" />,
    },
    {
      title: "Work Preferences",
      description: "How and where do you work best?",
      icon: <Target className="w-8 h-8 text-indigo-600" />,
    }
  ];

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6 py-12"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-indigo-50 mb-4">
              <Sparkles className="w-10 h-10 text-indigo-600" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 font-display">
              Discover Your Future
            </h1>
            <p className="text-lg text-slate-600 max-w-md mx-auto">
              Our AI-powered engine analyzes your unique profile to recommend career paths that align with your true potential.
            </p>
            <div className="pt-4">
              <Button size="lg" onClick={() => setStep(1)} className="px-8 py-6 text-lg rounded-2xl">
                Start Assessment <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        );

      case 1:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <Input 
                label="Highest Education" 
                placeholder="e.g. Bachelor's in Computer Science"
                value={profile.education}
                onChange={e => setProfile({...profile, education: e.target.value})}
              />
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Skills</label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Add a skill (e.g. Python, Design, Writing)"
                    value={currentSkill}
                    onChange={e => setCurrentSkill(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && addTag('skills', currentSkill)}
                  />
                  <Button onClick={() => addTag('skills', currentSkill)}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile.skills.map((skill, i) => (
                    <Badge key={i} className="pl-3 pr-1 py-1 flex items-center gap-1">
                      {skill}
                      <button onClick={() => removeTag('skills', i)} className="hover:text-red-500">
                        <XCircle className="w-3.5 h-3.5" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Interests</label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="What do you enjoy? (e.g. Problem Solving, Art)"
                    value={currentInterest}
                    onChange={e => setCurrentInterest(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && addTag('interests', currentInterest)}
                  />
                  <Button onClick={() => addTag('interests', currentInterest)}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile.interests.map((interest, i) => (
                    <Badge key={i} variant="indigo" className="pl-3 pr-1 py-1 flex items-center gap-1">
                      {interest}
                      <button onClick={() => removeTag('interests', i)} className="hover:text-red-500">
                        <XCircle className="w-3.5 h-3.5" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Core Values</label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="What matters to you? (e.g. Innovation, Stability)"
                    value={currentValue}
                    onChange={e => setCurrentValue(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && addTag('values', currentValue)}
                  />
                  <Button onClick={() => addTag('values', currentValue)}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile.values.map((val, i) => (
                    <Badge key={i} variant="success" className="pl-3 pr-1 py-1 flex items-center gap-1">
                      {val}
                      <button onClick={() => removeTag('values', i)} className="hover:text-red-500">
                        <XCircle className="w-3.5 h-3.5" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Experience Level</label>
                <select 
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={profile.experienceLevel}
                  onChange={e => setProfile({...profile, experienceLevel: e.target.value})}
                >
                  <option>Student</option>
                  <option>Entry Level</option>
                  <option>Mid-Level</option>
                  <option>Senior Level</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Work Preference</label>
                <select 
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={profile.workPreference}
                  onChange={e => setProfile({...profile, workPreference: e.target.value})}
                >
                  <option>Remote</option>
                  <option>Hybrid</option>
                  <option>On-site</option>
                </select>
              </div>
            </div>
            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm flex items-center gap-2">
                <XCircle className="w-4 h-4" /> {error}
              </div>
            )}
            <div className="pt-4">
              <Button 
                className="w-full py-6 text-lg rounded-2xl" 
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                    Analyzing your profile...
                  </>
                ) : (
                  <>
                    Generate Recommendations
                    <Sparkles className="ml-2 w-5 h-5" />
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 font-display">Your Career Matches</h2>
                <p className="text-slate-500">Based on your skills, interests, and values.</p>
              </div>
              <Button variant="outline" onClick={() => setStep(1)}>
                Retake Assessment
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {recommendations.map((rec, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="p-6 hover:border-indigo-200 transition-colors group">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                              {rec.title}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="success" className="bg-emerald-50 text-emerald-700">
                                {rec.matchScore}% Match
                              </Badge>
                              <Badge variant="indigo">
                                {rec.salaryRange}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-slate-600 leading-relaxed">
                          {rec.description}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                              <Target className="w-4 h-4 text-indigo-500" /> Key Skills
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {rec.keySkills.map((skill, j) => (
                                <span key={j} className="text-xs bg-slate-50 text-slate-600 px-2 py-1 rounded-md border border-slate-100">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                              <GraduationCap className="w-4 h-4 text-indigo-500" /> Education
                            </div>
                            <p className="text-xs text-slate-600">{rec.educationPath}</p>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100">
                          <p className="text-sm text-slate-600 italic">
                            <span className="font-semibold text-indigo-600 not-italic">Why it matches: </span>
                            {rec.whyItMatches}
                          </p>
                        </div>
                      </div>

                      <div className="md:w-48 space-y-4">
                        <div className="p-4 bg-slate-50 rounded-xl space-y-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                              <TrendingUp className="w-3 h-3" /> Growth
                            </div>
                            <p className="text-sm font-medium text-slate-700">{rec.growthProspects}</p>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                              <DollarSign className="w-3 h-3" /> Potential
                            </div>
                            <p className="text-sm font-medium text-slate-700">{rec.salaryRange}</p>
                          </div>
                        </div>
                        <Button className="w-full" variant="secondary">
                          Learn More <ChevronRight className="ml-1 w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 font-display tracking-tight">Pathfinder AI</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">How it works</a>
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Resources</a>
            <Button variant="ghost">Sign In</Button>
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        {step > 0 && step < 4 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-xl">
                  {steps[step].icon}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{steps[step].title}</h2>
                  <p className="text-sm text-slate-500">{steps[step].description}</p>
                </div>
              </div>
              <div className="text-sm font-medium text-slate-400">
                Step {step} of 3
              </div>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-indigo-600"
                initial={{ width: 0 }}
                animate={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>

        {step > 0 && step < 4 && (
          <div className="mt-8 flex items-center justify-between pt-6 border-t border-slate-200">
            <Button 
              variant="outline" 
              onClick={() => setStep(step - 1)}
              disabled={loading}
            >
              <ChevronLeft className="mr-2 w-4 h-4" /> Back
            </Button>
            {step < 3 && (
              <Button onClick={() => setStep(step + 1)}>
                Continue <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
            )}
          </div>
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white py-12">
        <div className="container mx-auto px-4 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 opacity-50">
            <Briefcase className="w-4 h-4" />
            <span className="text-sm font-bold font-display">Pathfinder AI</span>
          </div>
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Pathfinder AI. Empowering careers through intelligence.
          </p>
        </div>
      </footer>
    </div>
  );
}
