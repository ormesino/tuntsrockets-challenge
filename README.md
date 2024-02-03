# Google Spreadsheet Challenge

### Introduction
In this challenge, the developer must create a script that reads and writes in a Google Spreadsheet containing data about students, their grades, absences and names. Some rules are defined to determine the status of each student based on the absence quantity and the average of their grades.

### Rules 
To define the status, the program must calculate the situation of each student based on the average of the 3 tests (P1, P2 and P3), as the t:

Average (avg)|Status
---|:---:
avg < 5|**"Reprovado por Nota"**
5 <= avg < 7|**"Exame Final"**
avg >= 7|**"Aprovado"**

Besides the conditions above, two other are included:
- If the number of absences exceeds 25% of the total number of lessons, the student will have the status "Reprovado por Falta", regardless of the average.
- If the student's status differs from "Exame Final", fill in the "Nota para Aprovação Final" field with 0.
- If the situation is "Exame Final", it is necessary to calculate the "Nota para Aprovação Final" (naf) for each student according to the following formula:

$$naf = 10 - avg$$

### Script
The script was developed using JavaScript, Node.js and the Google Cloud infrastructure, as it allows the use of the Google Spreadsheet API that's needed to communicate with the spreadsheet. To run the program, you'll need to install the [Node.js](https://nodejs.org/en) and clone this repository. The script needs to be executed only once to update the fields "Situação" and "Nota para Aprovação Final".

To view the spreadsheet and verify if the script is running as expected, you can access it via this [link](https://docs.google.com/spreadsheets/d/1RC6UTsH2-2ba4JApiTE39E9XHgnke9wgd7vNVzBT540/edit?usp=sharing).

After cloning the repository, you need to download the dependencies used on the program, this will be accomplished by executing the following command.
```bash
npm install
```
Finally, you can run the script using this command.
```bash
npm run start
```










