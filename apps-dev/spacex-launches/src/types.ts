export interface Launch {
  id: string;
  name: string;
  flight_number: number;
  date_utc: string;
  date_unix: number;
  date_local: string;
  date_precision: "hour" | "day" | "month" | "quarter" | "half" | "year";
  upcoming: boolean;
  rocket: string;
  launchpad: string;
  success: boolean | null;
  details: string | null;
  crew: string[];
  ships: string[];
  capsules: string[];
  payloads: string[];
  failures: unknown[];
  net: boolean;
  tbd: boolean;
  auto_update: boolean;
  launch_library_id: string | null;
  cores: Core[];
  fairings: Fairings | null;
  links: Links;
  static_fire_date_utc: string | null;
  static_fire_date_unix: number | null;
  window: number | null;
}

export interface Core {
  core: string | null;
  flight: number | null;
  gridfins: boolean | null;
  legs: boolean | null;
  reused: boolean | null;
  landing_attempt: boolean | null;
  landing_success: boolean | null;
  landing_type: string | null;
  landpad: string | null;
}

export interface Fairings {
  reused: boolean | null;
  recovery_attempt: boolean | null;
  recovered: boolean | null;
  ships: string[];
}

export interface Links {
  patch: {
    small: string | null;
    large: string | null;
  };
  reddit: {
    campaign: string | null;
    launch: string | null;
    media: string | null;
    recovery: string | null;
  };
  flickr: {
    small: string[];
    original: string[];
  };
  presskit: string | null;
  webcast: string | null;
  youtube_id: string | null;
  article: string | null;
  wikipedia: string | null;
}

export interface Rocket {
  id: string;
  name: string;
  type: string;
  description: string;
  flickr_images: string[];
}

export interface Launchpad {
  id: string;
  name: string;
  full_name: string;
  locality: string;
  region: string;
  latitude: number;
  longitude: number;
}
