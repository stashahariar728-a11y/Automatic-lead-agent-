
import { GoogleGenAI, Type } from "@google/genai";
import type { UserCriteria, LeadReport } from '../types';

const reportObjectSchema = {
  type: Type.OBJECT,
  properties: {
    executiveSummary: { type: Type.STRING, description: "সম্পূর্ণ রিপোর্টটির একটি সংক্ষিপ্ত এবং পেশাদার সারসংক্ষেপ (বাংলায়)।" },
    leadScore: { type: Type.NUMBER, description: "১-১০ এর মধ্যে একটি স্কোর।" },
    businessOverview: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING, description: "ব্যবসার নাম (বাংলায়)।" },
        industry: { type: Type.STRING, description: "ব্যবসার শিল্প বা ধরণ (বাংলায়)।" },
        location: { type: Type.STRING, description: "ব্যবসার অবস্থান (বাংলায়)।" },
        website: { type: Type.STRING, description: "সম্পূর্ণ ওয়েবসাইট URL। পাওয়া না গেলে 'Data Not Available' লিখুন।" },
        socialMedia: { type: Type.STRING, description: "প্রধান সোশ্যাল মিডিয়া লিঙ্ক বা হ্যান্ডেল (ফেসবুক ছাড়া)। পাওয়া না গেলে 'Data Not Available' লিখুন।" },
        facebookLink: { type: Type.STRING, description: "ব্যবসার অফিসিয়াল ফেসবুক পেজের সম্পূর্ণ URL। পাওয়া না গেলে 'Data Not Available' লিখুন।" },
        businessStage: { type: Type.STRING, description: "ব্যবসার পর্যায়, যেমন - স্টার্টআপ, প্রতিষ্ঠিত (বাংলায়)।" },
      },
      required: ["name", "industry", "location", "website", "socialMedia", "facebookLink", "businessStage"],
    },
    digitalAuditFindings: {
      type: Type.OBJECT,
      properties: {
        branding: { type: Type.STRING, description: "ব্র্যান্ডিং এর গুণগত মানের বিশ্লেষণ (বাংলায়)।" },
        content: { type: Type.STRING, description: "বিষয়বস্তুর সামঞ্জস্য এবং গুণগত মানের বিশ্লেষণ (বাংলায়)।" },
        engagement: { type: Type.STRING, description: "ব্যবহারকারীর এনগেজমেন্টের বিশ্লেষণ (বাংলায়)।" },
        funnel: { type: Type.STRING, description: "সেলস/মার্কেটিং ফানেলের উপস্থিতির বিশ্লেষণ (বাংলায়)।" },
        ads: { type: Type.STRING, description: "শনাক্তযোগ্য বিজ্ঞাপন কার্যকলাপের বিশ্লেষণ (বাংলায়)।" },
        website: { type: Type.STRING, description: "ওয়েবসাইট অপ্টিমাইজেশান এবং UX এর বিশ্লেষণ (বাংলায়)।" },
      },
       required: ["branding", "content", "engagement", "funnel", "ads", "website"],
    },
    identifiedProblems: { type: Type.ARRAY, items: { type: Type.STRING }, description: "চিহ্নিত সমস্যাগুলির একটি বুলেট তালিকা (বাংলায়)।" },
    growthOpportunities: { type: Type.ARRAY, items: { type: Type.STRING }, description: "বৃদ্ধির সুযোগগুলির একটি বুলেট তালিকা (বাংলায়)।" },
    recommendedServices: { type: Type.STRING, description: "লিডের সমস্যার সাথে ব্যবহারকারীর পরিষেবার নির্দিষ্ট ম্যাপিং (বাংলায়)।" },
    outreachScripts: {
      type: Type.OBJECT,
      properties: {
        shortDM: { type: Type.STRING, description: "রিসার্চের ভিত্তিতে ব্যবসার কোনো একটি সমস্যা উল্লেখ করে একটি সংক্ষিপ্ত ও পেশাদার ডাইরেক্ট মেসেজ (বাংলায়)।" },
        emailVersion: { type: Type.STRING, description: "একটি বিস্তারিত, কাঠামোগত এবং পেশাদার ইমেল যা সম্পর্ক তৈরি করে (বাংলায়)।" },
      },
      required: ["shortDM", "emailVersion"],
    },
  },
  required: ["executiveSummary", "leadScore", "businessOverview", "digitalAuditFindings", "identifiedProblems", "growthOpportunities", "recommendedServices", "outreachScripts"],
};

const finalSchema = {
    type: Type.ARRAY,
    description: "দশটি লিড রিপোর্টের একটি তালিকা।",
    items: reportObjectSchema,
};


export async function generateLeadReport(criteria: UserCriteria): Promise<LeadReport[]> {
  const API_KEY = process.env.API_KEY;

  if (!API_KEY) {
    throw new Error('API কী কনফিগার করা নেই। অ্যাপ্লিকেশনটি সঠিকভাবে কাজ করার জন্য এটি প্রয়োজন।');
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const prompt = `
You are the "Automatic Lead Agent," a professional autonomous business intelligence AI. Your task is to generate a detailed analysis for TEN (10) high-quality business leads based on user criteria.

**CRITICAL INSTRUCTION: The entire output, for every field in the JSON schema, MUST be written in BENGALI (Bangla language), except for URLs and the specific string 'Data Not Available'.**

**USER CRITERIA:**
- **Niche:** ${criteria.niche}
- **Location:** ${criteria.location}
- **Target Problems to Solve:** ${criteria.targetProblems}
- **Your Intended Service to Offer:** ${criteria.intendedService}
- **Minimum Lead Score Threshold:** ${criteria.leadScoreThreshold}/10

**YOUR WORKFLOW FOR EACH OF THE 10 LEADS:**
1.  **Lead Discovery:** Find an active business matching the criteria using Google Search. **You MUST find their official Facebook Page URL.**
2.  **Qualification & Scoring:** Score the lead (must be >= ${criteria.leadScoreThreshold}/10).
3.  **Digital Audit:** Analyze their website, Facebook page, other social media, branding, content, etc.
4.  **Problem & Opportunity Identification:** List specific, actionable problems and clear growth opportunities.
5.  **Outreach Script Generation:** Based on the research summary and identified problems, create a professional and concise direct message (DM). The message should briefly mention a specific issue you found and connect it to your proposed service. Also, create a more detailed professional email.
6.  **Report Generation:** Create a structured report object for the lead. All text must be in Bengali. The 'facebookLink' field is mandatory.

**FINAL OUTPUT:**
You must return a JSON array containing exactly TEN (10) report objects. Each object must strictly follow the provided schema. Every string value must be in Bengali.

Begin your analysis.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: finalSchema,
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text.trim();
    const reportData = JSON.parse(text);
    
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (sources && reportData.length > 0) {
      // Add all sources to the first report for simplicity
      reportData[0].sources = sources.filter(s => 'web' in s);
    }
    
    return reportData as LeadReport[];

  } catch (error) {
    console.error("Error generating lead report:", error);
    if (error instanceof Error && error.message.includes('JSON')) {
        throw new Error('AI একটি বৈধ রিপোর্ট কাঠামো তৈরি করতে ব্যর্থ হয়েছে। অনুগ্রহ করে আরও স্পষ্ট মানদণ্ড দিয়ে আবার চেষ্টা করুন।');
    }
    throw new Error('Gemini API থেকে লিড রিপোর্ট তৈরি করতে ব্যর্থ হয়েছে।');
  }
}
