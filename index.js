import { google } from 'googleapis';
import credentials from './credentials.json' assert { type: "json" };

// Google bot credentials and spreadsheet data
const email = credentials.client_email;
const key = credentials.private_key;
const spreadsheetId = '1RC6UTsH2-2ba4JApiTE39E9XHgnke9wgd7vNVzBT540';

// Creating a new Google Auth object
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: email,
    private_key: key,
  },
  scopes: 'https://www.googleapis.com/auth/spreadsheets',
});

// Connecting to Google Sheets API
const client = await auth.getClient();
const sheets = google.sheets({ version: 'v4', auth: client });

// Getting the total of lessons
const totalLessons = await sheets.spreadsheets.values.get({
  spreadsheetId,
  range: 'A2',
}).then((response) => {
  const lessons = response.data.values[0][0];
  return +lessons.split(" ").splice(-1)[0];
});

/**
 * Accesses the students data from the spreadsheet and returns it.
 *
 * @return {Promise<Array<Object>|null>}
 */
async function getStudentsData() {
  const sheets = google.sheets({ version: 'v4', auth: client });
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'A4:F27',
  });

  const students = response.data.values.map((row) => {
    const [id, name, absences, ...grades] = row;
    const avg = grades.reduce((acc, grade) => acc + +grade, 0) / grades.length;

    return {
      id,
      name,
      absences,
      avg,
    };
  });
  console.log("Students data retrieved! ✅");
  return students;
}

/**
 * Reads the students data and defines their status based on the rules.
 *
 * @return {Promise<Array<Array<string|number>>|null>}
 */
async function defineStudentStatus() {
  const students = await getStudentsData();
  const inputData = [];

  students.map((student) => {
    if (student.absences > (totalLessons * 0.25)) {
      inputData.push(['Reprovado por Falta', 0]);
    } else if (student.avg >= 70) {
      inputData.push(['Aprovado', 0]);
    } else if (student.avg <= 50) {
      inputData.push(['Reprovado por Nota', 0]);
    } else {
      let gradeToPass = Math.ceil(100 - student.avg);
      inputData.push(['Exame Final', gradeToPass]);
    }
  })
  console.log("Students status defined! ✅");
  return inputData;
}

/**
 * Updates the students status and grades in the spreadsheet.
 *
 * @return {Promise<void>}
 */
async function updateStudentStatus() {
  const inputData = await defineStudentStatus();
  const sheets = google.sheets({ version: 'v4', auth: client });
  const updateOptions = {
    spreadsheetId,
    range: 'G4:H27',
    valueInputOption: 'USER_ENTERED',
    resource: { values: inputData },
  };

  await sheets.spreadsheets.values.update(updateOptions);
  console.log("Students status and grades updated! ✅")
}

updateStudentStatus();
