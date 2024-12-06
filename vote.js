import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getFirestore, collection, doc, addDoc, getDocs, deleteDoc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";

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

// 現在ログイン中のユーザーID（仮。実際にはFirebase Authenticationから取得）
const userId = "user1";

let remainingPoints = 100; // 初期ポイント

// HTML要素の取得
const userInfo = document.getElementById("user-info");
const balance = document.getElementById("balance");
const voteForm = document.getElementById("voteForm");
const historyTableBody = document.querySelector("#historyTable tbody");

// ユーザー情報を仮に表示（実際には認証情報から取得）
userInfo.textContent = "ログイン中: kmc2401@kamiyama.ac.jp";

// 残高を画面に表示
balance.textContent = `残高: ${remainingPoints} ポイント`;

// 投票履歴を保存する関数
async function saveVoteHistory(team, points) {
  const userVotesRef = collection(db, `Users/${userId}/Votes`);
  await addDoc(userVotesRef, {
    team,
    points,
    timestamp: new Date()
  });
}

// Firestoreに投票ポイントを加算する関数
async function addPointsToTeam(team, points) {
  const teamRef = doc(collection(db, "Votes"), team);
  const teamSnapshot = await getDoc(teamRef);

  if (teamSnapshot.exists()) {
    await updateDoc(teamRef, {
      points: teamSnapshot.data().points + points
    });
  } else {
    await setDoc(teamRef, { points });
  }
}

// 投票履歴を取得して表示
async function displayHistory() {
  historyTableBody.innerHTML = ""; // テーブルをクリア

  const userVotesRef = collection(db, `Users/${userId}/Votes`);
  const querySnapshot = await getDocs(userVotesRef);

  querySnapshot.forEach((doc) => {
    const { team, points, timestamp } = doc.data();

    const row = document.createElement("tr");

    // チーム名
    const teamCell = document.createElement("td");
    teamCell.textContent = team;

    // 投票ポイント
    const pointsCell = document.createElement("td");
    pointsCell.textContent = points;

    // 投票日時
    const timestampCell = document.createElement("td");
    timestampCell.textContent = new Date(timestamp.seconds * 1000).toLocaleString();

    // 操作（削除ボタン）
    const actionCell = document.createElement("td");
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "取り消し";
    deleteButton.addEventListener("click", async () => {
      await deleteVote(doc.id, team, points);
    });
    actionCell.appendChild(deleteButton);

    row.appendChild(teamCell);
    row.appendChild(pointsCell);
    row.appendChild(timestampCell);
    row.appendChild(actionCell);

    historyTableBody.appendChild(row);
  });
}

// 投票を取り消す関数
async function deleteVote(voteId, team, points) {
  // 履歴を削除
  await deleteDoc(doc(db, `Users/${userId}/Votes/${voteId}`));

  // チームポイントを減らす
  const teamRef = doc(collection(db, "Votes"), team);
  const teamSnapshot = await getDoc(teamRef);

  if (teamSnapshot.exists()) {
    await updateDoc(teamRef, {
      points: Math.max(teamSnapshot.data().points - points, 0) // ポイントを減算
    });
  }

  // 残高を更新
  remainingPoints += points;
  balance.textContent = `残高: ${remainingPoints} ポイント`;

  // 更新後の履歴を表示
  await displayHistory();
}

// フォームの送信イベント処理
voteForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const team = document.getElementById("team").value;
  const points = parseInt(document.getElementById("points").value);

  if (!team || isNaN(points) || points <= 0 || points > remainingPoints) {
    alert("正しい値を入力してください。");
    return;
  }

  try {
    await addPointsToTeam(team, points); // チームポイントを加算
    await saveVoteHistory(team, points); // ユーザーの投票履歴を保存

    // 残高を更新
    remainingPoints -= points;
    balance.textContent = `残高: ${remainingPoints} ポイント`;

    // 履歴を再表示
    await displayHistory();

    voteForm.reset();
  } catch (error) {
    console.error("投票に失敗しました:", error);
    alert("投票に失敗しました。再試行してください。");
  }
});

// 初回の履歴表示
displayHistory().catch((error) => {
  console.error("履歴の取得に失敗しました:", error);
});

