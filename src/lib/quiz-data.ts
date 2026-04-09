export type EducationStage = "after_10th" | "after_12th_science" | "after_graduation";

export interface QuizQuestion {
  id: number;
  question: string;
  options: { label: string; value: string; categories: string[] }[];
}

export const stageQuestions: Record<EducationStage, QuizQuestion[]> = {
  after_10th: [
    {
      id: 101,
      question: "Which of these subjects excites you the most?",
      options: [
        { label: "Mathematics & Physics (I love logic and machines)", value: "sci_math", categories: ["engineering", "defense", "it_software"] },
        { label: "Biology & Chemistry (I want to study the human body)", value: "sci_bio", categories: ["medical"] },
        { label: "Economics & Accounting (I am interested in business)", value: "commerce", categories: ["management", "civil_services"] },
        { label: "History, Literature & Arts (I love creativity & society)", value: "arts", categories: ["skill_based", "civil_services"] },
      ],
    },
    {
      id: 102,
      question: "What is your preferred way of learning or working?",
      options: [
        { label: "Hands-on, building things physically or virtually", value: "build", categories: ["engineering", "diploma", "it_software"] },
        { label: "Reading, analyzing, and debating topics", value: "analyze", categories: ["civil_services", "management"] },
        { label: "Following strict physical routines and discipline", value: "discipline", categories: ["defense"] },
        { label: "Designing, drawing, or creating digital media", value: "create", categories: ["skill_based"] },
      ],
    },
    {
      id: 103,
      question: "How much time are you willing to dedicate to higher studies before starting to earn?",
      options: [
        { label: "I want to start earning quickly with technical skills (2-3 years)", value: "quick", categories: ["diploma", "skill_based"] },
        { label: "I am okay with a standard 4-year degree", value: "standard", categories: ["engineering", "it_software", "management"] },
        { label: "I am ready for 5.5+ years of intense medical studies", value: "long", categories: ["medical"] },
        { label: "I am ready to spend years preparing for tough government exams", value: "govt", categories: ["civil_services", "defense"] },
      ],
    },
    {
      id: 104,
      question: "When faced with a difficult problem, how do you solve it?",
      options: [
        { label: "Find a logical/mathematical solution", value: "logic", categories: ["engineering", "it_software"] },
        { label: "Research deeply and find human-centric solutions", value: "research", categories: ["medical", "civil_services"] },
        { label: "Take charge, organize people, and delegate", value: "lead", categories: ["management", "defense"] },
        { label: "Think outside the box and try a creative approach", value: "creative", categories: ["skill_based"] },
      ],
    },
    {
      id: 105,
      question: "Which work environment sounds best to you?",
      options: [
        { label: "A high-tech office with computers and servers", value: "office_tech", categories: ["it_software", "engineering"] },
        { label: "A hospital, clinic, or research lab", value: "hospital", categories: ["medical"] },
        { label: "A dynamic corporate boardroom leading teams", value: "corporate", categories: ["management"] },
        { label: "Outdoors, on the field, serving the nation", value: "field", categories: ["defense", "civil_services"] },
      ],
    }
  ],
  after_12th_science: [
    {
      id: 201,
      question: "Which entrance exams are you considering or most oriented towards?",
      options: [
        { label: "JEE / State Engineering Exams", value: "jee", categories: ["engineering", "it_software"] },
        { label: "NEET / Medical Exams", value: "neet", categories: ["medical"] },
        { label: "NDA / Defense Academy Exams", value: "nda", categories: ["defense"] },
        { label: "CUET / General Degree / Skill Courses", value: "cuet", categories: ["management", "civil_services", "skill_based"] },
      ],
    },
    {
      id: 202,
      question: "What type of career impact do you want to make?",
      options: [
        { label: "Inventing new technologies or software", value: "tech_impact", categories: ["it_software", "engineering"] },
        { label: "Saving lives and improving public health", value: "health_impact", categories: ["medical"] },
        { label: "Protecting the country and serving citizens", value: "protect_impact", categories: ["defense", "civil_services"] },
        { label: "Scaling businesses and global economics", value: "biz_impact", categories: ["management"] },
      ],
    },
    {
      id: 203,
      question: "Are you more interested in mastering a specific domain or managing people?",
      options: [
        { label: "Mastering complex software/hardware systems", value: "master_tech", categories: ["engineering", "it_software"] },
        { label: "Mastering medical science and patient care", value: "master_med", categories: ["medical"] },
        { label: "Leading, organizing, and managing teams", value: "manage_teams", categories: ["management", "civil_services"] },
        { label: "Mastering independent creative/design skills", value: "master_skill", categories: ["skill_based"] },
      ],
    },
    {
      id: 204,
      question: "Which of these subjects did you excel in during 11th & 12th?",
      options: [
        { label: "Mathematics & Computer Science", value: "math_cs", categories: ["engineering", "it_software"] },
        { label: "Physics & Physical Education", value: "phy_pe", categories: ["defense"] },
        { label: "Biology", value: "bio", categories: ["medical"] },
        { label: "Business Studies, Accounts or Humanities", value: "arts_comm", categories: ["management", "civil_services", "skill_based"] },
      ],
    },
    {
      id: 205,
      question: "How do you handle high-pressure situations?",
      options: [
        { label: "Write code or systematically debug the issue", value: "debug", categories: ["it_software", "engineering"] },
        { label: "Stay calm, follow protocols, saving lives", value: "calm", categories: ["medical", "defense"] },
        { label: "Strategize, negotiate, and take fast decisions", value: "strategize", categories: ["management", "civil_services"] },
        { label: "Adapt creatively and find a workaround", value: "adapt", categories: ["skill_based"] },
      ],
    }
  ],
  after_graduation: [
    {
      id: 301,
      question: "What is your immediate goal after graduation?",
      options: [
        { label: "Get a high-paying corporate/tech job immediately", value: "job", categories: ["it_software", "management", "engineering"] },
        { label: "Prepare for competitive exams (UPSC/SSC)", value: "exam", categories: ["civil_services"] },
        { label: "Pursue higher studies (MBA, PGDM)", value: "mba", categories: ["management"] },
        { label: "Start freelancing or my own creative agency", value: "business", categories: ["skill_based"] },
      ],
    },
    {
      id: 302,
      question: "What specific skill sets do you hold presently?",
      options: [
        { label: "Coding, Cloud, Algorithms", value: "coding", categories: ["it_software"] },
        { label: "Finance, Marketing, Business Logic", value: "biz", categories: ["management"] },
        { label: "General Knowledge, Law, Public Policy", value: "policy", categories: ["civil_services", "defense"] },
        { label: "Design, Video Editing, Writing", value: "design", categories: ["skill_based"] },
      ],
    },
    {
      id: 303,
      question: "Which lifestyle describes your career aspirations?",
      options: [
        { label: "Corporate ladder, foreign trips, high salary", value: "corporate_life", categories: ["management"] },
        { label: "Stable government job with high social respect", value: "govt_life", categories: ["civil_services"] },
        { label: "Remote work, tech hubs, continuous learning", value: "tech_life", categories: ["it_software", "skill_based"] },
        { label: "On-the-ground action, physical activity, discipline", value: "defense_life", categories: ["defense"] },
      ],
    },
    {
      id: 304,
      question: "If you had multiple job offers right now, you would choose the one that offers:",
      options: [
        { label: "The latest tech stack and complex engineering problems", value: "offer_tech", categories: ["it_software", "engineering"] },
        { label: "Power, authority, and public service opportunities", value: "offer_power", categories: ["civil_services"] },
        { label: "Leadership roles, strategy, and business growth", value: "offer_biz", categories: ["management"] },
        { label: "Creative freedom and flexible hours", value: "offer_free", categories: ["skill_based"] },
      ],
    },
    {
      id: 305,
      question: "What kind of continuous learning are you willing to do?",
      options: [
        { label: "Learning new programming languages and frameworks", value: "learn_code", categories: ["it_software"] },
        { label: "Reading current affairs, history, and law", value: "learn_news", categories: ["civil_services"] },
        { label: "Reading market trends, economics, case studies", value: "learn_market", categories: ["management"] },
        { label: "Learning new medical practices or deep physical training", value: "learn_med_phys", categories: ["medical", "defense"] },
      ],
    }
  ]
};


export function calculateDynamicResults(answers: Record<number, string>, stage: EducationStage): { category: string; score: number }[] {
  const scores: Record<string, number> = {
    engineering: 0,
    medical: 0,
    management: 0,
    civil_services: 0,
    defense: 0,
    it_software: 0,
    diploma: 0,
    skill_based: 0
  };

  const questions = stageQuestions[stage];

  questions.forEach((q) => {
    const answer = answers[q.id];
    if (!answer) return;
    const option = q.options.find((o) => o.value === answer);
    if (!option) return;
    option.categories.forEach((cat) => {
      scores[cat] += 10;
    });
  });

  return Object.entries(scores)
    .filter(([_, score]) => score > 0)
    .map(([category, score]) => ({ category, score }))
    .sort((a, b) => b.score - a.score);
}

export function generateAIInsights(results: { category: string; score: number }[], stage: EducationStage) {
  if (!results.length) {
    return {
      message: "We need more data to generate insights for you.",
      nextSteps: ["Complete the quiz fully."]
    };
  }

  const topCategory = results[0].category;

  let message = "";
  let nextSteps: string[] = [];

  switch(topCategory) {
    case "it_software":
      message = "You show a very strong aptitude for logical reasoning, problem-solving, and technology. An IT or Software career perfectly aligns with your analytical mindset.";
      nextSteps = stage === "after_10th" ? ["Opt for PCM in 11th.", "Start learning basic Python."] : (stage === "after_12th_science" ? ["Prepare for JEE Main/Advanced or State CETs.", "Look into BCA or BTech degrees."] : ["Build a strong GitHub portfolio.", "Focus on LeetCode and DSA.", "Apply for SDE roles."]);
      break;
    case "engineering":
      message = "Your interest in building, designing, and understanding how things work makes traditional engineering streams (Mechanical, Civil, Electronics) an excellent match.";
      nextSteps = stage === "after_10th" ? ["Choose Science (PCM).", "Participate in science fairs and robotics."] : (stage === "after_12th_science" ? ["Take Engineering Entrance Exams (JEE).", "Research specific engineering branches."] : ["Pursue MTech or GATE.", "Apply for core engineering firms."]);
      break;
    case "medical":
      message = "You have profound empathy combined with a scientific temperament. A career in medical sciences where you can research and save lives suits you best.";
      nextSteps = stage === "after_10th" ? ["Opt for PCB in 11th.", "Start reading human anatomy basics."] : (stage === "after_12th_science" ? ["Prepare intensely for NEET.", "Look into alternative paths like BDS or Biotechnology."] : ["Prepare for PG medical entrance exams.", "Seek hospital residency programs."]);
      break;
    case "management":
      message = "Your leadership qualities, strategic thinking, and interest in economics indicate that you will thrive in corporate environments, business operations, and management.";
      nextSteps = stage === "after_10th" ? ["Opt for Commerce in 11th.", "Join business and debate clubs."] : (stage === "after_12th_science" ? ["Look into BBA or BCom degrees.", "Prepare for IPMAT or similar entry exams."] : ["Prepare for CAT, GMAT, or XAT.", "Gain some entry-level corporate experience."]);
      break;
    case "civil_services":
      message = "You exhibit a deep interest in society, governance, and taking on massive responsibilities. A powerful administrative role in civil services calls your name.";
      nextSteps = stage === "after_10th" ? ["Opt for Arts/Humanities or Commerce.", "Start reading daily newspapers."] : (stage === "after_12th_science" ? ["Choose a graduation subject you love.", "Begin reading NCERTs and current affairs."] : ["Dedicate 1-2 years to intense UPSC preparation.", "Join test series and mock interviews."]);
      break;
    case "defense":
      message = "Your preference for discipline, physical action, and serving the nation indicates you belong in the honorable Armed Forces.";
      nextSteps = stage === "after_10th" ? ["Opt for PCM (preferred for Navy/Airforce).", "Maximize physical fitness."] : (stage === "after_12th_science" ? ["Prepare strictly for the NDA & NA Examination.", "Join NCC if possible."] : ["Prepare for CDS or AFCAT exams.", "Focus on SSB interview preparation."]);
      break;
    case "diploma":
      message = "You want practical, fast-tracked, and hands-on professional learning rather than theoretical schooling. Technical diplomas are your fastest route to earning.";
      nextSteps = ["Research local Polytechnic colleges.", "Decide on a specific trade (e.g. Electrical, Mechanical).", "Prepare for state diploma entrance tests."];
      break;
    case "skill_based":
      message = "You are highly creative and value your independence. Skill-based digital careers like Design, Marketing, or Freelancing sit perfectly with your persona.";
      nextSteps = ["Build a strong online portofolio.", "Take specialized courses on Udemy or Coursera.", "Network with professionals on LinkedIn."];
      break;
    default:
      message = "Your interests are diverse! You have a multi-faceted personality that could adapt to many modern interdisciplinary roles.";
      nextSteps = ["Explore short internships.", "Talk to a career counselor.", "Keep learning new skills."];
      break;
  }

  return { message, nextSteps };
}
