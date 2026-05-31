// ═══════════════════════════════════════════════════
// AJEET KUMAR — CENTRAL PORTFOLIO DATA STORE
// All pages read from here. Admin panel writes to
// localStorage overrides keyed as "portfolio_<key>".
// ═══════════════════════════════════════════════════
const PORTFOLIO_DATA = {
  personal: {
    name: "Ajeet Kumar",
    title: "Quant Finance & Financial Engineering",
    subtitle: "MSc Financial Engineering · M.Tech CSE · Bangalore, India",
    tagline: "Quant Finance · Financial Engineering · ML in Finance",
    email: "ajeetk095@gmail.com",
    phone: "+91 8756543310",
    location: "Bangalore, India",
    linkedin: "https://linkedin.com/in/ajeek095",
    github: "https://github.com/ajeetk095",
    photo: "../assets/img/ajeet_pfp1.png",
    resume_link: "https://drive.google.com/drive/folders/1A6jo4e2m03kGAExw8fJCue7abWAVPV1m?usp=sharing",
    certificates_folder: "https://drive.google.com/drive/folders/1A6jo4e2m03kGAExw8fJCue7abWAVPV1m?usp=sharing",
    summary: "Quantitative finance and financial engineering professional with dual postgraduate degrees — MSc Financial Engineering from WorldQuant University (87%) and M.Tech CSE from NSUT Delhi (CGPA 7.92). Specialising in portfolio optimisation, risk analytics, and ML in finance. Winner of 1st place at IIT Kanpur Hackathon 2019."
  },
  stats: [
    { num: 87, suffix: "%", label: "WQU Score" },
    { num: 4,  suffix: "+", label: "Quant Projects" },
    { num: 30, suffix: "+", label: "Certifications" },
    { num: 5,  suffix: "+", label: "Years Study" }
  ],
  education: [
    {
      id: "wqu", flag: "🌐",
      uni: "WorldQuant University, Washington DC, USA (Online)",
      degree: "Master of Science — Financial Engineering",
      period: "Oct 2023 – Present",
      score: "87% · Proficient (Cumulative)",
      courses: [
        { code:"MScFE 560", name:"Financial Markets", score:"81%", grade:"Proficient" },
        { code:"MScFE 600", name:"Financial Data", score:"84%", grade:"Proficient" },
        { code:"MScFE 610", name:"Financial Econometrics", score:"94%", grade:"Excellent ★" },
        { code:"MScFE 620", name:"Derivative Pricing", score:"88%", grade:"Proficient" },
        { code:"MScFE 622", name:"Stochastic Modeling", score:"88%", grade:"Proficient" },
        { code:"MScFE 632", name:"Machine Learning in Finance", score:"78%", grade:"Satisfactory" },
        { code:"MScFE 642", name:"Deep Learning for Finance", score:"95%", grade:"Excellent ★" },
        { code:"MScFE 652", name:"Portfolio Management", score:"84%", grade:"Proficient" }
      ]
    },
    {
      id: "nsut", flag: "🏛",
      uni: "Netaji Subhas University of Technology (NSUT), New Delhi, India",
      degree: "Master of Technology — Computer Science & Engineering",
      period: "Oct 2021 – Jul 2023",
      score: "CGPA: 7.92/10 · First Division",
      courses: []
    },
    {
      id: "aktu", flag: "🏛",
      uni: "Dr. A.P.J. Abdul Kalam Technical University (AKTU), Lucknow",
      degree: "Bachelor of Technology — Information Technology",
      period: "Aug 2017 – Aug 2021",
      score: "CGPA: 7.19/10 · First Division",
      courses: []
    }
  ],
  experience: [
    {
      id:"amul", icon:"🧈",
      role:"Market Research & Development Analyst Intern",
      company:"Amul GCMMF Ltd.",
      location:"Kanpur, UP",
      period:"Oct 2020 – Jan 2021",
      type:"internship",
      bullets:[
        "Conducted market research on consumer behaviour and competitive positioning across 25+ cities in Uttar Pradesh.",
        "Analysed regional sales data to identify trends and recommended targeted marketing strategies.",
        "Delivered actionable insights supporting regional distribution and promotional planning."
      ]
    },
    {
      id:"algo8", icon:"🤖",
      role:"Data Science Intern",
      company:"Algo8.ai Pvt. Ltd.",
      location:"SIDBI Extensions, IIT Kanpur",
      period:"Jan 2020 – May 2020",
      type:"internship",
      bullets:[
        "Developed AI model for Electronic Bottle Inspection (EBI) to predict machine efficiency and detect defects.",
        "Automated defect detection using computer vision, reducing testing time and quality control costs.",
        "Performed end-to-end data collection, sampling, and image preprocessing using OpenCV."
      ]
    },
    {
      id:"ict", icon:"📚",
      role:"Machine Learning Trainee (6 Weeks)",
      company:"E&ICT Academy, IIT Kanpur",
      location:"IIT Kanpur (MeitY, Govt. of India)",
      period:"Jun – Jul 2019",
      type:"training",
      bullets:[
        "Completed intensive ML training: supervised/unsupervised learning, feature engineering, model evaluation.",
        "Python for ML, data visualisation, ensemble methods, and model deployment techniques."
      ]
    },
    {
      id:"jpm_qr", icon:"🏦",
      role:"Quantitative Research Job Simulation",
      company:"J.P. Morgan Chase & Co.",
      location:"Virtual (Forage)",
      period:"Jul – Oct 2023",
      type:"simulation",
      bullets:[
        "Investigated and analysed price data for commodity storage contracts.",
        "Performed credit risk analysis and FICO score bucketing."
      ]
    },
    {
      id:"jpm_ib", icon:"💼",
      role:"Investment Banking Virtual Experience",
      company:"J.P. Morgan",
      location:"Virtual (Forage)",
      period:"Jul 2023",
      type:"simulation",
      bullets:[
        "Identified M&A targets, conducted financial analysis, provided investment recommendations.",
        "Analysed target information, auction processes, and deal structuring."
      ]
    }
  ],
  projects: [
    {
      id:"markowitz", color:"#00f0b4",
      tag:"Portfolio Optimisation",
      title:"Markowitz MVO + Fama-French 5-Factor Analysis",
      summary:"10-stock US equity portfolio optimisation with OLS regression, Monte Carlo simulation, and out-of-sample backtesting.",
      problem:"Construct and evaluate an optimised equity portfolio that maximises risk-adjusted return while explaining factor exposures.",
      dataset:"10 US equity stocks; Fama-French 5-Factor data from Kenneth French Data Library.",
      methods:"Markowitz MVO (cvxpy), OLS regression (statsmodels), Monte Carlo 5,000+ simulations, out-of-sample backtesting.",
      results:"Identified efficient frontier, optimal Sharpe portfolio, and statistically significant factor exposures validated out-of-sample.",
      metrics:["Sharpe Ratio","Annualised Return","Portfolio Volatility","Factor Loadings","Alpha"],
      tech:["Python","cvxpy","statsmodels","NumPy","pandas","matplotlib"],
      github:"https://github.com/ajeetk095"
    },
    {
      id:"blt", color:"#7c6cf8",
      tag:"Multi-Strategy Framework",
      title:"Black-Litterman · Kelly Criterion · MVO Comparison",
      summary:"Benchmarked 3 strategies across 5,000+ Monte Carlo trials on 10-asset portfolio.",
      problem:"Which allocation strategy delivers best risk-adjusted returns under different market assumptions?",
      dataset:"10-asset multi-asset portfolio; historical returns data.",
      methods:"Black-Litterman (Bayesian), Kelly Criterion (fractional), MVO, Bootstrap resampling.",
      results:"Black-Litterman showed superior stability with well-calibrated views. Kelly: higher growth, larger drawdown.",
      metrics:["Sharpe","Sortino","Max Drawdown","CAGR","Volatility","Win Rate"],
      tech:["Python","NumPy","pandas","scipy","cvxpy","matplotlib"],
      github:"https://github.com/ajeetk095"
    },
    {
      id:"ledoit", color:"#00aaff",
      tag:"ML in Finance",
      title:"ML Portfolio Optimisation with Covariance Denoising",
      summary:"Ledoit-Wolf shrinkage on 12-asset portfolio evaluated via Sharpe, Sortino, CVaR, Calmar & Max Drawdown.",
      problem:"Sample covariance matrices have estimation error in high dimensions, causing unstable allocations.",
      dataset:"12-asset portfolio (equities + indices). In-sample and out-of-sample windows.",
      methods:"Ledoit-Wolf Shrinkage, Random Matrix Theory filtering, MVO on denoised covariance.",
      results:"Denoised covariance produced more diversified, stable portfolios with lower CVaR and improved Sharpe.",
      metrics:["Sharpe Ratio","Sortino Ratio","CVaR 95%","Calmar Ratio","Max Drawdown"],
      tech:["Python","scikit-learn","cvxpy","NumPy","pandas"],
      github:"https://github.com/ajeetk095"
    },
    {
      id:"hackathon", color:"#ffa500",
      tag:"🏆 IIT Kanpur — 1st Place",
      title:"Telecom Loan Default Prediction",
      summary:"Random Forest + PCA, recall-optimised. Won 1st place at Algo8 Hackathon, IIT Kanpur 2019.",
      problem:"Predict telecom customers likely to default on loans. Class imbalance and high dimensionality are core challenges.",
      dataset:"Telecom customer data: usage patterns, payment history, demographics, credit signals.",
      methods:"Random Forest (primary), PCA, SMOTE, threshold tuning for recall optimisation.",
      results:"Recall-optimised model reduced missed defaults significantly. Won 1st place at IIT Kanpur Hackathon.",
      metrics:["Recall","Precision","F1-Score","AUC-ROC"],
      tech:["Python","scikit-learn","pandas","NumPy","PCA","matplotlib"],
      github:"https://github.com/ajeetk095",
      award:"🏆 1st Place — Algo8 Hackathon, IIT Kanpur (Jun 2019)"
    }
  ],
  skills: {
    programming:[
      {name:"Python",level:92},{name:"SQL",level:80},{name:"C++",level:70}
    ],
    quant:[
      {name:"Markowitz MVO",level:90},{name:"Black-Litterman",level:85},
      {name:"Fama-French 5-Factor",level:88},{name:"CVaR / Monte Carlo",level:85},
      {name:"Derivatives Pricing",level:80},{name:"Kelly Criterion",level:82}
    ],
    libraries:[
      {name:"NumPy / pandas",level:92},{name:"scikit-learn",level:88},
      {name:"cvxpy",level:85},{name:"statsmodels / scipy",level:82},
      {name:"OpenCV",level:72},{name:"FastAPI",level:70}
    ],
    ml:[
      {name:"Supervised Classification",level:88},{name:"Random Forest / Ensemble",level:85},
      {name:"PCA / Dim. Reduction",level:82},{name:"Deep Learning (Finance)",level:75},
      {name:"Reinforcement Learning",level:70}
    ],
    tools:[
      {name:"MS Excel (Advanced)",level:85},{name:"MySQL / SQL",level:80},
      {name:"Tableau",level:75},{name:"Git / GitHub",level:80},
      {name:"Linux",level:72},{name:"Azure Fundamentals",level:65}
    ]
  },
  certifications: [
    {id:"sebi",issuer:"SEBI / NISM",name:"SEBI Investor Certification Examination",date:"May 31, 2024",cat:"finance",verify:""},
    {id:"jpm_qr",issuer:"J.P. Morgan · Forage",name:"Quantitative Research Job Simulation",date:"Oct 2023",cat:"finance",verify:""},
    {id:"jpm_ib",issuer:"J.P. Morgan · Forage",name:"Investment Banking Virtual Experience",date:"Jul 2023",cat:"finance",verify:""},
    {id:"cfi",issuer:"Corporate Finance Institute",name:"Risk Management and Insurance Planning",date:"Jul 20, 2023",cat:"finance",verify:"https://credentials.corporatefinanceinstitute.com/6f6eaf51-de8f-41dc-9b78-4bff5072dceb"},
    {id:"iima",issuer:"IIM Ahmedabad · Coursera",name:"Pre-MBA Statistics",date:"Sep 28, 2023",cat:"finance",verify:"https://coursera.org/verify/P3KMS9U5MAHV"},
    {id:"ncdex",issuer:"NCDEX / IIT Kanpur",name:"Commodity Derivatives Market (Webinar)",date:"Jul 10, 2020",cat:"finance",verify:""},
    {id:"ibm_ds",issuer:"IBM · Coursera",name:"What is Data Science?",date:"Feb 18, 2020",cat:"ds",verify:"https://coursera.org/verify/3GY2DDGCHWUW"},
    {id:"ibm_ai",issuer:"IBM · Coursera",name:"Introduction to Artificial Intelligence (AI)",date:"May 19, 2020",cat:"ds",verify:"https://coursera.org/verify/436XJ4ZA6NL2"},
    {id:"ict_ml",issuer:"E&ICT Academy · IIT Kanpur",name:"ICT Summer Training — Machine Learning",date:"Jul 8, 2019",cat:"ds",verify:""},
    {id:"python",issuer:"E&ICT · IIT Kanpur",name:"Python Programming – A Practical Approach",date:"Jul 10, 2019",cat:"ds",verify:""},
    {id:"umich",issuer:"University of Michigan · Coursera",name:"Programming for Everybody (Python)",date:"Jul 4, 2020",cat:"ds",verify:"https://coursera.org/verify/NE2U7FJ5LCN3"},
    {id:"bi101",issuer:"Udemy",name:"Business Intelligence & Predictive Analytics 101",date:"Jul 9, 2024",cat:"ds",verify:""},
    {id:"prompt",issuer:"Udemy",name:"ChatGPT Prompt Engineering Mastery",date:"Jul 9, 2024",cat:"ds",verify:""},
    {id:"tableau",issuer:"Udemy",name:"Tableau 2024 A-Z: Hands-On Training",date:"Jul 2, 2024",cat:"tools",verify:""},
    {id:"ccna1",issuer:"Cisco / NIIT",name:"CCNAv7: Introduction to Networks",date:"Dec 12, 2020",cat:"networking",verify:""},
    {id:"ccna2",issuer:"Cisco / NIIT",name:"CCNAv7: Switching, Routing & Wireless Essentials",date:"Mar 4, 2021",cat:"networking",verify:""},
    {id:"ccna3",issuer:"Cisco / NIIT",name:"CCNAv7: Enterprise Networking, Security & Automation",date:"Apr 23, 2021",cat:"networking",verify:""},
    {id:"cyber",issuer:"Cisco Networking Academy",name:"Introduction to Cybersecurity",date:"May 15, 2021",cat:"networking",verify:""},
    {id:"azure",issuer:"Microsoft Learn",name:"Azure Fundamentals (11 Modules)",date:"Sep 14, 2023",cat:"networking",verify:""},
    {id:"gcp",issuer:"Google Cloud · Coursera",name:"Google Cloud Fundamentals: Core Infrastructure",date:"Mar 1, 2020",cat:"networking",verify:"https://coursera.org/verify/CHJQ2ZHLRYVL"},
    {id:"excel",issuer:"Udemy · Kyle Pew",name:"Microsoft Excel – Beginner to Advanced",date:"Jun 24, 2024",cat:"tools",verify:""},
    {id:"mysql",issuer:"Udemy",name:"The Complete MySQL Bootcamp",date:"Jul 23, 2024",cat:"tools",verify:""},
    {id:"sql",issuer:"Udemy",name:"SQL – Complete Introduction to SQL Programming",date:"Jul 2, 2024",cat:"tools",verify:""},
    {id:"dbpy",issuer:"Udemy",name:"Databases with Python: MySQL, SQLite & MongoDB",date:"Jul 7, 2024",cat:"tools",verify:""},
    {id:"html5",issuer:"University of Michigan · Coursera",name:"Introduction to HTML5",date:"Oct 9, 2020",cat:"tools",verify:"https://coursera.org/verify/8SEUUVCKXLS3"},
    {id:"pm",issuer:"MTF Institute",name:"Product Management and Development",date:"Jul 12, 2024",cat:"tools",verify:""},
    {id:"hack",issuer:"Algo8 · E&ICT · IIT Kanpur",name:"🥇 1st Place — Algo8 Hackathon",date:"Jun 8–9, 2019",cat:"award",verify:""},
    {id:"scout",issuer:"Navodaya Vidyalaya Samiti",name:"🏆 Rajya Purashkar Scout Award",date:"Aug 10, 2013",cat:"award",verify:""},
    {id:"quiz",issuer:"JIMMC Navrang Media Fest",name:"🥉 3rd Place — GS Quiz Competition",date:"Feb 2015",cat:"award",verify:""},
    {id:"iaeng",issuer:"IAENG",name:"IAENG Membership (No. 265771)",date:"Jul 27, 2020",cat:"award",verify:""},
    {id:"ieee",issuer:"IEEE · IIT Kanpur",name:"IEEE Winter School on Fog/Edge Computing",date:"Dec 29–30, 2020",cat:"workshop",verify:""},
    {id:"excel3d",issuer:"IIT Kanpur · DASSRL",name:"Workshop: 3D Simplified Mathematics with Excel",date:"Jul 5–7, 2019",cat:"workshop",verify:""},
    {id:"iirs",issuer:"IIRS · ISRO",name:"Basics of Geocomputation & Geoweb Services",date:"Oct 19–29, 2020",cat:"workshop",verify:""},
    {id:"vibha",issuer:"IIT Kanpur · VIBHA",name:"Volunteer — InterState Science & Tinkering Fest",date:"Jan 25, 2020",cat:"workshop",verify:""},
    {id:"ethical",issuer:"IEMLabs",name:"Ethical Hacking Workshop",date:"Jul 19, 2020",cat:"workshop",verify:""}
  ],
  blog: [
    {id:1,title:"Understanding the Efficient Frontier: A Practical Guide",date:"2024-10-12",tag:"Portfolio Theory",summary:"A visual walkthrough of Markowitz's efficient frontier and how to implement it in Python using cvxpy.",link:"#"},
    {id:2,title:"Black-Litterman Model Explained Simply",date:"2024-11-05",tag:"Quant Finance",summary:"Breaking down Black-Litterman for non-mathematicians — what investor views mean and why it beats plain MVO.",link:"#"},
    {id:3,title:"Covariance Matrix Noise: Why Your Optimiser Is Lying",date:"2025-01-18",tag:"ML in Finance",summary:"Why sample covariance matrices are noisy and how Ledoit-Wolf shrinkage cleans them up.",link:"#"},
    {id:4,title:"Monte Carlo Simulation for Portfolio Risk",date:"2025-02-22",tag:"Risk Analytics",summary:"How to run a proper Monte Carlo simulation for a multi-asset portfolio and interpret CVaR vs VaR.",link:"#"}
  ],
  gallery: [
    {id:1,type:"drive",title:"IIT Kanpur Hackathon 1st Place Certificate",src:"https://drive.google.com/drive/folders/1A6jo4e2m03kGAExw8fJCue7abWAVPV1m?usp=sharing",cat:"awards",icon:"🏆",thumb:""},
    {id:2,type:"image",title:"Profile Photo",src:"../assets/img/ajeet_pfp1.png",cat:"photos",thumb:""},
    {id:3,type:"link",title:"All Certificates (Google Drive)",src:"https://drive.google.com/drive/folders/1A6jo4e2m03kGAExw8fJCue7abWAVPV1m?usp=sharing",cat:"awards",thumb:""},
    {id:4,type:"link",title:"Academic Documents",src:"https://drive.google.com/drive/folders/1A6jo4e2m03kGAExw8fJCue7abWAVPV1m?usp=sharing",cat:"academic",thumb:""}
  ],
  jobs: [
    {id:1,title:"Quantitative Analyst",company:"Goldman Sachs",location:"Bangalore",type:"Full-time",level:"Entry",tags:["Python","Statistics","Finance"],link:"https://careers.goldmansachs.com",match:95,reason:"Perfect match: Python, quant methods, portfolio analytics align directly."},
    {id:2,title:"Risk Analyst",company:"JP Morgan Chase",location:"Mumbai",type:"Full-time",level:"Entry",tags:["Risk","Python","Excel"],link:"https://careers.jpmorgan.com",match:92,reason:"SEBI certification, risk management coursework, and internship experience are direct fits."},
    {id:3,title:"Data Scientist – Finance",company:"Citibank",location:"Bangalore",type:"Full-time",level:"Entry",tags:["Python","ML","Data"],link:"https://jobs.citi.com",match:88,reason:"ML background, financial data courses, and scikit-learn expertise match well."},
    {id:4,title:"Financial Engineer",company:"Bloomberg L.P.",location:"Remote",type:"Full-time",level:"Entry",tags:["Python","Derivatives","Stochastic"],link:"https://bloomberg.com/careers",match:90,reason:"Derivatives pricing, stochastic modeling, and deep learning for finance courses are ideal."},
    {id:5,title:"Portfolio Analyst",company:"BlackRock",location:"Bangalore",type:"Full-time",level:"Entry",tags:["Portfolio","Python","cvxpy"],link:"https://careers.blackrock.com",match:94,reason:"Markowitz, Black-Litterman, and portfolio management coursework are a direct fit."},
    {id:6,title:"Quant Research Associate",company:"Two Sigma",location:"Bangalore",type:"Full-time",level:"Entry",tags:["Python","Stats","Research"],link:"https://twosigma.com/careers",match:89,reason:"Research-oriented projects, Fama-French analysis, and strong quant finance foundation."}
  ]
};

function loadData(key) {
  try {
    const s = localStorage.getItem('portfolio_' + key);
    return s ? JSON.parse(s) : PORTFOLIO_DATA[key];
  } catch(e) { return PORTFOLIO_DATA[key]; }
}
function saveData(key, val) {
  localStorage.setItem('portfolio_' + key, JSON.stringify(val));
}
