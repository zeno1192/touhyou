import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";

// Firebase 設定
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

// チームリスト（1から13の順番で固定）
const teams = [
  "Team 1", "Team 2", "Team 3", "Team 4", "Team 5",
  "Team 6", "Team 7", "Team 8", "Team 9", "Team 10",
  "Team 11", "Team 12", "Team 13"
];

// テーブルにチームとポイントを表示する関数
async function displayResults() {
  const votesCollection = collection(db, "Votes"); // コレクション名: Votes
  const querySnapshot = await getDocs(votesCollection);

  // 初期化: 全チームのポイントを0に設定
  const results = {};
  teams.forEach((team) => {
    results[team] = 0;
  });

  // Firestore のデータを results にマージ
  querySnapshot.forEach((doc) => {
    const team = doc.id; // ドキュメントID（チーム名）
    const { points } = doc.data(); // Firestore のデータ
    if (results[team] !== undefined) {
      results[team] += points;
    }
  });

  // テーブルの <tbody> を取得
  const tableBody = document.querySelector("#resultsTable tbody");
  tableBody.innerHTML = ""; // テーブル内容を初期化

  // チーム順にテーブル行を生成
  teams.forEach((team) => {
    const row = document.createElement("tr");

    // チーム名セル
    const teamCell = document.createElement("td");
    teamCell.textContent = team;

    // ポイントセル
    const pointsCell = document.createElement("td");
    pointsCell.textContent = results[team];

    // 行をテーブルに追加
    row.appendChild(teamCell);
    row.appendChild(pointsCell);
    tableBody.appendChild(row);
  });
}

// 結果を表示
displayResults().catch((error) => {
  console.error("投票結果の取得に失敗しました:", error);
  const tableBody = document.querySelector("#resultsTable tbody");
  tableBody.innerHTML = "<tr><td colspan='2'>データの取得に失敗しました。</td></tr>";
});
