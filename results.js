import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 表示するチームのリスト（順番固定）
const teams = [
  "Team 1", "Team 2", "Team 3", "Team 4", "Team 5",
  "Team 6", "Team 7", "Team 8", "Team 9", "Team 10",
  "Team 11", "Team 12", "Team 13"
];

// テーブルのデータを表示する関数
async function displayResults() {
  // Firestore からデータを取得
  const votesCollection = collection(db, "Votes");
  const querySnapshot = await getDocs(votesCollection);

  // 初期化: 全チームのポイントを 0 に設定
  const results = {};
  teams.forEach((team) => {
    results[team] = 0;
  });

  // Firestore のデータでポイントを加算
  querySnapshot.forEach((doc) => {
    const { team, points } = doc.data();
    if (results[team] !== undefined) {
      results[team] += points;
    }
  });

  // テーブル要素を取得
  const tableBody = document.querySelector("#resultsTable tbody");
  tableBody.innerHTML = ""; // テーブル内容を初期化

  // `teams` の順番でテーブルに行を追加
  teams.forEach((team) => {
    const row = document.createElement("tr");

    const teamCell = document.createElement("td");
    teamCell.textContent = team;

    const pointsCell = document.createElement("td");
    pointsCell.textContent = results[team]; // ポイント（Firestore データがない場合も 0）

    row.appendChild(teamCell);
    row.appendChild(pointsCell);
    tableBody.appendChild(row);
  });
}

// 関数を実行
displayResults();
