
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Domain } from './DomainContext';

export interface SessionSummary {
  patientId: string;
  sessionNumber: number;
  startTime: Date;
  endTime: Date;
  domains: {
    domain: Domain;
    findings: string;
  }[];
  transcript: string;
  assessmentType?: 'CAS' | 'VRAIE';
}

interface SessionContextType {
  sessionSummary: SessionSummary | null;
  createSession: (patientId: string, selectedDomains: Domain[], assessmentType?: 'CAS' | 'VRAIE') => void;
  hasActiveSession: boolean;
}

// Mock transcript data
const MOCK_TRANSCRIPT = `
CLINICIAN: Hello, how are you feeling today?
PATIENT: I'm okay, I guess. Just a bit tired.
CLINICIAN: I see. Can you tell me about your sleep patterns recently?
PATIENT: I've been having trouble falling asleep. I think I get about 5 hours most nights.
CLINICIAN: That's not a lot. Do you find yourself waking up during the night?
PATIENT: Yeah, usually around 3 AM. Then I struggle to get back to sleep.
CLINICIAN: I understand. And how has your mood been lately?
PATIENT: Up and down. I feel pretty low in the mornings, better in the afternoons.
CLINICIAN: Have you been able to keep up with your daily activities?
PATIENT: Mostly, but I've been calling in sick to work more than usual. Just don't have the energy.
CLINICIAN: How about your social connections? Have you been spending time with others?
PATIENT: Not really. I've been canceling plans. Just want to be alone most of the time.
CLINICIAN: Thank you for sharing that. Let's talk about coping strategies you might be using...
`;

// Mock findings by domain
const MOCK_FINDINGS: Record<string, string> = {
  history: "Patient reports no significant changes to medical history since last assessment. Family history of depression noted previously remains relevant to current presentation.",
  sleep: "Patient reports significant sleep disturbance with initial insomnia and early morning awakening. Average sleep duration 5 hours. Sleep quality rated as poor. Consistent with insomnia pattern observed in previous assessments.",
  mood: "Patient describes fluctuating mood with morning lows and afternoon improvement. Subjective rating of 4/10 for average mood. No suicidal ideation reported. Mood symptoms appear moderately severe.",
  coping: "Patient has discontinued previously effective coping strategies including daily walks and journaling. Currently using primarily passive coping mechanisms like media consumption. Limited active problem-solving observed.",
  social: "Significant withdrawal from social activities noted. Patient reports canceling plans and avoiding social contact. Describes increased desire for isolation. This represents a decline from previous assessment.",
  physical: "Patient reports fatigue and low energy as primary physical complaints. No change in appetite. No new physical symptoms reported that would suggest medical cause for presentation.",
  substance: "Patient denies any alcohol use. No smoking or recreational drug use reported. No change in caffeine consumption patterns. Medication adherence reported as consistent.",
  functioning: "Occupational functioning shows decline with increased absenteeism. Basic self-care maintained but patient reports decreased motivation for household tasks. Overall moderate functional impairment.",
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sessionSummary, setSessionSummary] = useState<SessionSummary | null>(null);
  const [hasActiveSession, setHasActiveSession] = useState(false);

  const createSession = (patientId: string, selectedDomains: Domain[], assessmentType: 'CAS' | 'VRAIE' = 'CAS') => {
    // For prototype, we generate a mock session with the selected domains
    const startTime = new Date();
    startTime.setHours(startTime.getHours() - 1); // Session started 1 hour ago
    
    const endTime = new Date(); // Session ended now
    
    const domainSummaries = selectedDomains.map(domain => ({
      domain,
      findings: MOCK_FINDINGS[domain.id] || "No significant findings noted in this domain."
    }));
    
    const newSession: SessionSummary = {
      patientId,
      sessionNumber: Math.floor(Math.random() * 10) + 1, // Random session number 1-10
      startTime,
      endTime,
      domains: domainSummaries,
      transcript: MOCK_TRANSCRIPT,
      assessmentType
    };
    
    setSessionSummary(newSession);
    setHasActiveSession(true);
  };

  return (
    <SessionContext.Provider value={{ sessionSummary, createSession, hasActiveSession }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = (): SessionContextType => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
