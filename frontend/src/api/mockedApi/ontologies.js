import { sleep } from "../index";

const languages = ["Japanese", "Chinese", "Vietnamese", "Turkish", "French", "Polish", "Spanish", "English", "Arabic", "Korean", "Hindi"];
const services = [
  "Financial planning help service", "Field trips", "Child and family service", "Aboriginal people service", "Math help service", "Legal aid service", "Social assistance service", "Language classes", "Homework club", "Emergency and crisis service", "Computer access service", "Consumer protection and complaints service", "Transportation", "Abuse and assault service", "Newcomers service", "Disability service", "Government and legal service", "Public library service", "Special interest classes", "Employment and training service", "Special events", "Human rights service", "Youth service", "Dental service", "Older adults service", "Healthcare service", "Community information service", "Support group service", "LGBTQ service", "Food service", "Mental health service", "Household help service", "Francophone service", "Income support service", "Housing service", "Interpretation and translation service", "Homelessness service", "French as a second language service"
]
const program = []  // TODO

const categories = {
  languages,
  services,
  program
}

export async function fetchOntologyCategories(category) {
  console.log('Fetch categories: ', category)
  if (!categories[category]) {
    console.error('No Category available: ', category)
    return []
  }

  return categories[category];
}
