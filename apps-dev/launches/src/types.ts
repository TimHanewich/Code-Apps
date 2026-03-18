export interface LaunchStatus {
  id: number;
  name: string;
  abbrev: string;
  description: string;
}

export interface NetPrecision {
  id: number;
  name: string;
  abbrev: string;
}

export interface Agency {
  id: number;
  url: string;
  name: string;
  type: string;
}

export interface RocketConfiguration {
  id: number;
  name: string;
  family: string;
  full_name: string;
  variant: string;
}

export interface Orbit {
  id: number;
  name: string;
  abbrev: string;
}

export interface Mission {
  id: number;
  name: string;
  description: string;
  type: string;
  orbit: Orbit | null;
}

export interface PadLocation {
  id: number;
  name: string;
  country_code: string;
}

export interface Pad {
  id: number;
  name: string;
  latitude: string;
  longitude: string;
  location: PadLocation;
  country_code: string;
}

export interface Program {
  id: number;
  name: string;
  description: string;
  image_url: string;
}

export interface Launch {
  id: string;
  name: string;
  slug: string;
  status: LaunchStatus;
  net: string;
  window_start: string;
  window_end: string;
  net_precision: NetPrecision;
  probability: number | null;
  weather_concerns: string | null;
  holdreason: string;
  failreason: string;
  launch_service_provider: Agency;
  rocket: {
    id: number;
    configuration: RocketConfiguration;
  };
  mission: Mission | null;
  pad: Pad;
  webcast_live: boolean;
  image: string | null;
  program: Program[];
}

export interface LaunchResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Launch[];
}
