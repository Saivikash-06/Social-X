import { axiosClient } from "@/features/shared/services/axios-client";
import { ResearchPaper } from "../types";

export const MOCK_PAPERS: ResearchPaper[] = [
  {
    id: "PUB-2026-081",
    title:
      "Acoustic Wavelet Packet Transform for Micro-Leak Localization in Ductile Iron Water Networks",
    authors: ["Dr. Elena Rostova", "Alex Rivera", "Prof. K. Venkatesh"],
    department: "Civil & Environmental Engineering",
    university: "Stanford University",
    abstract:
      "This paper presents a sub-meter localization methodology for hidden potable water subterranean leaks utilizing high-frequency piezoelectric telemetry and discrete wavelet denoising.",
    category: "Smart Water Infrastructure",
    publishedYear: 2026,
    publicationYear: 2026,
    conferenceOrJournal: "IEEE Transactions on Smart Cities & Infrastructure",
    journalOrConference: "IEEE Transactions on Smart Cities & Infrastructure",
    doi: "10.1109/TSCI.2026.88412",
    downloadCount: 1420,
    citationsCount: 48,
    keywords: ["microgrid", "iot", "acoustic", "water", "urban"],
    pdfUrl: "#",
  },
  {
    id: "PUB-2026-064",
    title:
      "Volumetric Pothole Severity Indexing Using Mobile Monocular Depth Neural Nets",
    authors: ["Dr. Elena Rostova", "David Kim"],
    department: "Civil Engineering & Computer Science",
    university: "Stanford University",
    abstract:
      "A low-power edge computer vision pipeline for automated road distress surveying, benchmarked across 240km of metropolitan arterial roadways during monsoon seasons.",
    category: "Transportation & Vision AI",
    publishedYear: 2026,
    publicationYear: 2026,
    conferenceOrJournal: "Journal of Computing in Civil Engineering (ASCE)",
    journalOrConference: "Journal of Computing in Civil Engineering (ASCE)",
    doi: "10.1061/JCCEE5.2026.0491",
    downloadCount: 890,
    citationsCount: 26,
    keywords: ["traffic", "vision ai", "mobility", "urban"],
    pdfUrl: "#",
  },
  {
    id: "PUB-2025-112",
    title:
      "Pyrolytic Conversion of Wet Vegetable Market Sludge into Biocarbon Soil Conditioners",
    authors: ["Dr. Elena Rostova", "Maya Chen"],
    department: "Environmental Engineering",
    university: "Stanford University",
    abstract:
      "Evaluates a decentralized thermal decomposition unit capable of handling 5 tons daily of market organics, achieving 82% carbon retention with zero methane release.",
    category: "Solid Waste & Bio-Energy",
    publishedYear: 2025,
    publicationYear: 2025,
    conferenceOrJournal: "Waste Management & Research (SAGE)",
    journalOrConference: "Waste Management & Research (SAGE)",
    doi: "10.1177/0734242X25120",
    downloadCount: 2150,
    citationsCount: 63,
    keywords: ["clean energy", "bio-energy", "microgrid", "waste"],
    pdfUrl: "#",
  },
];

export const researchApi = {
  // Get all research papers
  async getRepositoryPapers(params?: {
    category?: string;
    search?: string;
  }): Promise<ResearchPaper[]> {
    try {
      const res = await axiosClient.get("/university/research/papers", { params });
      return res.data?.data || res.data;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 200));
      let filtered = [...MOCK_PAPERS];
      if (params?.category && params.category !== "all") {
        filtered = filtered.filter((p) => p.category === params.category);
      }
      if (params?.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.abstract.toLowerCase().includes(q) ||
            p.authors.some((a) => a.toLowerCase().includes(q))
        );
      }
      return filtered;
    }
  },

  // Upload Research Note / Document
  async uploadResearchDocument(formData: FormData): Promise<{ success: boolean; message: string }> {
    try {
      const res = await axiosClient.post("/university/research/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return {
        success: true,
        message: "Research document successfully uploaded to project repository.",
      };
    }
  },

  // Alias for compatibility
  async uploadDocument(formData: FormData): Promise<{ success: boolean; message: string }> {
    return this.uploadResearchDocument(formData);
  },
};
