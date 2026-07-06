/**
 * Texas justice courts (seed data). In production this lives in the Supabase
 * `courts` table (see supabase/migrations/0001_init.sql); this constant seeds
 * the table and powers the intake dropdown when the DB is not configured.
 *
 * ⚠️ VERIFY every clerk address and filing note per county before launch.
 */

export interface Court {
  id: string;
  name: string;
  county: string;
  clerkAddress: string;
  filingNotes: string;
}

export const COURTS: Court[] = [
  { id: "harris-jp-1-1", name: "Harris County Justice of the Peace, Precinct 1 Place 1", county: "Harris", clerkAddress: "1302 Preston St, Suite 100, Houston, TX 77002", filingNotes: "E-filing available; in-person filing at the clerk's window during business hours." },
  { id: "harris-jp-1-2", name: "Harris County Justice of the Peace, Precinct 1 Place 2", county: "Harris", clerkAddress: "1302 Preston St, Suite 100, Houston, TX 77002", filingNotes: "E-filing available; in-person filing at the clerk's window during business hours." },
  { id: "harris-jp-2-1", name: "Harris County Justice of the Peace, Precinct 2 Place 1", county: "Harris", clerkAddress: "101 S. Richey St, Suite B, Pasadena, TX 77506", filingNotes: "Bring your case number; ask the clerk to file-stamp your copy." },
  { id: "harris-jp-3-1", name: "Harris County Justice of the Peace, Precinct 3 Place 1", county: "Harris", clerkAddress: "14350 Wallisville Rd, Houston, TX 77049", filingNotes: "Bring your case number; ask the clerk to file-stamp your copy." },
  { id: "harris-jp-4-1", name: "Harris County Justice of the Peace, Precinct 4 Place 1", county: "Harris", clerkAddress: "6831 Cypresswood Dr, Spring, TX 77379", filingNotes: "Bring your case number; ask the clerk to file-stamp your copy." },
  { id: "harris-jp-5-1", name: "Harris County Justice of the Peace, Precinct 5 Place 1", county: "Harris", clerkAddress: "6000 Chimney Rock Rd, Houston, TX 77081", filingNotes: "Bring your case number; ask the clerk to file-stamp your copy." },
  { id: "dallas-jp-1-1", name: "Dallas County Justice of the Peace, Precinct 1 Place 1", county: "Dallas", clerkAddress: "7201 S. Polk St, Suite 100, Dallas, TX 75232", filingNotes: "Bring your case number; ask the clerk to file-stamp your copy." },
  { id: "dallas-jp-1-2", name: "Dallas County Justice of the Peace, Precinct 1 Place 2", county: "Dallas", clerkAddress: "1113 E. Jefferson Blvd, Dallas, TX 75203", filingNotes: "Bring your case number; ask the clerk to file-stamp your copy." },
  { id: "dallas-jp-2-1", name: "Dallas County Justice of the Peace, Precinct 2 Place 1", county: "Dallas", clerkAddress: "10056 Marsh Ln, Suite 137, Dallas, TX 75229", filingNotes: "Bring your case number; ask the clerk to file-stamp your copy." },
  { id: "dallas-jp-3-1", name: "Dallas County Justice of the Peace, Precinct 3 Place 1", county: "Dallas", clerkAddress: "1411 W. Beltline Rd, Suite 200, Richardson, TX 75080", filingNotes: "Bring your case number; ask the clerk to file-stamp your copy." },
  { id: "tarrant-jp-1", name: "Tarrant County Justice of the Peace, Precinct 1", county: "Tarrant", clerkAddress: "100 N. Calhoun St, 2nd Floor, Fort Worth, TX 76196", filingNotes: "Bring your case number; ask the clerk to file-stamp your copy." },
  { id: "tarrant-jp-2", name: "Tarrant County Justice of the Peace, Precinct 2", county: "Tarrant", clerkAddress: "700 E. Abram St, Arlington, TX 76010", filingNotes: "Bring your case number; ask the clerk to file-stamp your copy." },
  { id: "tarrant-jp-3", name: "Tarrant County Justice of the Peace, Precinct 3", county: "Tarrant", clerkAddress: "645 Grapevine Hwy, Suite 100, Hurst, TX 76054", filingNotes: "Bring your case number; ask the clerk to file-stamp your copy." },
  { id: "bexar-jp-1-1", name: "Bexar County Justice of the Peace, Precinct 1 Place 1", county: "Bexar", clerkAddress: "3505 Pleasanton Rd, San Antonio, TX 78221", filingNotes: "Bring your case number; ask the clerk to file-stamp your copy." },
  { id: "bexar-jp-2-1", name: "Bexar County Justice of the Peace, Precinct 2 Place 1", county: "Bexar", clerkAddress: "7723 Guilbeau Rd, San Antonio, TX 78250", filingNotes: "Bring your case number; ask the clerk to file-stamp your copy." },
  { id: "bexar-jp-3-1", name: "Bexar County Justice of the Peace, Precinct 3 Place 1", county: "Bexar", clerkAddress: "320 Interpark Blvd, San Antonio, TX 78216", filingNotes: "Bring your case number; ask the clerk to file-stamp your copy." },
  { id: "travis-jp-1", name: "Travis County Justice of the Peace, Precinct 1", county: "Travis", clerkAddress: "4717 Heflin Ln, Suite 127, Austin, TX 78721", filingNotes: "Bring your case number; ask the clerk to file-stamp your copy." },
  { id: "travis-jp-2", name: "Travis County Justice of the Peace, Precinct 2", county: "Travis", clerkAddress: "10409 Burnet Rd, Suite 150, Austin, TX 78758", filingNotes: "Bring your case number; ask the clerk to file-stamp your copy." },
  { id: "travis-jp-3", name: "Travis County Justice of the Peace, Precinct 3", county: "Travis", clerkAddress: "8656 W. Highway 71, Bldg B, Austin, TX 78735", filingNotes: "Bring your case number; ask the clerk to file-stamp your copy." },
  { id: "travis-jp-5", name: "Travis County Justice of the Peace, Precinct 5", county: "Travis", clerkAddress: "1003 Guadalupe St, Austin, TX 78701", filingNotes: "Bring your case number; ask the clerk to file-stamp your copy." },
  { id: "collin-jp-1", name: "Collin County Justice of the Peace, Precinct 1", county: "Collin", clerkAddress: "920 E. Park Blvd, Suite 210, Plano, TX 75074", filingNotes: "Bring your case number; ask the clerk to file-stamp your copy." },
  { id: "collin-jp-2", name: "Collin County Justice of the Peace, Precinct 2", county: "Collin", clerkAddress: "8585 John Wesley Dr, Frisco, TX 75034", filingNotes: "Bring your case number; ask the clerk to file-stamp your copy." },
  { id: "denton-jp-1", name: "Denton County Justice of the Peace, Precinct 1", county: "Denton", clerkAddress: "1450 E. McKinney St, Denton, TX 76209", filingNotes: "Bring your case number; ask the clerk to file-stamp your copy." },
  { id: "denton-jp-2", name: "Denton County Justice of the Peace, Precinct 2", county: "Denton", clerkAddress: "1029 W. Rosemeade Pkwy, Carrollton, TX 75007", filingNotes: "Bring your case number; ask the clerk to file-stamp your copy." },
  { id: "elpaso-jp-1", name: "El Paso County Justice of the Peace, Precinct 1", county: "El Paso", clerkAddress: "4641 Cohen Ave, Suite A, El Paso, TX 79924", filingNotes: "Bring your case number; ask the clerk to file-stamp your copy." },
  { id: "elpaso-jp-3", name: "El Paso County Justice of the Peace, Precinct 3", county: "El Paso", clerkAddress: "11670 Chito Samaniego Dr, El Paso, TX 79936", filingNotes: "Bring your case number; ask the clerk to file-stamp your copy." },
  { id: "fortbend-jp-1", name: "Fort Bend County Justice of the Peace, Precinct 1", county: "Fort Bend", clerkAddress: "500 Liberty St, Suite 100, Richmond, TX 77469", filingNotes: "Bring your case number; ask the clerk to file-stamp your copy." },
  { id: "fortbend-jp-2", name: "Fort Bend County Justice of the Peace, Precinct 2", county: "Fort Bend", clerkAddress: "303 Texas Pkwy, Suite 132, Missouri City, TX 77489", filingNotes: "Bring your case number; ask the clerk to file-stamp your copy." },
  { id: "hidalgo-jp-1-1", name: "Hidalgo County Justice of the Peace, Precinct 1 Place 1", county: "Hidalgo", clerkAddress: "2812 S. Business Hwy 281, Edinburg, TX 78539", filingNotes: "Bring your case number; ask the clerk to file-stamp your copy." },
  { id: "montgomery-jp-1", name: "Montgomery County Justice of the Peace, Precinct 1", county: "Montgomery", clerkAddress: "300 N. Main St, Suite 100, Conroe, TX 77301", filingNotes: "Bring your case number; ask the clerk to file-stamp your copy." },
  { id: "williamson-jp-1", name: "Williamson County Justice of the Peace, Precinct 1", county: "Williamson", clerkAddress: "4th Floor, 405 Martin Luther King St, Georgetown, TX 78626", filingNotes: "Bring your case number; ask the clerk to file-stamp your copy." },
  { id: "cameron-jp-2-1", name: "Cameron County Justice of the Peace, Precinct 2 Place 1", county: "Cameron", clerkAddress: "964 E. Harrison St, Brownsville, TX 78520", filingNotes: "Bring your case number; ask the clerk to file-stamp your copy." },
];

export function findCourt(id: string | undefined | null): Court | undefined {
  return COURTS.find((c) => c.id === id);
}
