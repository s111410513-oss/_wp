10.學生成績判斷(while + object 應用)

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

## 我的測試結果

```sh
....

PS C:\Jing\homework\js\_wp\homework\04> node 10-score.js
A 及格
B 不及格
C 及格
```
