// Approved installer list. Intentionally empty until the client supplies real entries.
export interface ApprovedInstaller {
  name: string;
  region?: string;
  website?: string;
}

export const approvedInstallers: ApprovedInstaller[] = [];
