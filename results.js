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

// 投票データを取得してテーブルに表示
async function displayResults() {
  const votesCollection = collection(db, "Votes"); // Firestore コレクション名に合わせる
  const querySnapshot = await getDocs(votesCollection);

  const results = {};

  querySnapshot.forEach((doc) => {
    const { team, points } = doc.data();
    if (!results[team]) {
      results[team] = 0;
    }
    results[team] += points;
  });

  // テーブルにデータを挿入
  const tableBody = document.querySelector("#resultsTable tbody");
  tableBody.innerHTML = ""; // 既存の内容をクリア

  Object.entries(results).forEach(([team, points]) => {
    const row = document.createElement("tr");

    const teamCell = document.createElement("td");
    teamCell.textContent = team;

    const pointsCell = document.createElement("td");
    pointsCell.textContent = points;

    row.appendChild(teamCell);
    row.appendChild(pointsCell);

    tableBody.appendChild(row);
  });
}

// 実行
displayResults();


displayResults();
