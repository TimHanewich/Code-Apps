export interface WantedPerson {
  uid: string;
  title: string;
  description: string | null;
  details: string | null;
  caution: string | null;
  warning_message: string | null;
  reward_text: string | null;
  reward_min: number;
  reward_max: number;
  subjects: string[] | null;
  aliases: string[] | null;
  sex: string | null;
  race: string | null;
  race_raw: string | null;
  hair: string | null;
  eyes: string | null;
  weight: string | null;
  height_min: number | null;
  height_max: number | null;
  age_range: string | null;
  age_min: number | null;
  age_max: number | null;
  build: string | null;
  complexion: string | null;
  scars_and_marks: string | null;
  nationality: string | null;
  place_of_birth: string | null;
  occupations: string[] | null;
  dates_of_birth_used: string[] | null;
  field_offices: string[] | null;
  languages: string[] | null;
  status: string | null;
  person_classification: string | null;
  poster_classification: string | null;
  url: string;
  path: string;
  images: WantedImage[];
  files: WantedFile[];
  remarks: string | null;
  additional_information: string | null;
  publication: string;
  modified: string;
}

export interface WantedImage {
  original: string;
  thumb: string;
  large: string;
  caption: string | null;
}

export interface WantedFile {
  name: string;
  url: string;
}

export interface WantedApiResponse {
  total: number;
  items: WantedPerson[];
  page: number;
}
