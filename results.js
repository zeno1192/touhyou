import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCSJNkXlmr1xToKV6iR_o9Sp3gLsqqd6eA",
  authDomain: "touhyouproject.firebaseapp.com",
  projectId: "touhyouproject",
  storageBucket: "touhyouproject.firebasestorage.app",
  messagingSenderId: "662619066348",
  appId: "1:662619066348:web:6924f4dfb8c47de7097ac9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// チームリスト（表示順を固定）
const teams = [
  "Team 1", "Team 2", "Team 3", "Team 4", "Team 5",
  "Team 6", "Team 7", "Team 8", "Team 9", "Team 10",
  "Team 11", "Team 12", "Team 13"
];

// 投票データを取得してテーブルに表示
async function displayResults() {
  const votesCollection = collection(db, "Votes");
  const querySnapshot = await getDocs(votesCollection);

  // 結果を初期化（すべてのチームを0ポイントに設定）
  const results = {};
  teams.forEach((team) => {
    results[team] = 0;
  });

  // Firestore データでポイントを更新
  querySnapshot.forEach((doc) => {
    const { team, points } = doc.data();
    if (results[team] !== undefined) {
      results[team] += points;
    }
  });

  // テーブルにデータを挿入
  const tableBody = document.querySelector("#resultsTable tbody");
  tableBody.innerHTML = ""; // 既存の内容をクリア

  teams.forEach((team) => {
    const row = document.createElement("tr");

    const teamCell = document.createElement("td");
    teamCell.textContent = team;

    const pointsCell = document.createElement("td");
    pointsCell.textContent = results[team];

    row.appendChild(teamCell);
    row.appendChild(pointsCell);

    tableBody.appendChild(row);
  });
}

// 実行
displayResults();
