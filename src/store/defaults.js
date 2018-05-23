export const serverHost = 'https://snm-impact-server.herokuapp.com';

const languageMap = [ 
  {value: "AR", label: "Arabic"},
  {value: "EN", label: "English"},
  {value: "FR", label: "French"},
  {value: "GK", label: "Greek"},
  {value: "IT", label: "Italian"},
  {value: "RU", label: "Russian"},
  {value: "SP", label: "Spanish"},
  {value: "HI", label: "Hindi"}
]

const resourceTypeMap = [
  {value: "interpreter", label: "Interpreter"},
  {value: "translator", label: "Translator"},
  {value: "dentist", label: "Dentist"},
  {value: "employment_mentor", label: "Employment Mentor"},
  {value: "doctor", label: "Doctor"},
  {value: "education", label: "Education"},
  {value: "familylife", label: "Family Life"},
  {value: "financial", label: "Financial"},
  {value: "housing", label: "Housing"},
  {value: "legal", label: "Legal"},
  {value: "mentalhealth", label: "Mental Health"},
  {value: "transportation", label: "Transportation"}

]

const goodsTypeMap = [
  {value: "household", label: "Household"},
  {value: "babychild", label: "Baby/Child"},
  {value: "clothing", label: "Clothing"},
  {value: "electronicsappliances", label: "Electronics and Appliances"},
]

const conditionTypeMap = [
  {value: "poor", label: "Poor"},
  {value: "fair", label: "Fair"},
  {value: "good", label: "Good"},
  {value: "verygood", label: "Very Good"},
]

const professionTypeMap = [
  {value: "accounting", label: "Accounting"},
  {value: "architecture", label: "Architecture"},
  {value: "construction", label: "Construction"},
  {value: "electrical", label: "Electrical Engineering"},
  {value: "finance", label: "Finance"},
  {value: "food_preperation", label: "Food Preperation"},
  {value: "hr", label: "Human Resources"},
  {value: "it", label: "Information Technology"},
  {value: "nursing", label: "Nursing"},
  {value: "nutrition", label: "Nutritional Science"},
  {value: "psych", label: "Psychology / Psychiatry"},
  {value: "software_eng", label: "Software Engineering"},
  {value: "social_work", label: "Social Work"}

]

const doctorTypeMap = [
  {value: "physician", label: "Physician"},
  {value: "physiotherapist", label: "Physiotherapist"},
  {value: "pediatrician", label: "Pediatrician"},
  {value: "dermatologist", label: "Dermatologist"},
  {value: "optometrist", label: "Optometrist"}
  
]  

const financialTypeMap = [
  {value: "accounting", label: "Accounting"},
  {value: "income tax", label: "Income Tax"},
  {value: "insurance", label: "Insurance"},
  {value: "debt management", label: "Debt Management"},
  {value: "credit counseling", label: "Credit Counseling"},
  {value: "retirement", label: "Retirement"},
  {value: "budgeting", label: "Budgeting"}
  
]  

const legalTypeMap = [
  {value: "immigration", label: "Immigration"},
  {value: "citizenship", label: "Citizenship"},
  {value: "landlord and tenant", label: "Landlord and Tenant"},
  {value: "social assistance and welfare", label: "Social Assistance and Welfare"},
  {value: "disability", label: "Disability"},
  {value: "employment", label: "Employment"},
  {value: "pension", label: "Pension"},
  {value: "representation", label: "Representation"},
  {value: "documentation", label: "Documentation"}
  
]

const housingTypeMap = [
  {value: "long-term care", label: "Long-term Care"},
  {value: "homeless", label: "Homeless"},
  {value: "low income housing", label: "Low Income Housing"}
  
]

const mentalhealthTypeMap = [
  {value: "psychiatry", label: "Psychiatry"},
  {value: "psychology", label: "Psychology"},
  {value: "substance abuse counseling", label: "Substance Abuse Counseling"},
  {value: "support groups", label: "Support Groups"},
  {value: "addiction", label: "Addiction"},
  {value: "withdrawal management", label: "Withdrawal Management"}
   
]

const familylifeTypeMap = [
  {value: "pregnancy and infant care", label: "Pregnancy and Infant Care"},
  {value: "family planning", label: "Family Planning"},
  {value: "sexual health", label: "Sexual Health"},
  {value: "immunization and screening", label: "Immunization and Screening"},
  {value: "lgbtq", label: "LGBTQ"},
  {value: "social work", label: "Social Work"},
  {value: "parenting and family counseling", label: "Parenting and Family Counseling"},
  {value: "domestic violence", label: "Domestic Violence"}
   
]

const educationTypeMap = [
  {value: "english as a second language", label: "English as a Second Language"},
  {value: "finance", label: "Finance"},
  {value: "literacy and essential skills", label: "Literacy and Essential Skills"},
  {value: "day care", label: "Day Care"}
  
]



export const defaults = {
  languageMap: languageMap,
  resourceTypeMap: resourceTypeMap,
  goodsTypeMap: goodsTypeMap,
  conditionTypeMap: conditionTypeMap,
  professionTypeMap: professionTypeMap,
  doctorTypeMap: doctorTypeMap,
  financialTypeMap: financialTypeMap,
  legalTypeMap: legalTypeMap,
  housingTypeMap: housingTypeMap,
  mentalhealthTypeMap: mentalhealthTypeMap,
  familylifeTypeMap: familylifeTypeMap,
  educationTypeMap: educationTypeMap

}