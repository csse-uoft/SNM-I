const hostname = window && window.location && window.location.hostname;

let serverHost;
if (hostname === 'jias.snmi.ca') {
  // serverHost = 'https://3.97.37.175:8000';
  // Obsolete
  serverHost = 'https://jias-server.snmi.ca';
}
else {
  serverHost = 'http://127.0.0.1:8000';
  // serverHost = 'https://3.97.37.175:8000';
  // serverHost = 'https://jias-server.snmi.ca';
}


const ACTION_SUCCESS = 'ACTION_SUCCESS';
const ACTION_ERROR = 'ACTION_ERROR';

const torontoCoordinates = { lat: 43.6497, lng: -79.3763 };

const countryOptions = ['Afghanistan', 'Åland Islands', 'Albania', 'Algeria', 'American Samoa', 'Andorra',
  'Angola', 'Anguilla', 'Antarctica', 'Antigua & Barbuda', 'Argentina', 'Armenia', 'Aruba', 'Ascension Island',
  'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium',
  'Belize', 'Benin', 'Bermuda', 'Bhutan', 'Bolivia', 'Bosnia & Herzegovina', 'Botswana', 'Brazil',
  'British Indian Ocean Territory', 'British Virgin Islands', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi',
  'Cambodia', 'Cameroon', 'Canada', 'Canary Islands', 'Cape Verde', 'Caribbean Netherlands', 'Cayman Islands',
  'Central African Republic', 'Ceuta & Melilla', 'Chad', 'Chile', 'China', 'Christmas Island', 'Cocos (Keeling) Islands',
  'Colombia', 'Comoros', 'Congo - Brazzaville', 'Congo - Kinshasa', 'Cook Islands', 'Costa Rica', 'Côte d’Ivoire',
  'Croatia', 'Cuba', 'Curaçao', 'Cyprus', 'Czechia', 'Denmark', 'Diego Garcia', 'Djibouti', 'Dominica',
  'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini',
  'Ethiopia', 'Falkland Islands', 'Faroe Islands', 'Fiji', 'Finland', 'France', 'French Guiana', 'French Polynesia',
  'French Southern Territories', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Gibraltar', 'Greece', 'Greenland',
  'Grenada', 'Guadeloupe', 'Guam', 'Guatemala', 'Guernsey', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras',
  'Hong Kong SAR China', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Isle of Man', 'Israel',
  'Italy', 'Jamaica', 'Japan', 'Jersey', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kosovo', 'Kuwait', 'Kyrgyzstan',
  'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg',
  'Macao SAR China', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Martinique',
  'Mauritania', 'Mauritius', 'Mayotte', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro',
  'Montserrat', 'Morocco', 'Mozambique', 'Myanmar (Burma)', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Caledonia',
  'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Niue', 'Norfolk Island', 'North Korea', 'North Macedonia',
  'Northern Mariana Islands', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Palestinian Territories', 'Panama',
  'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Pitcairn Islands', 'Poland', 'Portugal', 'Pseudo-Accents',
  'Pseudo-Bidi', 'Puerto Rico', 'Qatar', 'Réunion', 'Romania', 'Russia', 'Rwanda', 'Samoa', 'San Marino',
  'São Tomé & Príncipe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Sint Maarten',
  'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Georgia & South Sandwich Islands',
  'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'St. Barthélemy', 'St. Helena', 'St. Kitts & Nevis', 'St. Lucia',
  'St. Martin', 'St. Pierre & Miquelon', 'St. Vincent & Grenadines', 'Sudan', 'Suriname', 'Svalbard & Jan Mayen', 'Sweden',
  'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tokelau', 'Tonga',
  'Trinidad & Tobago', 'Tristan da Cunha', 'Tunisia', 'Turkey', 'Turkmenistan', 'Turks & Caicos Islands', 'Tuvalu',
  'U.S. Outlying Islands', 'U.S. Virgin Islands', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom',
  'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Wallis & Futuna',
  'Western Sahara', 'Yemen', 'Zambia', 'Zimbabwe']

const languageOptions = ['Abkhazian (ab)', 'Achinese (ace)', 'Acoli (ach)', 'Adangme (ada)', 'Adyghe (ady)',
  'Afar (aa)', 'Afrihili (afh)', 'Afrikaans (af)', 'Aghem (agq)', 'Ainu (ain)', 'Akan (ak)', 'Akkadian (akk)',
  'Akoose (bss)', 'Alabama (akz)', 'Albanian (sq)', 'Aleut (ale)', 'Algerian Arabic (arq)', 'American English (en_US)',
  'American Sign Language (ase)', 'Amharic (am)', 'Ancient Egyptian (egy)', 'Ancient Greek (grc)', 'Angika (anp)',
  'Ao Naga (njo)', 'Arabic (ar)', 'Aragonese (an)', 'Aramaic (arc)', 'Araona (aro)', 'Arapaho (arp)', 'Arawak (arw)',
  'Armenian (hy)', 'Aromanian (rup)', 'Arpitan (frp)', 'Assamese (as)', 'Asturian (ast)', 'Asu (asa)', 'Atsam (cch)',
  'Australian English (en_AU)', 'Austrian German (de_AT)', 'Avaric (av)', 'Avestan (ae)', 'Awadhi (awa)', 'Aymara (ay)',
  'Azerbaijani (az)', 'Badaga (bfq)', 'Bafia (ksf)', 'Bafut (bfd)', 'Bakhtiari (bqi)', 'Balinese (ban)', 'Baluchi (bal)',
  'Bambara (bm)', 'Bamun (bax)', 'Banjar (bjn)', 'Basaa (bas)', 'Bashkir (ba)', 'Basque (eu)', 'Batak Toba (bbc)',
  'Bavarian (bar)', 'Beja (bej)', 'Belarusian (be)', 'Bemba (bem)', 'Bena (bez)', 'Bengali (bn)', 'Betawi (bew)',
  'Bhojpuri (bho)', 'Bikol (bik)', 'Bini (bin)', 'Bishnupriya (bpy)', 'Bislama (bi)', 'Blin (byn)', 'Blissymbols (zbl)',
  'Bodo (brx)', 'Bosnian (bs)', 'Brahui (brh)', 'Braj (bra)', 'Brazilian Portuguese (pt_BR)', 'Breton (br)', 
  'British English (en_GB)', 'Buginese (bug)', 'Bulgarian (bg)', 'Bulu (bum)', 'Buriat (bua)', 'Burmese (my)',
  'Caddo (cad)', 'Cajun French (frc)', 'Canadian English (en_CA)', 'Canadian French (fr_CA)', 'Cantonese (yue)',
  'Capiznon (cps)', 'Carib (car)', 'Catalan (ca)', 'Cayuga (cay)', 'Cebuano (ceb)', 'Central Atlas Tamazight (tzm)',
  'Central Dusun (dtp)', 'Central Kurdish (ckb)', 'Central Yupik (esu)', 'Chadian Arabic (shu)', 'Chagatai (chg)',
  'Chamorro (ch)', 'Chechen (ce)', 'Cherokee (chr)', 'Cheyenne (chy)', 'Chibcha (chb)', 'Chiga (cgg)',
  'Chimborazo Highland Quichua (qug)', 'Chinese (zh)', 'Chinook Jargon (chn)', 'Chipewyan (chp)', 'Choctaw (cho)',
  'Church Slavic (cu)', 'Chuukese (chk)', 'Chuvash (cv)', 'Classical Newari (nwc)', 'Classical Syriac (syc)',
  'Colognian (ksh)', 'Comorian (swb)', 'Congo Swahili (swc)', 'Coptic (cop)', 'Cornish (kw)', 'Corsican (co)',
  'Cree (cr)', 'Creek (mus)', 'Crimean Turkish (crh)', 'Croatian (hr)', 'Czech (cs)', 'Dakota (dak)', 'Danish (da)',
  'Dargwa (dar)', 'Dazaga (dzg)', 'Delaware (del)', 'Dinka (din)', 'Divehi (dv)', 'Dogri (doi)', 'Dogrib (dgr)',
  'Duala (dua)', 'Dutch (nl)', 'Dyula (dyu)', 'Dzongkha (dz)', 'Eastern Frisian (frs)', 'Efik (efi)',
  'Egyptian Arabic (arz)', 'Ekajuk (eka)', 'Elamite (elx)', 'Embu (ebu)', 'Emilian (egl)', 'English (en)',
  'Erzya (myv)', 'Esperanto (eo)', 'Estonian (et)', 'European Portuguese (pt_PT)', 'European Spanish (es_ES)',
  'Ewe (ee)', 'Ewondo (ewo)', 'Extremaduran (ext)', 'Fang (fan)', 'Fanti (fat)', 'Faroese (fo)', 'Fiji Hindi (hif)',
  'Fijian (fj)', 'Filipino (fil)', 'Finnish (fi)', 'Flemish (nl_BE)', 'Fon (fon)', 'Frafra (gur)', 'French (fr)',
  'Friulian (fur)', 'Fulah (ff)', 'Ga (gaa)', 'Gagauz (gag)', 'Galician (gl)', 'Gan Chinese (gan)', 'Ganda (lg)',
  'Gayo (gay)', 'Gbaya (gba)', 'Geez (gez)', 'Georgian (ka)', 'German (de)', 'Gheg Albanian (aln)', 'Ghomala (bbj)',
  'Gilaki (glk)', 'Gilbertese (gil)', 'Goan Konkani (gom)', 'Gondi (gon)', 'Gorontalo (gor)', 'Gothic (got)',
  'Grebo (grb)', 'Greek (el)', 'Guarani (gn)', 'Gujarati (gu)', 'Gusii (guz)', 'Gwichʼin (gwi)', 'Haida (hai)',
  'Haitian (ht)', 'Hakka Chinese (hak)', 'Hausa (ha)', 'Hawaiian (haw)', 'Hebrew (he)', 'Herero (hz)',
  'Hiligaynon (hil)', 'Hindi (hi)', 'Hiri Motu (ho)', 'Hittite (hit)', 'Hmong (hmn)', 'Hungarian (hu)',
  'Hupa (hup)', 'Iban (iba)', 'Ibibio (ibb)', 'Icelandic (is)', 'Ido (io)', 'Igbo (ig)', 'Iloko (ilo)',
  'Inari Sami (smn)', 'Indonesian (id)', 'Ingrian (izh)', 'Ingush (inh)', 'Interlingua (ia)', 
  'Interlingue (ie)', 'Inuktitut (iu)', 'Inupiaq (ik)', 'Irish (ga)', 'Italian (it)', 'Jamaican Creole English (jam)',
  'Japanese (ja)', 'Javanese (jv)', 'Jju (kaj)', 'Jola-Fonyi (dyo)', 'Judeo-Arabic (jrb)', 'Judeo-Persian (jpr)',
  'Jutish (jut)', 'Kabardian (kbd)', 'Kabuverdianu (kea)', 'Kabyle (kab)', 'Kachin (kac)', 'Kaingang (kgp)', 'Kako (kkj)',
  'Kalaallisut (kl)', 'Kalenjin (kln)', 'Kalmyk (xal)', 'Kamba (kam)', 'Kanembu (kbl)', 'Kannada (kn)',
  'Kanuri (kr)', 'Kara-Kalpak (kaa)', 'Karachay-Balkar (krc)', 'Karelian (krl)', 'Kashmiri (ks)', 'Kashubian (csb)',
  'Kawi (kaw)', 'Kazakh (kk)', 'Kenyang (ken)', 'Khasi (kha)', 'Khmer (km)', 'Khotanese (kho)', 'Khowar (khw)',
  'Kikuyu (ki)', 'Kimbundu (kmb)', 'Kinaray-a (krj)', 'Kinyarwanda (rw)', 'Kirmanjki (kiu)', 'Klingon (tlh)',
  'Kom (bkm)', 'Komi (kv)', 'Komi-Permyak (koi)', 'Kongo (kg)', 'Konkani (kok)', 'Korean (ko)', 'Koro (kfo)',
  'Kosraean (kos)', 'Kotava (avk)', 'Koyra Chiini (khq)', 'Koyraboro Senni (ses)', 'Kpelle (kpe)', 'Krio (kri)',
  'Kuanyama (kj)', 'Kumyk (kum)', 'Kurdish (ku)', 'Kurukh (kru)', 'Kutenai (kut)', 'Kwasio (nmg)', 'Kyrgyz (ky)',
  'Kʼicheʼ (quc)', 'Ladino (lad)', 'Lahnda (lah)', 'Lakota (lkt)', 'Lamba (lam)', 'Langi (lag)', 'Lao (lo)',
  'Latgalian (ltg)', 'Latin (la)', 'Latin American Spanish (es_419)', 'Latvian (lv)', 'Laz (lzz)', 'Lezghian (lez)',
  'Ligurian (lij)', 'Limburgish (li)', 'Lingala (ln)', 'Lingua Franca Nova (lfn)', 'Literary Chinese (lzh)',
  'Lithuanian (lt)', 'Livonian (liv)', 'Lojban (jbo)', 'Lombard (lmo)', 'Low German (nds)', 'Lower Silesian (sli)',
  'Lower Sorbian (dsb)', 'Lozi (loz)', 'Luba-Katanga (lu)', 'Luba-Lulua (lua)', 'Luiseno (lui)', 'Lule Sami (smj)',
  'Lunda (lun)', 'Luo (luo)', 'Luxembourgish (lb)', 'Luyia (luy)', 'Maba (mde)', 'Macedonian (mk)', 'Machame (jmc)',
  'Madurese (mad)', 'Mafa (maf)', 'Magahi (mag)', 'Main-Franconian (vmf)', 'Maithili (mai)', 'Makasar (mak)',
  'Makhuwa-Meetto (mgh)', 'Makonde (kde)', 'Malagasy (mg)', 'Malay (ms)', 'Malayalam (ml)', 'Maltese (mt)', 'Manchu (mnc)',
  'Mandar (mdr)', 'Mandingo (man)', 'Manipuri (mni)', 'Manx (gv)', 'Maori (mi)', 'Mapuche (arn)', 'Marathi (mr)',
  'Mari (chm)', 'Marshallese (mh)', 'Marwari (mwr)', 'Masai (mas)', 'Mazanderani (mzn)', 'Medumba (byv)', 'Mende (men)',
  'Mentawai (mwv)', 'Meru (mer)', 'Metaʼ (mgo)', 'Mexican Spanish (es_MX)', 'Micmac (mic)', 'Middle Dutch (dum)',
  'Middle English (enm)', 'Middle French (frm)', 'Middle High German (gmh)', 'Middle Irish (mga)', 'Min Nan Chinese (nan)',
  'Minangkabau (min)', 'Mingrelian (xmf)', 'Mirandese (mwl)', 'Mizo (lus)', 'Modern Standard Arabic (ar_001)',
  'Mohawk (moh)', 'Moksha (mdf)', 'Moldavian (ro_MD)', 'Mongo (lol)', 'Mongolian (mn)', 'Morisyen (mfe)',
  'Moroccan Arabic (ary)', 'Mossi (mos)', 'Multiple Languages (mul)', 'Mundang (mua)', 'Muslim Tat (ttt)', 'Myene (mye)',
  'Nama (naq)', 'Nauru (na)', 'Navajo (nv)', 'Ndonga (ng)', 'Neapolitan (nap)', 'Nepali (ne)', 'Newari (new)',
  'Ngambay (sba)', 'Ngiemboon (nnh)', 'Ngomba (jgo)', 'Nheengatu (yrl)', 'Nias (nia)', 'Niuean (niu)',
  'No linguistic content (zxx)', 'Nogai (nog)', 'North Ndebele (nd)', 'Northern Frisian (frr)', 'Northern Sami (se)',
  'Northern Sotho (nso)', 'Norwegian (no)', 'Norwegian Bokmål (nb)', 'Norwegian Nynorsk (nn)', 'Novial (nov)',
  'Nuer (nus)', 'Nyamwezi (nym)', 'Nyanja (ny)', 'Nyankole (nyn)', 'Nyasa Tonga (tog)', 'Nyoro (nyo)', 'Nzima (nzi)',
  'NʼKo (nqo)', 'Occitan (oc)', 'Ojibwa (oj)', 'Old English (ang)', 'Old French (fro)', 'Old High German (goh)',
  'Old Irish (sga)', 'Old Norse (non)', 'Old Persian (peo)', 'Old Provençal (pro)', 'Oriya (or)', 'Oromo (om)',
  'Osage (osa)', 'Ossetic (os)', 'Ottoman Turkish (ota)', 'Pahlavi (pal)', 'Palatine German (pfl)', 'Palauan (pau)',
  'Pali (pi)', 'Pampanga (pam)', 'Pangasinan (pag)', 'Papiamento (pap)', 'Pashto (ps)', 'Pennsylvania German (pdc)',
  'Persian (fa)', 'Phoenician (phn)', 'Picard (pcd)', 'Piedmontese (pms)', 'Plautdietsch (pdt)', 'Pohnpeian (pon)',
  'Polish (pl)', 'Pontic (pnt)', 'Portuguese (pt)', 'Prussian (prg)', 'Punjabi (pa)', 'Quechua (qu)', 'Rajasthani (raj)',
  'Rapanui (rap)', 'Rarotongan (rar)', 'Riffian (rif)', 'Romagnol (rgn)', 'Romanian (ro)', 'Romansh (rm)', 'Romany (rom)',
  'Rombo (rof)', 'Root (root)', 'Rotuman (rtm)', 'Roviana (rug)', 'Rundi (rn)', 'Russian (ru)', 'Rusyn (rue)', 'Rwa (rwk)',
  'Saho (ssy)', 'Sakha (sah)', 'Samaritan Aramaic (sam)', 'Samburu (saq)', 'Samoan (sm)', 'Samogitian (sgs)',
  'Sandawe (sad)', 'Sango (sg)', 'Sangu (sbp)', 'Sanskrit (sa)', 'Santali (sat)', 'Sardinian (sc)', 'Sasak (sas)',
  'Sassarese Sardinian (sdc)', 'Saterland Frisian (stq)', 'Saurashtra (saz)', 'Scots (sco)', 'Scottish Gaelic (gd)',
  'Selayar (sly)', 'Selkup (sel)', 'Sena (seh)', 'Seneca (see)', 'Serbian (sr)', 'Serbo-Croatian (sh)', 'Serer (srr)',
  'Seri (sei)', 'Shambala (ksb)', 'Shan (shn)', 'Shona (sn)', 'Sichuan Yi (ii)', 'Sicilian (scn)', 'Sidamo (sid)',
  'Siksika (bla)', 'Silesian (szl)', 'Simplified Chinese (zh_Hans)', 'Sindhi (sd)', 'Sinhala (si)', 'Skolt Sami (sms)',
  'Slave (den)', 'Slovak (sk)', 'Slovenian (sl)', 'Soga (xog)', 'Sogdien (sog)', 'Somali (so)', 'Soninke (snk)',
  'South Azerbaijani (azb)', 'South Ndebele (nr)', 'Southern Altai (alt)', 'Southern Sami (sma)', 'Southern Sotho (st)',
  'Spanish (es)', 'Sranan Tongo (srn)', 'Standard Moroccan Tamazight (zgh)', 'Sukuma (suk)', 'Sumerian (sux)',
  'Sundanese (su)', 'Susu (sus)', 'Swahili (sw)', 'Swati (ss)', 'Swedish (sv)', 'Swiss French (fr_CH)', 'Swiss German (gsw)',
  'Swiss High German (de_CH)', 'Syriac (syr)', 'Tachelhit (shi)', 'Tagalog (tl)', 'Tahitian (ty)', 'Taita (dav)',
  'Tajik (tg)', 'Talysh (tly)', 'Tamashek (tmh)', 'Tamil (ta)', 'Taroko (trv)', 'Tasawaq (twq)', 'Tatar (tt)', 
  'Telugu (te)', 'Tereno (ter)', 'Teso (teo)', 'Tetum (tet)', 'Thai (th)', 'Tibetan (bo)', 'Tigre (tig)', 'Tigrinya (ti)',
  'Timne (tem)', 'Tiv (tiv)', 'Tlingit (tli)', 'Tok Pisin (tpi)', 'Tokelau (tkl)', 'Tongan (to)', 'Tornedalen Finnish (fit)',
  'Traditional Chinese (zh_Hant)', 'Tsakhur (tkr)', 'Tsakonian (tsd)', 'Tsimshian (tsi)', 'Tsonga (ts)', 'Tswana (tn)',
  'Tulu (tcy)', 'Tumbuka (tum)', 'Tunisian Arabic (aeb)', 'Turkish (tr)', 'Turkmen (tk)', 'Turoyo (tru)', 'Tuvalu (tvl)',
  'Tuvinian (tyv)', 'Twi (tw)', 'Tyap (kcg)', 'Udmurt (udm)', 'Ugaritic (uga)', 'Ukrainian (uk)', 'Umbundu (umb)',
  'Unknown Language (und)', 'Upper Sorbian (hsb)', 'Urdu (ur)', 'Uyghur (ug)', 'Uzbek (uz)', 'Vai (vai)', 'Venda (ve)',
  'Venetian (vec)', 'Veps (vep)', 'Vietnamese (vi)', 'Volapük (vo)', 'Võro (vro)', 'Votic (vot)', 'Vunjo (vun)',
  'Walloon (wa)', 'Walser (wae)', 'Waray (war)', 'Warlpiri (wbp)', 'Washo (was)', 'Wayuu (guc)', 'Welsh (cy)',
  'West Flemish (vls)', 'Western Frisian (fy)', 'Western Mari (mrj)', 'Wolaytta (wal)', 'Wolof (wo)', 'Wu Chinese (wuu)',
  'Xhosa (xh)', 'Xiang Chinese (hsn)', 'Yangben (yav)', 'Yao (yao)', 'Yapese (yap)', 'Yemba (ybb)', 'Yiddish (yi)',
  'Yoruba (yo)', 'Zapotec (zap)', 'Zarma (dje)', 'Zaza (zza)', 'Zeelandic (zea)', 'Zenaga (zen)', 'Zhuang (za)', 
  'Zoroastrian Dari (gbz)', 'Zulu (zu)', 'Zuni (zun)']

const genderOptions = [
  'Female',
  'Male',
  'Other'
]

const maritalStatusOptions = [
  'Common Law',
  'Divorced',
  'Married',
  'Other',
  'Separated',
  'Single',
  'Widowed'
]

const statusInCanadaOptions = [
  'Application in Process - Family',
  'Application in Process - Humanitarian and Compassionate',
  'Application in Process - Independent',
  'Application in Process - Refugee',
  'Canadian Citizen',
  'Immigrant',
  'Other',
  'Permanent Resident - Business Class',
  'Permanent Resident - Canadian Experience Class',
  'Permanent Resident - Family Class',
  'Permanent Resident -  Humanitarian and Compassionate',
  'Permanent Resident - Live-in Caregiver',
  'Permanent Resident - Provincial Nominee',
  'Permanent Resident - Refugees',
  'Permanent Resident - Skilled Worker and Skilled Trades',
  'Temporary Resident',
  'Visitors Visa',
  'Work Permit'
]

const educationLevelOptions = [
  'College',
  'Elementary',
  'Post Graduate',
  'Secondary',
  'University'
]

const incomeSourceOptions = [
 'Crowd Ward',
 'Dependent of OW/ODSP',
 'Employment',
 'Employment Insurance',
 'Family Members Income',
 'None',
 'Ontario Disability Support Program',
 'Ontario Works',
 'Other',
 'Pension',
 'Unknown',
 'Workers Safety and Insurance'
]

const matchStatusOptions = [
  'Contacted',
  'Matched',
  'Referred',
  'Selected'
]

const familyRelationshipOptions = [
  'Child',
  'Parent',
  'Sibling',
  'Spouse'
]

const needStatusOptions = [
  'Fulfilled',
  'In Progress',
  'Matched',
  'Pending',
  'Unmatched'
]

const serviceTypeOptions = [
  'External',
  'Internal',
  'Professional/Community',
  'Volunteer based'
]

const serviceSharedWithOptions = [
  "Children's Aid Society of Toronto",
  "Durham Children's Aid Society",
  "Eva's Initiatives",
  'Abrigo Centre',
  'Adventist community services',
  'AIDS Committee of Durham Region',
  'Albion Neighbourhood Services',
  'Alexandra Park Community Centre',
  'Applegrove Community Complex',
  'Arab Community Centre of Toronto',
  'Aurora Food Pantry',
  'Barbra Schlifer Commemorative Clinic',
  'Bluffs Food Bank',
  'Boost Child & Youth Advocacy Centre',
  'Brock Community Food Bank',
  'Central Toronto Youth Services',
  'Covenant House Toronto',
  'Durham Rape Crisis Centre',
  'Durham Youth Housing and Support Services',
  'Horizons for Youth',
  'Kababayan Multicultural Centre',
  'Markham Food Bank',
  'Parkdale Community Food Bank',
  'Pediatric Oncology Group of Ontario',
  'Private',
  'Public'
]

const provinceOptions = [
  'Alberta',
  'British Columbia',
  'Manitoba',
  'New Brunswick',
  'Newfoundland and Labrador',
  'Nova Scotia',
  'Ontario',
  'Prince Edward Island',
  'Quebec',
  'Saskatchewan'
]

module.exports = Object.freeze({
  serverHost: serverHost,
  torontoCoordinates: torontoCoordinates,
  countryOptions: countryOptions,
  languageOptions: languageOptions,
  genderOptions: genderOptions,
  maritalStatusOptions: maritalStatusOptions,
  statusInCanadaOptions: statusInCanadaOptions,
  educationLevelOptions: educationLevelOptions,
  incomeSourceOptions: incomeSourceOptions,
  matchStatusOptions: matchStatusOptions,
  familyRelationshipOptions: familyRelationshipOptions,
  needStatusOptions: needStatusOptions,
  serviceTypeOptions: serviceTypeOptions,
  serviceSharedWithOptions: serviceSharedWithOptions,
  provinceOptions: provinceOptions,
  ACTION_SUCCESS: ACTION_SUCCESS,
  ACTION_ERROR: ACTION_ERROR
});
