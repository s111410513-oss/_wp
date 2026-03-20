## 習題 4

AI 問答 --https://chatgpt.com/share/69bccaf9-b678-8008-a6fb-a0ab1647e4be 

## 我的測試結果

```sh
01.PS C:\Jing\homework\js\_wp\homework\04> node 01-if.js
奇數

02.PS C:\Jing\homework\js\_wp\homework\04> node 02-for.js
55

03.PS C:\Jing\homework\js\_wp\homework\04> node 03-while.js
1
2
3
4
5

04.PS C:\Jing\homework\js\_wp\homework\04> node 04-function.js
Hello, John

05.PS C:\Jing\homework\js\_wp\homework\04> node 05-array.js
apple
banana
orange
grape

06.PS C:\Jing\homework\js\_wp\homework\04> node 06-readdata.js
Tom
20

07.PS C:\Jing\homework\js\_wp\homework\04> node 07-translate.js
Amy

08.PS C:\Jing\homework\js\_wp\homework\04> node 08-gradepass.js
及格

09.PS C:\Jing\homework\js\_wp\homework\04> node 09-maxium.js
最大值: 9

10.PS C:\Jing\homework\js\_wp\homework\04> node 10-score.js
A 及格
B 不及格
C 及格
```

### 摘要

下面是 10 個 JavaScript 練習題，**涵蓋 `if`、`for`、`while`、`function`、`JSON`、`array`、`object`**，每題都有簡單範例方便你理解與練習。

---

## 1️⃣ 判斷奇偶數（if）

```javascript
let num = 7;

if (num % 2 === 0) {
    console.log("偶數");
} else {
    console.log("奇數");
}
```

---

## 2️⃣ 計算 1~10 總和（for）

```javascript
let sum = 0;

for (let i = 1; i <= 10; i++) {
    sum += i;
}

console.log(sum);
```

---

## 3️⃣ 使用 while 計數

```javascript
let i = 1;

while (i <= 5) {
    console.log(i);
    i++;
}
```

---

## 4️⃣ 建立函式（function）

```javascript
function greet(name) {
    return "Hello, " + name;
}

console.log(greet("John"));
```

---

## 5️⃣ 陣列操作（array）

```javascript
let fruits = ["apple", "banana", "orange"];

fruits.push("grape");

for (let i = 0; i < fruits.length; i++) {
    console.log(fruits[i]);
}
```

---

## 6️⃣ 物件（object）

```javascript
let person = {
    name: "Tom",
    age: 20
};

console.log(person.name);
console.log(person.age);
```

---

## 7️⃣ JSON 轉換

```javascript
let jsonString = '{"name":"Amy","age":25}';

let obj = JSON.parse(jsonString);

console.log(obj.name);
```

---

## 8️⃣ 函式 + if 判斷

```javascript
function checkScore(score) {
    if (score >= 60) {
        return "及格";
    } else {
        return "不及格";
    }
}

console.log(checkScore(75));
```

---

## 9️⃣ 陣列找最大值（for + if）

```javascript
let numbers = [3, 7, 2, 9, 5];
let max = numbers[0];

for (let i = 1; i < numbers.length; i++) {
    if (numbers[i] > max) {
        max = numbers[i];
    }
}

console.log("最大值:", max);
```

---

## 🔟 while + object 應用

```javascript
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
```

---

## ✔️ 建議練習方式

你可以試著：

* 修改數字看看結果變化
* 自己加功能（例如：平均值、排序）
* 把程式改成用 `function` 包起來

---

如果你要，我可以幫你升級成「**進階版練習（含題目＋解答分開）**」或「**小專題（例如成績系統）**」。
