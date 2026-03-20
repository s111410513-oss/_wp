let students = [
    { name: "A", score: 80 },
    { name: "B", score: 55 },
    { name: "C", score: 90 }
];

let i = 0;

while (i < students.length) {
    if (students[i].score >= 60) {
        console.log(students[i].name + " 及格");
    } else {
        console.log(students[i].name + " 不及格");
    }
    i++;
}
