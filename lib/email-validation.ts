// Email validation utilities
export const validateEmail = (email: string): { isValid: boolean; type: string; message?: string } => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailRegex.test(email)) {
    return { isValid: false, type: "invalid", message: "Please enter a valid email address" }
  }

  const domain = email.split("@")[1].toLowerCase()

  // Gmail validation
  if (domain === "gmail.com") {
    return { isValid: true, type: "gmail" }
  }

  // Educational domains validation
  const educationalDomains = [
    // Common educational TLDs
    ".edu",
    ".edu.in",
    ".ac.in",
    ".edu.au",
    ".ac.uk",
    ".edu.sg",
    ".edu.my",
    ".edu.ph",
    ".edu.bd",
    ".edu.pk",
    ".edu.lk",
    ".edu.np",
    ".ac.th",
    ".edu.vn",
    ".edu.cn",
    ".edu.hk",
    ".edu.tw",
    ".edu.kr",
    ".edu.jp",
    ".ac.jp",
    ".edu.ca",
    ".edu.mx",
    ".edu.br",
    ".edu.ar",
    ".edu.co",
    ".edu.pe",
    ".edu.cl",
    ".edu.ec",
    ".edu.ve",
    ".edu.uy",
    ".edu.py",
    ".edu.bo",
    ".ac.za",
    ".edu.eg",
    ".edu.sa",
    ".edu.ae",
    ".edu.qa",
    ".edu.kw",
    ".edu.bh",
    ".edu.om",
    ".edu.jo",
    ".edu.lb",
    ".edu.sy",
    ".edu.iq",
    ".edu.ir",
    ".edu.af",
    ".edu.tr",
    ".edu.gr",
    ".edu.it",
    ".edu.es",
    ".edu.fr",
    ".edu.de",
    ".edu.nl",
    ".edu.be",
    ".edu.ch",
    ".edu.at",
    ".edu.se",
    ".edu.no",
    ".edu.dk",
    ".edu.fi",
    ".edu.is",
    ".edu.ie",
    ".edu.pt",
    ".edu.pl",
    ".edu.cz",
    ".edu.sk",
    ".edu.hu",
    ".edu.ro",
    ".edu.bg",
    ".edu.hr",
    ".edu.si",
    ".edu.rs",
    ".edu.ba",
    ".edu.mk",
    ".edu.al",
    ".edu.me",
    ".edu.ru",
    ".edu.ua",
    ".edu.by",
    ".edu.lt",
    ".edu.lv",
    ".edu.ee",
    ".edu.md",
    ".edu.ge",
    ".edu.am",
    ".edu.az",
    ".edu.kz",
    ".edu.kg",
    ".edu.tj",
    ".edu.tm",
    ".edu.uz",
    ".edu.mn",
  ]

  // Specific educational institutions
  const knownEducationalInstitutions = [
    // Indian Institutions
    "iit.ac.in",
    "iisc.ac.in",
    "nit.ac.in",
    "bits-pilani.ac.in",
    "du.ac.in",
    "jnu.ac.in",
    "bhu.ac.in",
    "amu.ac.in",
    "jadavpuruniversity.in",
    "caluniv.ac.in",
    "mu.ac.in",
    "annauniv.edu",
    "vtu.ac.in",
    "osmania.ac.in",
    "uohyd.ac.in",
    "iitb.ac.in",
    "iitd.ac.in",
    "iitk.ac.in",
    "iitm.ac.in",
    "iitkgp.ac.in",
    "iitg.ac.in",

    // US Institutions
    "harvard.edu",
    "mit.edu",
    "stanford.edu",
    "berkeley.edu",
    "caltech.edu",
    "princeton.edu",
    "yale.edu",
    "columbia.edu",
    "uchicago.edu",
    "upenn.edu",
    "cornell.edu",
    "dartmouth.edu",
    "brown.edu",
    "duke.edu",
    "northwestern.edu",
    "vanderbilt.edu",
    "rice.edu",
    "emory.edu",
    "georgetown.edu",
    "carnegiemellon.edu",
    "gatech.edu",
    "usc.edu",
    "ucla.edu",
    "ucsd.edu",
    "ucsb.edu",
    "uci.edu",
    "ucr.edu",
    "ucsc.edu",
    "ucdavis.edu",
    "ucmerced.edu",

    // UK Institutions
    "ox.ac.uk",
    "cam.ac.uk",
    "imperial.ac.uk",
    "ucl.ac.uk",
    "kcl.ac.uk",
    "lse.ac.uk",
    "ed.ac.uk",
    "manchester.ac.uk",
    "bristol.ac.uk",
    "warwick.ac.uk",

    // Canadian Institutions
    "utoronto.ca",
    "ubc.ca",
    "mcgill.ca",
    "uwaterloo.ca",
    "queensu.ca",
    "ualberta.ca",
    "sfu.ca",
    "yorku.ca",
    "concordia.ca",
    "carleton.ca",

    // Australian Institutions
    "anu.edu.au",
    "sydney.edu.au",
    "unsw.edu.au",
    "unimelb.edu.au",
    "monash.edu",
    "uq.edu.au",
    "adelaide.edu.au",
    "uwa.edu.au",
    "uts.edu.au",
    "rmit.edu.au",

    // European Institutions
    "ethz.ch",
    "epfl.ch",
    "unige.ch",
    "uzh.ch",
    "unibas.ch",
    "tum.de",
    "lmu.de",
    "uni-heidelberg.de",
    "hu-berlin.de",
    "fu-berlin.de",
    "sorbonne-universite.fr",
    "ens.fr",
    "polytechnique.edu",
    "sciences-po.fr",
    "uva.nl",
    "vu.nl",
    "tudelft.nl",
    "eur.nl",
    "rug.nl",

    // Asian Institutions
    "nus.edu.sg",
    "ntu.edu.sg",
    "smu.edu.sg",
    "sutd.edu.sg",
    "hku.hk",
    "cuhk.edu.hk",
    "ust.hk",
    "cityu.edu.hk",
    "polyu.edu.hk",
    "ntu.edu.tw",
    "ncu.edu.tw",
    "nctu.edu.tw",
    "nthu.edu.tw",
    "u-tokyo.ac.jp",
    "kyoto-u.ac.jp",
    "osaka-u.ac.jp",
    "tohoku.ac.jp",
    "snu.ac.kr",
    "yonsei.ac.kr",
    "korea.ac.kr",
    "kaist.ac.kr",
    "postech.ac.kr",
    "tsinghua.edu.cn",
    "pku.edu.cn",
    "sjtu.edu.cn",
    "zju.edu.cn",
    "fudan.edu.cn",
  ]

  // Check if domain ends with educational TLD
  const isEducationalTLD = educationalDomains.some((eduDomain) => domain.endsWith(eduDomain))

  // Check if domain is a known educational institution
  const isKnownEducational = knownEducationalInstitutions.includes(domain)

  if (isEducationalTLD || isKnownEducational) {
    return { isValid: true, type: "educational" }
  }

  return {
    isValid: false,
    type: "restricted",
    message:
      "Only Gmail and educational institution emails are allowed. Please use your Gmail account or institutional email.",
  }
}

export const getEmailTypeDisplay = (type: string): string => {
  switch (type) {
    case "gmail":
      return "Gmail Account"
    case "educational":
      return "Educational Institution"
    default:
      return "Email Account"
  }
}
