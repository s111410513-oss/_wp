function checkScore(score) {
    if (score >= 60) {
        return "及格";
    } else {
        return "不及格";
    }
}

console.log(checkScore(75));
