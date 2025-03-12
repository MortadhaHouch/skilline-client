const emailRegex = {
    uppercase: /^[A-Z]/,
    lowercase: /[a-z]{5,}/,
    domain: /@(gmail|yahoo|outlook)\.com$/,
    fullMatch: /^[A-Z][a-z]{5,}[A-Z][a-z]{5,}@(gmail|yahoo|outlook)\.com$/,
};

export { emailRegex };